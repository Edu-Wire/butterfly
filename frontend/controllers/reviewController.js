import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/jwt";

export class ReviewController {

    // Helper: update product rating stats
    static async updateProductRating(productId) {
        const stats = await Review.aggregate([
            {
                $match: { productId: new Product().model('Product').base.Types.ObjectId(productId) }
            },
            {
                $group: {
                    _id: '$productId',
                    nRating: { $sum: 1 },
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                rating: stats[0].avgRating,
                reviewsCount: stats[0].nRating
            });
        } else {
            await Product.findByIdAndUpdate(productId, {
                rating: 0,
                reviewsCount: 0
            });
        }
    }

    // CREATE REVIEW
    static async create(req, { params }) {
        try {
            await connectDB();
            const { id: productId } = await params;

            // 1. Verify User
            const authHeader = req.headers.get("authorization");
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return NextResponse.json(
                    { message: "Unauthorized: Please log in to review" },
                    { status: 401 }
                );
            }

            const token = authHeader.split(" ")[1];
            let user;
            try {
                user = verifyToken(token); // { userId, email, role }
            } catch (error) {
                return NextResponse.json({ message: "Invalid token" }, { status: 401 });
            }

            // 2. Parsy Body
            const body = await req.json();
            const { rating, reviewText } = body;

            if (!rating || rating < 1 || rating > 5) {
                return NextResponse.json(
                    { message: "Please provide a valid rating between 1 and 5" },
                    { status: 400 }
                );
            }

            // 3. User must have ordered the product AND received it (Delivered)
            // We check by email as Order schema uses email for customer identification
            const order = await Order.findOne({
                "customer.email": user.email,
                "items.productId": productId,
                "status": "delivered"
            });

            if (!order) {
                return NextResponse.json(
                    { success: false, message: "You can only review products you calculate have purchased and received (Delivered status)." },
                    { status: 403 }
                );
            }

            // 4. Check if user already reviewed this product
            // Alternatively, MongoDB unique index will throw error, but we can check nicely here
            const existingReview = await Review.findOne({
                productId: productId,
                userId: user.userId
            });

            if (existingReview) {
                return NextResponse.json(
                    { success: false, message: "You have already reviewed this product." },
                    { status: 400 }
                );
            }

            // 5. Create Review
            const newReview = await Review.create({
                productId,
                userId: user.userId,
                rating,
                reviewText
            });

            // 6. Update Product Stats
            // We can do this async without blocking response, but for consistency let's await
            // We need to calculate new average
            const allReviews = await Review.find({ productId });
            const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
            const avgRating = totalRating / allReviews.length;

            await Product.findByIdAndUpdate(productId, {
                rating: avgRating,
                reviewsCount: allReviews.length
            });

            return NextResponse.json(
                { success: true, message: "Review added successfully", review: newReview },
                { status: 201 }
            );

        } catch (error) {
            console.error('[Review Create Error]:', error);
            // Handle duplicate key error explicitly if race condition occurs
            if (error.code === 11000) {
                return NextResponse.json(
                    { success: false, message: "You have already reviewed this product." },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { success: false, message: "Failed to submit review", error: error.message },
                { status: 500 }
            );
        }
    }

    // GET REVIEWS FOR PRODUCT
    static async getByProduct(req, { params }) {
        try {
            await connectDB();
            const { id: productId } = await params;

            const reviews = await Review.find({ productId })
                .populate("userId", "name avatar") // Get user name and avatar
                .sort({ createdAt: -1 }); // Newest first

            return NextResponse.json({ success: true, reviews });
        } catch (error) {
            console.error('[Review Get Error]:', error);
            return NextResponse.json(
                { success: false, message: "Failed to fetch reviews" },
                { status: 500 }
            );
        }
    }
}
