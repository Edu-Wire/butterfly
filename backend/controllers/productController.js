import connectDB from "../lib/db.js";
import Product from "../models/Product.js";
import Collection from "../models/Collection.js";
import Category from "../models/Category.js";
import Inventory from "../models/inventory.js";
import { verifyToken } from "../lib/jwt.js";
import redis from "../lib/redis.js";

const CACHE_KEYS = {
    PRODUCTS_ALL: "products:all",
    PRODUCTS_ADMIN: "products:admin",
    PRODUCT_DETAIL: (id) => `product:${id}`,
};
const CACHE_TTL = 3600;

const isAdmin = (req) => {
    try {
        const auth = req.headers.authorization;
        if (!auth || auth === "Bearer null") return null;
        return verifyToken(auth.split(" ")[1]);
    } catch {
        return null;
    }
};

export class ProductController {
    static async getAll(req, res) {
        try {
            const user = isAdmin(req);
            const isUserAdmin = user && user.role === "admin";
            const filter = isUserAdmin ? {} : { isActive: true };
            const cacheKey = isUserAdmin ? CACHE_KEYS.PRODUCTS_ADMIN : CACHE_KEYS.PRODUCTS_ALL;

            if (redis) {
                try {
                    const cachedData = await redis.get(cacheKey);
                    if (cachedData) {
                        return res.json({ success: true, products: JSON.parse(cachedData), fromCache: true });
                    }
                } catch (err) {
                    console.error("[Redis] Get error:", err);
                }
            }

            await connectDB();
            const products = await Product.find(filter);
            const allInventory = await Inventory.find({});

            const transformedProducts = products.map((product) => {
                const productInventory = allInventory.filter(
                    (inv) => inv.productId.toString() === product._id.toString()
                );
                const totalAvailableStock = productInventory.reduce(
                    (sum, inv) => sum + ((inv.totalStock || 0) - (inv.reservedStock || 0)),
                    0
                );
                return {
                    ...product.toObject(),
                    id: product._id.toString(),
                    color: product.colors?.[0] || "",
                    size: product.sizes || [],
                    reviews: product.reviewsCount || 0,
                    imageUrl: product.images?.[0] || "",
                    image: product.imageGradient || "",
                    inStock: productInventory.length > 0 && totalAvailableStock > 0,
                };
            });

            if (redis) {
                try {
                    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(transformedProducts));
                } catch (err) {
                    console.error("[Redis] Set error:", err);
                }
            }

            res.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=59");
            return res.json({ success: true, products: transformedProducts });
        } catch (error) {
            console.error("[Products] GET error:", error);
            return res.status(500).json({ success: false, message: error.message || "Failed to fetch products" });
        }
    }

    static async create(req, res) {
        try {
            await connectDB();
            const body = req.body;
            const createData = { ...body };

            if (body.size && Array.isArray(body.size)) {
                createData.sizes = body.size;
                delete createData.size;
            }
            delete createData.reviews;
            delete createData.imageUrl;
            delete createData.image;
            delete createData.color;
            delete createData._id;
            delete createData.id;

            const product = await Product.create(createData);

            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.PRODUCTS_ALL, CACHE_KEYS.PRODUCTS_ADMIN);
                } catch (err) {
                    console.error("[Redis] Invalidation error:", err);
                }
            }

            if (body.collectionName) {
                const slug = body.collectionName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "");
                await Collection.findOneAndUpdate(
                    { name: body.collectionName },
                    { $addToSet: { products: product._id }, $setOnInsert: { slug, isActive: true } },
                    { upsert: true, new: true }
                );
            }

            if (body.category) {
                const update = { $setOnInsert: { name: body.category, isActive: true } };
                if (body.subCategory) update.$addToSet = { subCategories: body.subCategory };
                await Category.findOneAndUpdate({ name: body.category }, update, { upsert: true, new: true });
            }

            const transformedProduct = {
                ...product.toObject(),
                id: product._id.toString(),
                color: product.colors?.[0] || "",
                size: product.sizes || [],
                reviews: product.reviewsCount || 0,
                imageUrl: product.images?.[0] || "",
                image: product.imageGradient || "",
            };

            return res.status(201).json({ success: true, data: transformedProduct });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getById(req, res) {
        const { id } = req.params;
        const cacheKey = CACHE_KEYS.PRODUCT_DETAIL(id);

        try {
            if (redis) {
                try {
                    const cachedData = await redis.get(cacheKey);
                    if (cachedData) {
                        return res.json({ success: true, data: JSON.parse(cachedData), fromCache: true });
                    }
                } catch (err) {
                    console.error("[Redis] Get error:", err);
                }
            }

            await connectDB();
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            const inventoryItems = await Inventory.find({ productId: id });
            const totalAvailableStock = inventoryItems.reduce(
                (sum, item) => sum + ((item.totalStock || 0) - (item.reservedStock || 0)),
                0
            );

            const transformedProduct = {
                ...product.toObject(),
                id: product._id.toString(),
                color: product.colors?.[0] || "",
                size: product.sizes || [],
                reviews: product.reviewsCount || 0,
                imageUrl: product.images?.[0] || "",
                image: product.imageGradient || "",
                inStock: inventoryItems.length > 0 && totalAvailableStock > 0,
                inventory: inventoryItems.map((item) => ({
                    color: item.color,
                    size: item.size,
                    available: item.totalStock - item.reservedStock > 0,
                    availableStock: item.totalStock - item.reservedStock,
                })),
            };

            if (redis) {
                try {
                    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(transformedProduct));
                } catch (err) {
                    console.error("[Redis] Set error:", err);
                }
            }

            res.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=59");
            return res.json({ success: true, data: transformedProduct });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async update(req, res) {
        await connectDB();
        const { id } = req.params;
        try {
            const { _id, id: bodyId, createdAt, updatedAt, ...rawData } = req.body;
            const updateData = { ...rawData };

            if (rawData.size && Array.isArray(rawData.size)) {
                updateData.sizes = rawData.size;
                delete updateData.size;
            }
            delete updateData.reviews;
            delete updateData.imageUrl;
            delete updateData.image;
            delete updateData.color;
            delete updateData.inventory;

            const product = await Product.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (redis) {
                try {
                    await redis.del(
                        CACHE_KEYS.PRODUCTS_ALL,
                        CACHE_KEYS.PRODUCTS_ADMIN,
                        CACHE_KEYS.PRODUCT_DETAIL(id)
                    );
                } catch (err) {
                    console.error("[Redis] Invalidation error:", err);
                }
            }

            if (req.body.collectionName) {
                const slug = req.body.collectionName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "");
                await Collection.findOneAndUpdate(
                    { name: req.body.collectionName },
                    { $addToSet: { products: product._id }, $setOnInsert: { slug, isActive: true } },
                    { upsert: true, new: true }
                );
            }

            if (req.body.category) {
                const update = { $setOnInsert: { name: req.body.category, isActive: true } };
                if (req.body.subCategory) update.$addToSet = { subCategories: req.body.subCategory };
                await Category.findOneAndUpdate({ name: req.body.category }, update, { upsert: true, new: true });
            }

            const inventoryItems = await Inventory.find({ productId: product._id });
            const totalAvailableStock = inventoryItems.reduce(
                (sum, item) => sum + ((item.totalStock || 0) - (item.reservedStock || 0)),
                0
            );

            const transformedProduct = {
                ...product.toObject(),
                id: product._id.toString(),
                color: product.colors?.[0] || "",
                size: product.sizes || [],
                reviews: product.reviewsCount || 0,
                imageUrl: product.images?.[0] || "",
                image: product.imageGradient || "",
                inStock: inventoryItems.length > 0 && totalAvailableStock > 0,
                inventory: inventoryItems.map((item) => ({
                    color: item.color,
                    size: item.size,
                    available: item.totalStock - item.reservedStock > 0,
                    availableStock: item.totalStock - item.reservedStock,
                })),
            };

            return res.json({ success: true, data: transformedProduct });
        } catch (error) {
            console.error(`[ProductController] Update error for ${id}:`, error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async delete(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            await Product.findByIdAndDelete(id);

            if (redis) {
                try {
                    await redis.del(
                        CACHE_KEYS.PRODUCTS_ALL,
                        CACHE_KEYS.PRODUCTS_ADMIN,
                        CACHE_KEYS.PRODUCT_DETAIL(id)
                    );
                } catch (err) {
                    console.error("[Redis] Invalidation error:", err);
                }
            }

            return res.json({ success: true, message: "Product deleted successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async bulkCreate(req, res) {
        try {
            await connectDB();
            const { products } = req.body;

            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ success: false, message: "Invalid products array" });
            }

            const productsToCreate = products.map((p) => ({
                ...p,
                images: Array.isArray(p.images) ? p.images : p.imageUrl ? [p.imageUrl] : [],
                sizes: Array.isArray(p.sizes) ? p.sizes : ["S", "M", "L"],
                isActive: p.isActive !== undefined ? p.isActive : true,
                inStock: p.inStock !== undefined ? p.inStock : true,
            }));

            const createdProducts = await Product.insertMany(productsToCreate);

            const collectionMap = {};
            createdProducts.forEach((p) => {
                if (p.collectionName) {
                    if (!collectionMap[p.collectionName]) collectionMap[p.collectionName] = [];
                    collectionMap[p.collectionName].push(p._id);
                }
            });

            await Promise.all(
                Object.entries(collectionMap).map(([colName, pIds]) =>
                    Collection.findOneAndUpdate(
                        { name: colName },
                        { $addToSet: { products: { $each: pIds } } }
                    )
                )
            );

            const categoryMap = {};
            createdProducts.forEach((p) => {
                if (p.category) {
                    if (!categoryMap[p.category]) categoryMap[p.category] = new Set();
                    if (p.subCategory) categoryMap[p.category].add(p.subCategory);
                }
            });

            await Promise.all(
                Object.entries(categoryMap).map(([catName, subCats]) => {
                    const subCatsArray = Array.from(subCats);
                    const update = { $setOnInsert: { name: catName, isActive: true } };
                    if (subCatsArray.length > 0) update.$addToSet = { subCategories: { $each: subCatsArray } };
                    return Category.findOneAndUpdate({ name: catName }, update, { upsert: true, new: true });
                })
            );

            return res.status(201).json({
                success: true,
                message: `${createdProducts.length} products created successfully`,
                data: createdProducts,
            });
        } catch (error) {
            console.error("[Products Bulk] POST error:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}
