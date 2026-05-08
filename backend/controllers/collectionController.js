import connectDB from "../lib/db.js";
import Collection from "../models/Collection.js";
import { verifyToken } from "../lib/jwt.js";
import redis from "../lib/redis.js";

const CACHE_KEYS = {
    COLLECTIONS_ALL: "collections:all",
    COLLECTIONS_ADMIN: "collections:admin",
    COLLECTION_DETAIL: (id) => `collection:${id}`,
};
const CACHE_TTL = 3600;

const getUser = (req) => {
    try {
        const auth = req.headers.authorization;
        if (!auth || auth === "Bearer null") return null;
        return verifyToken(auth.split(" ")[1]);
    } catch {
        return null;
    }
};

export class CollectionController {
    static async getAll(req, res) {
        try {
            await connectDB();
            const user = getUser(req);
            const isUserAdmin = user && user.role === "admin";
            const filter = isUserAdmin ? {} : { isActive: true };
            const cacheKey = isUserAdmin ? CACHE_KEYS.COLLECTIONS_ADMIN : CACHE_KEYS.COLLECTIONS_ALL;

            if (redis) {
                try {
                    const cachedData = await redis.get(cacheKey);
                    if (cachedData) return res.json({ success: true, collections: JSON.parse(cachedData), fromCache: true });
                } catch (err) {
                    console.error("[Redis] Get error:", err);
                }
            }

            const collections = await Collection.find(filter).populate("products").sort({ order: 1, createdAt: -1 });

            if (redis) {
                try {
                    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(collections));
                } catch (err) {
                    console.error("[Redis] Set error:", err);
                }
            }

            return res.json({ success: true, collections });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Failed to fetch collections" });
        }
    }

    static async create(req, res) {
        try {
            await connectDB();
            const collection = await Collection.create(req.body);

            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.COLLECTIONS_ALL, CACHE_KEYS.COLLECTIONS_ADMIN);
                } catch (err) {
                    console.error("[Redis] Invalidation error:", err);
                }
            }

            return res.status(201).json({ success: true, data: collection });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const cacheKey = CACHE_KEYS.COLLECTION_DETAIL(id);

            if (redis) {
                try {
                    const cachedData = await redis.get(cacheKey);
                    if (cachedData) return res.json({ success: true, collection: JSON.parse(cachedData), fromCache: true });
                } catch (err) {
                    console.error("[Redis] Get error:", err);
                }
            }

            let collection;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                collection = await Collection.findById(id).populate("products");
            } else {
                collection = await Collection.findOne({ slug: id }).populate("products");
            }

            if (!collection) return res.status(404).json({ message: "Collection not found" });

            if (redis) {
                try {
                    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(collection));
                } catch (err) {
                    console.error("[Redis] Set error:", err);
                }
            }

            return res.json({ success: true, collection });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async update(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };

            const collection = await Collection.findOneAndUpdate(
                query,
                { $set: req.body },
                { new: true, runValidators: true }
            ).populate("products");

            if (!collection) return res.status(404).json({ message: "Collection not found" });

            if (redis) {
                try {
                    await redis.del(
                        CACHE_KEYS.COLLECTIONS_ALL,
                        CACHE_KEYS.COLLECTIONS_ADMIN,
                        CACHE_KEYS.COLLECTION_DETAIL(id),
                        CACHE_KEYS.COLLECTION_DETAIL(collection.slug)
                    );
                } catch (err) {
                    console.error("[Redis] Invalidation error:", err);
                }
            }

            return res.json({ success: true, collection });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async delete(req, res) {
        await connectDB();
        const { id } = req.params;
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
        const result = await Collection.findOneAndDelete(query);

        if (!result) return res.status(404).json({ message: "Collection not found" });

        if (redis) {
            try {
                await redis.del(
                    CACHE_KEYS.COLLECTIONS_ALL,
                    CACHE_KEYS.COLLECTIONS_ADMIN,
                    CACHE_KEYS.COLLECTION_DETAIL(id),
                    CACHE_KEYS.COLLECTION_DETAIL(result.slug)
                );
            } catch (err) {
                console.error("[Redis] Invalidation error:", err);
            }
        }

        return res.json({ success: true, message: "Collection deleted" });
    }

    static async reorder(req, res) {
        try {
            await connectDB();
            const { orderedIds } = req.body;

            if (!orderedIds || !Array.isArray(orderedIds)) {
                return res.status(400).json({ message: "Invalid payload: orderedIds must be an array" });
            }

            const bulkOps = orderedIds.map((id, index) => ({
                updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
            }));

            if (bulkOps.length > 0) {
                await Collection.bulkWrite(bulkOps, { strict: false });
            }

            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.COLLECTIONS_ALL, CACHE_KEYS.COLLECTIONS_ADMIN);
                } catch (err) {
                    console.error("[Redis] Invalidation error:", err);
                }
            }

            return res.json({ success: true, message: "Collections reordered successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message || "Failed to reorder collections" });
        }
    }
}
