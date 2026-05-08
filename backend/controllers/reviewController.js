import connectDB from "../lib/db.js";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { verifyToken } from "../lib/jwt.js";

export class ReviewController {
    static async create(req, res) {
        try {
            await connectDB();
            const { id: productId } = req.params;

            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Unauthorized: Please log in to review" });
            }

            let user;
            try {
                user = verifyToken(authHeader.split(" ")[1]);
            } catch {
                return res.status(401).json({ message: "Invalid token" });
            }

            const { rating, reviewText } = req.body;
            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({ message: "Please provide a valid rating between 1 and 5" });
            }

            const order = await Order.findOne({
                "customer.email": user.email,
                "items.productId": productId,
                status: "delivered",
            });

            if (!order) {
                return res.status(403).json({
                    success: false,
                    message: "You can only review products you have purchased and received (Delivered status).",
                });
            }

            const existingReview = await Review.findOne({ productId, userId: user.userId });
            if (existingReview) {
                return res.status(400).json({ success: false, message: "You have already reviewed this product." });
            }

            const newReview = await Review.create({ productId, userId: user.userId, rating, reviewText });

            const allReviews = await Review.find({ productId });
            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
            await Product.findByIdAndUpdate(productId, { rating: avgRating, reviewsCount: allReviews.length });

            return res.status(201).json({ success: true, message: "Review added successfully", review: newReview });
        } catch (error) {
            console.error("[Review Create Error]:", error);
            if (error.code === 11000) {
                return res.status(400).json({ success: false, message: "You have already reviewed this product." });
            }
            return res.status(500).json({ success: false, message: "Failed to submit review", error: error.message });
        }
    }

    static async getByProduct(req, res) {
        try {
            await connectDB();
            const { id: productId } = req.params;
            const reviews = await Review.find({ productId })
                .populate("userId", "name avatar")
                .sort({ createdAt: -1 });
            return res.json({ success: true, reviews });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to fetch reviews" });
        }
    }
}
