import connectDB from "../lib/db.js";
import Category from "../models/Category.js";
import redis from "../lib/redis.js";

const CACHE_KEYS = {
    CATEGORIES_ALL: "categories:all",
    CATEGORY_DETAIL: (id) => `category:${id}`,
};
const CACHE_TTL = 3600;

export class CategoryController {
    static async getAll(req, res) {
        try {
            await connectDB();

            if (redis) {
                try {
                    const cachedData = await redis.get(CACHE_KEYS.CATEGORIES_ALL);
                    if (cachedData) {
                        const parsed = JSON.parse(cachedData);
                        return res.json({ success: true, data: parsed, count: parsed.length, fromCache: true });
                    }
                } catch (err) {
                    console.error("[Redis] Get error:", err);
                }
            }

            const categories = await Category.find({ isActive: true }).sort({ name: 1 });

            if (redis) {
                try {
                    await redis.setex(CACHE_KEYS.CATEGORIES_ALL, CACHE_TTL, JSON.stringify(categories));
                } catch (err) {
                    console.error("[Redis] Set error:", err);
                }
            }

            return res.json({ success: true, data: categories, count: categories.length });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Failed to fetch categories" });
        }
    }

    static async create(req, res) {
        try {
            await connectDB();
            const existing = await Category.findOne({
                name: { $regex: new RegExp(`^${req.body.name}$`, "i") },
            });
            if (existing) {
                return res.json({ success: true, data: existing, message: "Category already exists" });
            }

            const category = await Category.create(req.body);

            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.CATEGORIES_ALL);
                } catch (err) {
                    console.error("[Redis] Invalidation error:", err);
                }
            }

            return res.status(201).json({ success: true, data: category });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message || "Failed to create category" });
        }
    }

    static async getById(req, res) {
        try {
            await connectDB();
            const { id } = req.params;

            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ success: false, error: "Invalid ID format" });
            }

            if (redis) {
                try {
                    const cachedData = await redis.get(CACHE_KEYS.CATEGORY_DETAIL(id));
                    if (cachedData) return res.json({ success: true, data: JSON.parse(cachedData), fromCache: true });
                } catch (err) {
                    console.error("[Redis] Get error:", err);
                }
            }

            const category = await Category.findById(id);
            if (!category) return res.status(404).json({ success: false, error: "Category not found" });

            if (redis) {
                try {
                    await redis.setex(CACHE_KEYS.CATEGORY_DETAIL(id), CACHE_TTL, JSON.stringify(category));
                } catch (err) {
                    console.error("[Redis] Set error:", err);
                }
            }

            return res.json({ success: true, data: category });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Failed to fetch category" });
        }
    }

    static async update(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
            if (!category) return res.status(404).json({ success: false, error: "Category not found" });

            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.CATEGORIES_ALL, CACHE_KEYS.CATEGORY_DETAIL(id));
                } catch (err) {
                    console.error("[Redis] Invalidation error:", err);
                }
            }

            return res.json({ success: true, data: category });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Failed to update category" });
        }
    }

    static async delete(req, res) {
        try {
            await connectDB();
            const { id } = req.params;
            const result = await Category.findByIdAndDelete(id);
            if (!result) return res.status(404).json({ success: false, error: "Category not found" });

            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.CATEGORIES_ALL, CACHE_KEYS.CATEGORY_DETAIL(id));
                } catch (err) {
                    console.error("[Redis] Invalidation error:", err);
                }
            }

            return res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Failed to delete category" });
        }
    }
}
