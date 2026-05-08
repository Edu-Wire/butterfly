import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/models/Collection";
import { verifyToken } from "@/lib/jwt";
import redis from "@/lib/redis";

const CACHE_KEYS = {
    COLLECTIONS_ALL: 'collections:all',
    COLLECTIONS_ADMIN: 'collections:admin',
    COLLECTION_DETAIL: (id) => `collection:${id}`
};

const CACHE_TTL = 3600; // 1 hour

// Helper
const getUser = (req) => {
    try {
        const auth = req.headers.get("authorization");
        if (!auth || auth === "Bearer null") return null;
        return verifyToken(auth.split(" ")[1]);
    } catch (e) {
        return null;
    }
};

export class CollectionController {

    // GET ALL COLLECTIONS
    static async getAll(req) {
        try {
            await connectDB();
            const user = getUser(req);
            const isUserAdmin = user && user.role === "admin";
            const filter = isUserAdmin ? {} : { isActive: true };
            const cacheKey = isUserAdmin ? CACHE_KEYS.COLLECTIONS_ADMIN : CACHE_KEYS.COLLECTIONS_ALL;

            // Try to get from cache
            if (redis) {
                try {
                    const cachedData = await redis.get(cacheKey);
                    if (cachedData) {
                        console.log(`[Cache] Serving ${cacheKey} from Redis`);
                        return NextResponse.json({ success: true, collections: JSON.parse(cachedData), fromCache: true });
                    }
                } catch (err) {
                    console.error('[Redis] Get error:', err);
                }
            }

            const collections = await Collection.find(filter).populate("products").sort({ order: 1, createdAt: -1 });

            // Save to cache
            if (redis) {
                try {
                    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(collections));
                    console.log(`[Cache] Saved ${cacheKey} to Redis`);
                } catch (err) {
                    console.error('[Redis] Set error:', err);
                }
            }

            return NextResponse.json({ success: true, collections });
        } catch (error) {
            console.error('[API Collections] GET error:', error);
            return NextResponse.json({
                success: false,
                message: error.message || "Failed to fetch collections"
            }, { status: 500 });
        }
    }

    // CREATE COLLECTION (ADMIN)
    static async create(req) {
        try {
            await connectDB();
            // const user = getUser(req);
            // if (!user || user.role !== "admin") return NextResponse.json({ message: "Admin access only" }, { status: 403 });

            console.log('Collection create request received');
            const body = await req.json();
            console.log('Request body:', body);
            
            const collection = await Collection.create(body);
            console.log('Created collection:', collection);

            // Invalidate cache
            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.COLLECTIONS_ALL, CACHE_KEYS.COLLECTIONS_ADMIN);
                    console.log('[Cache] Invalidated collection lists');
                } catch (err) {
                    console.error('[Redis] Invalidation error:', err);
                }
            }

            return NextResponse.json(
                { success: true, data: collection },
                { status: 201 }
            );
        } catch (error) {
            return NextResponse.json(
                { message: error.message },
                { status: 500 }
            );
        }
    }

    // GET SINGLE COLLECTION (ById or Slug)
    static async getById(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;
            const cacheKey = CACHE_KEYS.COLLECTION_DETAIL(id);

            // Try to get from cache
            if (redis) {
                try {
                    const cachedData = await redis.get(cacheKey);
                    if (cachedData) {
                        console.log(`[Cache] Serving ${cacheKey} from Redis`);
                        return NextResponse.json({ success: true, collection: JSON.parse(cachedData), fromCache: true });
                    }
                } catch (err) {
                    console.error('[Redis] Get error:', err);
                }
            }

            let collection;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                collection = await Collection.findById(id).populate("products");
            } else {
                collection = await Collection.findOne({ slug: id }).populate("products");
            }

            if (!collection) {
                return NextResponse.json(
                    { message: "Collection not found" },
                    { status: 404 }
                );
            }

            // Save to cache
            if (redis) {
                try {
                    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(collection));
                    console.log(`[Cache] Saved ${cacheKey} to Redis`);
                } catch (err) {
                    console.error('[Redis] Set error:', err);
                }
            }

            return NextResponse.json({ success: true, collection });
        } catch (error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }

    // UPDATE COLLECTION
    static async update(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;
            const body = await req.json();

            const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };

            const collection = await Collection.findOneAndUpdate(
                query,
                { $set: body },
                { new: true, runValidators: true }
            ).populate("products");

            if (!collection) {
                return NextResponse.json(
                    { message: "Collection not found" },
                    { status: 404 }
                );
            }

            // Invalidate cache
            if (redis) {
                try {
                    await redis.del(
                        CACHE_KEYS.COLLECTIONS_ALL,
                        CACHE_KEYS.COLLECTIONS_ADMIN,
                        CACHE_KEYS.COLLECTION_DETAIL(id),
                        CACHE_KEYS.COLLECTION_DETAIL(collection.slug)
                    );
                    console.log(`[Cache] Invalidated collection info for ${id}`);
                } catch (err) {
                    console.error('[Redis] Invalidation error:', err);
                }
            }

            return NextResponse.json({ success: true, collection });
        } catch (error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }

    // DELETE COLLECTION
    static async delete(req, { params }) {
        await connectDB();
        const { id } = await params;

        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
        const result = await Collection.findOneAndDelete(query);

        if (!result) {
            return NextResponse.json(
                { message: "Collection not found" },
                { status: 404 }
            );
        }

        // Invalidate cache
        if (redis) {
            try {
                await redis.del(
                    CACHE_KEYS.COLLECTIONS_ALL,
                    CACHE_KEYS.COLLECTIONS_ADMIN,
                    CACHE_KEYS.COLLECTION_DETAIL(id),
                    CACHE_KEYS.COLLECTION_DETAIL(result.slug)
                );
                console.log(`[Cache] Invalidated collection lists and detail for ${id}`);
            } catch (err) {
                console.error('[Redis] Invalidation error:', err);
            }
        }

        return NextResponse.json({ success: true, message: "Collection deleted" });
    }

    // REORDER COLLECTIONS
    static async reorder(req) {
        try {
            await connectDB();
            const { orderedIds } = await req.json();

            if (!orderedIds || !Array.isArray(orderedIds)) {
                return NextResponse.json(
                    { message: "Invalid payload: orderedIds must be an array" },
                    { status: 400 }
                );
            }

            const bulkOps = orderedIds.map((id, index) => ({
                updateOne: {
                    filter: { _id: id },
                    update: { $set: { order: index } }
                }
            }));

            console.log('[API Collections] Reordering collections with ops:', JSON.stringify(bulkOps));

            if (bulkOps.length > 0) {
                const result = await Collection.bulkWrite(bulkOps, { strict: false });
                console.log('[API Collections] BulkWrite result:', result);
            }

            // Invalidate cache
            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.COLLECTIONS_ALL, CACHE_KEYS.COLLECTIONS_ADMIN);
                    console.log('[Cache] Invalidated collection lists after reorder');
                } catch (err) {
                    console.error('[Redis] Invalidation error:', err);
                }
            }

            return NextResponse.json({ success: true, message: "Collections reordered successfully" });
        } catch (error) {
            console.error('[API Collections] Reorder error:', error);
            return NextResponse.json(
                { message: error.message || "Failed to reorder collections" },
                { status: 500 }
            );
        }
    }
}
