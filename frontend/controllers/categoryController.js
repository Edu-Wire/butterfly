import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import redis from "@/lib/redis";

const CACHE_KEYS = {
    CATEGORIES_ALL: 'categories:all',
    CATEGORY_DETAIL: (id) => `category:${id}`
};

const CACHE_TTL = 3600; // 1 hour

export class CategoryController {

    // GET ALL CATEGORIES
    static async getAll(req) {
        try {
            await connectDB();
            const cacheKey = CACHE_KEYS.CATEGORIES_ALL;

            // Try to get from cache
            if (redis) {
                try {
                    const cachedData = await redis.get(cacheKey);
                    if (cachedData) {
                        console.log(`[Cache] Serving ${cacheKey} from Redis`);
                        const parsed = JSON.parse(cachedData);
                        return NextResponse.json({
                            success: true,
                            data: parsed,
                            count: parsed.length,
                            fromCache: true
                        });
                    }
                } catch (err) {
                    console.error('[Redis] Get error:', err);
                }
            }

            const categories = await Category.find({ isActive: true }).sort({ name: 1 });

            // Save to cache
            if (redis) {
                try {
                    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(categories));
                    console.log(`[Cache] Saved ${cacheKey} to Redis`);
                } catch (err) {
                    console.error('[Redis] Set error:', err);
                }
            }

            return NextResponse.json({
                success: true,
                data: categories,
                count: categories.length,
            });
        } catch (error) {
            console.error('[API] Categories error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch categories' },
                { status: 500 }
            );
        }
    }

    // CREATE CATEGORY
    static async create(req) {
        try {
            await connectDB();
            const body = await req.json();

            const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${body.name}$`, 'i') } });
            if (existingCategory) {
                return NextResponse.json(
                    { success: true, data: existingCategory, message: 'Category already exists' },
                    { status: 200 }
                );
            }

            const category = await Category.create(body);

            // Invalidate cache
            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.CATEGORIES_ALL);
                    console.log('[Cache] Invalidated category lists');
                } catch (err) {
                    console.error('[Redis] Invalidation error:', err);
                }
            }

            return NextResponse.json({ success: true, data: category }, { status: 201 });
        } catch (error) {
            console.error('[API] Create category error:', error);
            return NextResponse.json(
                { success: false, error: error.message || 'Failed to create category' },
                { status: 500 }
            );
        }
    }

    // GET CATEGORY BY ID
    static async getById(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;
            const cacheKey = CACHE_KEYS.CATEGORY_DETAIL(id);

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

            let category;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                category = await Category.findById(id);
            } else {
                // Fallback for numeric IDs if they were using a different system, or just generic find
                // If it's not objectId, maybe it's not found.
                return NextResponse.json({ success: false, error: 'Invalid ID format' }, { status: 400 });
            }

            if (!category) {
                return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
            }

            // Save to cache
            if (redis) {
                try {
                    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(category));
                    console.log(`[Cache] Saved ${cacheKey} to Redis`);
                } catch (err) {
                    console.error('[Redis] Set error:', err);
                }
            }

            return NextResponse.json({ success: true, data: category });
        } catch (error) {
            return NextResponse.json({ success: false, error: 'Failed to fetch category' }, { status: 500 });
        }
    }

    // UPDATE CATEGORY
    static async update(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;
            const body = await req.json();

            const category = await Category.findByIdAndUpdate(id, body, { new: true });
            if (!category) {
                return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
            }

            // Invalidate cache
            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.CATEGORIES_ALL, CACHE_KEYS.CATEGORY_DETAIL(id));
                    console.log(`[Cache] Invalidated category info for ${id}`);
                } catch (err) {
                    console.error('[Redis] Invalidation error:', err);
                }
            }

            return NextResponse.json({ success: true, data: category });
        } catch (error) {
            return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
        }
    }

    // DELETE CATEGORY
    static async delete(req, { params }) {
        try {
            await connectDB();
            const { id } = await params;
            const result = await Category.findByIdAndDelete(id);

            if (!result) {
                return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
            }

            // Invalidate cache
            if (redis) {
                try {
                    await redis.del(CACHE_KEYS.CATEGORIES_ALL, CACHE_KEYS.CATEGORY_DETAIL(id));
                    console.log(`[Cache] Invalidated category lists and detail for ${id}`);
                } catch (err) {
                    console.error('[Redis] Invalidation error:', err);
                }
            }

            return NextResponse.json({ success: true });
        } catch (error) {
            return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
        }
    }
}
