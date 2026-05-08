import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Collection from "@/models/Collection";
import Category from "@/models/Category";
import Inventory from "@/models/inventory";
import { verifyToken } from "@/lib/jwt";
import redis from "@/lib/redis";

const CACHE_KEYS = {
    PRODUCTS_ALL: 'products:all',
    PRODUCTS_ADMIN: 'products:admin',
    PRODUCT_DETAIL: (id) => `product:${id}`
};

const CACHE_TTL = 3600; // 1 hour

// Helper: admin check
const isAdmin = (req) => {
    try {
        const auth = req.headers.get("authorization");
        if (!auth || auth === "Bearer null") return null;
        const token = auth.split(" ")[1];
        return verifyToken(token);
    } catch (e) {
        return null;
    }
};

export class ProductController {

    // GET ALL PRODUCTS
    static async getAll(req) {
        try {
            const user = isAdmin(req);
            const isUserAdmin = user && user.role === "admin";
            const filter = isUserAdmin ? {} : { isActive: true };
            const cacheKey = isUserAdmin ? CACHE_KEYS.PRODUCTS_ADMIN : CACHE_KEYS.PRODUCTS_ALL;

            // Try to get from cache
            if (redis) {
                try {
                    const cachedData = await redis.get(cacheKey);
                    if (cachedData) {
                        console.log(`[Cache] Serving ${cacheKey} from Redis`);
                        return NextResponse.json({ success: true, products: JSON.parse(cachedData), fromCache: true });
                    }
                } catch (err) {
                    console.error('[Redis] Get error:', err);
                }
            }

            await connectDB();
            const products = await Product.find(filter);
            const allInventory = await Inventory.find({});

            // Transform MongoDB documents to match frontend interface
            const transformedProducts = products.map(product => {
                const productInventory = allInventory.filter(inv => inv.productId.toString() === product._id.toString());
                const hasInventory = productInventory.length > 0;
                const totalAvailableStock = productInventory.reduce((sum, inv) => sum + ((inv.totalStock || 0) - (inv.reservedStock || 0)), 0);
                const isActuallyInStock = hasInventory && totalAvailableStock > 0;

                return {
                    ...product.toObject(),
                    id: product._id.toString(), // Convert ObjectId to string and assign to id
                    color: product.colors?.[0] || '', // Use first color for backward compatibility
                    size: product.sizes || [], // Map sizes field
                    reviews: product.reviewsCount || 0, // Map reviewsCount to reviews
                    imageUrl: product.images?.[0] || '', // Use first image for backward compatibility
                    image: product.imageGradient || '', // Map imageGradient to image
                    inStock: isActuallyInStock // Override with real inventory status
                };
            });

            // Save to cache
            if (redis) {
                try {
                    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(transformedProducts));
                    console.log(`[Cache] Saved ${cacheKey} to Redis`);
                } catch (err) {
                    console.error('[Redis] Set error:', err);
                }
            }

            return NextResponse.json(
                { success: true, products: transformedProducts },
                {
                    headers: {
                        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59'
                    }
                }
            );
        } catch (error) {
            console.error('[API Products] GET error:', error);
            return NextResponse.json({
                success: false,
                message: error.message || "Failed to fetch products"
            }, { status: 500 });
        }
    }

    // CREATE PRODUCT (ADMIN)
    static async create(req) {
        try {
            await connectDB();

            // const user = isAdmin(req);
            // if (!user || user.role !== "admin") {
            //   return NextResponse.json(
            //     { message: "Admin access only" },
            //     { status: 403 }
            //   );
            // }

            const body = await req.json();

            // Map and filter fields to match Mongoose schema
            const createData = { ...body };

            // Map frontend 'size' to backend 'sizes'
            if (body.size && Array.isArray(body.size)) {
                createData.sizes = body.size;
                delete createData.size;
            }

            // Remove computed fields
            delete createData.reviews;
            delete createData.imageUrl;
            delete createData.image;
            delete createData.color;
            delete createData._id;
            delete createData.id;

            const product = await Product.create(createData);

            // Invalidate cache
            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.PRODUCTS_ALL, CACHE_KEYS.PRODUCTS_ADMIN);
                    console.log('[Cache] Invalidated product lists');
                } catch (err) {
                    console.error('[Redis] Invalidation error:', err);
                }
            }

            // Link product to collection if collectionName is provided
            if (body.collectionName) {
                const slug = body.collectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                await Collection.findOneAndUpdate(
                    { name: body.collectionName },
                    {
                        $addToSet: { products: product._id },
                        $setOnInsert: { slug: slug, isActive: true }
                    },
                    { upsert: true, new: true }
                );
            }

            // Update Category and SubCategory
            if (body.category) {
                const update = { $setOnInsert: { name: body.category, isActive: true } };
                if (body.subCategory) {
                    update.$addToSet = { subCategories: body.subCategory };
                }
                await Category.findOneAndUpdate(
                    { name: body.category },
                    update,
                    { upsert: true, new: true }
                );
            }

            // Transform MongoDB document to match frontend interface
            const transformedProduct = {
                ...product.toObject(),
                id: product._id.toString(), // Convert ObjectId to string and assign to id
                color: product.colors?.[0] || '', // Use first color for backward compatibility
                size: product.sizes || [], // Map sizes field
                reviews: product.reviewsCount || 0, // Map reviewsCount to reviews
                imageUrl: product.images?.[0] || '', // Use first image for backward compatibility
                image: product.imageGradient || '', // Map imageGradient to image
            };

            return NextResponse.json(
                { success: true, data: transformedProduct },
                { status: 201 }
            );
        } catch (error) {
            return NextResponse.json(
                { message: error.message },
                { status: 500 }
            );
        }
    }

    // GET PRODUCT BY ID
    static async getById(req, { params }) {
        const { id } = await params;
        const cacheKey = CACHE_KEYS.PRODUCT_DETAIL(id);

        try {
            // Try to get from cache
            if (redis) {
                try {
                    const cachedData = await redis.get(cacheKey);
                    if (cachedData) {
                        console.log(`[Cache] Serving ${cacheKey} from Redis`);
                        return NextResponse.json({ success: true, data: JSON.parse(cachedData), fromCache: true });
                    }
                } catch (err) {
                    console.error('[Redis] Get error:', err);
                }
            }

            await connectDB();
            const product = await Product.findById(id);
            if (!product) {
                return NextResponse.json(
                    { message: "Product not found" },
                    { status: 404 }
                );
            }

            // Check inventory status
            const inventoryItems = await Inventory.find({ productId: id });
            const hasInventory = inventoryItems.length > 0;
            const totalAvailableStock = inventoryItems.reduce((sum, item) => sum + ((item.totalStock || 0) - (item.reservedStock || 0)), 0);

            // A product is in stock ONLY if it has an inventory record AND available stock > 0
            const isActuallyInStock = hasInventory && totalAvailableStock > 0;

            // Transform MongoDB document to match frontend interface
            const transformedProduct = {
                ...product.toObject(),
                id: product._id.toString(), // Convert ObjectId to string and assign to id
                color: product.colors?.[0] || '', // Use first color for backward compatibility
                size: product.sizes || [], // Map sizes field
                reviews: product.reviewsCount || 0, // Map reviewsCount to reviews
                imageUrl: product.images?.[0] || '', // Use first image for backward compatibility
                image: product.imageGradient || '', // Map imageGradient to image
                inStock: isActuallyInStock, // Override with real inventory status
                inventory: inventoryItems.map(item => ({
                    color: item.color,
                    size: item.size,
                    available: (item.totalStock - item.reservedStock) > 0,
                    availableStock: item.totalStock - item.reservedStock
                }))
            };

            // Save to cache
            if (redis) {
                try {
                    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(transformedProduct));
                    console.log(`[Cache] Saved ${cacheKey} to Redis`);
                } catch (err) {
                    console.error('[Redis] Set error:', err);
                }
            }

            return NextResponse.json(
                { success: true, data: transformedProduct },
                {
                    headers: {
                        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59'
                    }
                }
            );
        } catch (error) {
            console.error(`[ProductController] getById error for ${id}:`, error);
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }
    }

    static async update(req, { params }) {
        await connectDB();
        const { id } = await params;
        try {
            const body = await req.json();
            console.log(`[ProductController] Updating product ${id} with body:`, JSON.stringify(body, null, 2));

            // Remove immutable fields or fields that shouldn't be updated directly via body
            const { _id, id: bodyId, createdAt, updatedAt, ...rawData } = body;

            // Map and filter fields to match Mongoose schema
            const updateData = { ...rawData };

            // Map frontend 'size' to backend 'sizes' if singular size exists
            if (rawData.size && Array.isArray(rawData.size)) {
                updateData.sizes = rawData.size;
                delete updateData.size;
            }

            // Remove computed fields that should not be saved to Mongoose
            // (they are re-computed on GET by the controller)
            delete updateData.reviews;
            delete updateData.imageUrl;
            delete updateData.image;
            delete updateData.color;
            delete updateData.inventory;

            const product = await Product.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!product) {
                return NextResponse.json(
                    { message: "Product not found" },
                    { status: 404 }
                );
            }

            // Invalidate cache
            if (redis) {
                try {
                    await redis.del(
                        CACHE_KEYS.PRODUCTS_ALL,
                        CACHE_KEYS.PRODUCTS_ADMIN,
                        CACHE_KEYS.PRODUCT_DETAIL(id)
                    );
                    console.log(`[Cache] Invalidated product info for ${id}`);
                } catch (err) {
                    console.error('[Redis] Invalidation error:', err);
                }
            }

            // Upsert Collection if provided
            if (body.collectionName) {
                const slug = body.collectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                await Collection.findOneAndUpdate(
                    { name: body.collectionName },
                    {
                        $addToSet: { products: product._id },
                        $setOnInsert: { slug: slug, isActive: true }
                    },
                    { upsert: true, new: true }
                );
            }

            // Upsert Category/SubCategory if provided
            if (body.category) {
                const update = { $setOnInsert: { name: body.category, isActive: true } };
                if (body.subCategory) {
                    update.$addToSet = { subCategories: body.subCategory };
                }
                await Category.findOneAndUpdate(
                    { name: body.category },
                    update,
                    { upsert: true, new: true }
                );
            }

            // Fetch final state with inventory for consistent UI refresh
            const inventoryItems = await Inventory.find({ productId: product._id });
            const hasInventory = inventoryItems.length > 0;
            const totalAvailableStock = inventoryItems.reduce((sum, item) => sum + ((item.totalStock || 0) - (item.reservedStock || 0)), 0);
            const isActuallyInStock = hasInventory && totalAvailableStock > 0;

            // Transform MongoDB document to match frontend interface
            const transformedProduct = {
                ...product.toObject(),
                id: product._id.toString(), // Convert ObjectId to string and assign to id
                color: product.colors?.[0] || '', // Use first color for backward compatibility
                size: product.sizes || [], // Map sizes field
                reviews: product.reviewsCount || 0, // Map reviewsCount to reviews
                imageUrl: product.images?.[0] || '', // Use first image for backward compatibility
                image: product.imageGradient || '', // Map imageGradient to image
                inStock: isActuallyInStock,
                inventory: inventoryItems.map(item => ({
                    color: item.color,
                    size: item.size,
                    available: (item.totalStock - item.reservedStock) > 0,
                    availableStock: item.totalStock - item.reservedStock
                }))
            };

            return NextResponse.json({ success: true, data: transformedProduct });
        } catch (error) {
            console.error(`[ProductController] Update error for ${id}:`, error);
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }
    }

    // DELETE PRODUCT (ADMIN)
    static async delete(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;

            // const user = isAdmin(req);
            // if (!user || user.role !== "admin") {
            //   return NextResponse.json(
            //     { message: "Admin access only" },
            //     { status: 403 }
            //   );
            // }

            await Product.findByIdAndDelete(id);

            // Invalidate cache
            if (redis) {
                try {
                    await redis.del(
                        CACHE_KEYS.PRODUCTS_ALL,
                        CACHE_KEYS.PRODUCTS_ADMIN,
                        CACHE_KEYS.PRODUCT_DETAIL(id)
                    );
                    console.log(`[Cache] Invalidated product lists and detail for ${id}`);
                } catch (err) {
                    console.error('[Redis] Invalidation error:', err);
                }
            }

            return NextResponse.json({
                success: true,
                message: "Product deleted successfully",
            });
        } catch (error) {
            console.error(`[ProductController] Delete error for ${id}:`, error);
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }
    }
}
