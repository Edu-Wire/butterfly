import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/jwt";

export class WishlistController {

    // GET user's wishlist
    static async getWishlist(request) {
        try {
            await connectDB();

            // Get token from Authorization header
            const authHeader = request.headers.get("authorization");
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return NextResponse.json(
                    { success: false, message: "Authorization token required" },
                    { status: 401 }
                );
            }

            const token = authHeader.substring(7);
            const decoded = verifyToken(token);

            if (!decoded || !decoded.userId) {
                return NextResponse.json(
                    { success: false, message: "Invalid token" },
                    { status: 401 }
                );
            }

            // Get user's wishlist with populated product details
            const wishlistItems = await Wishlist.find({ user: decoded.userId })
                .populate({
                    path: "product",
                    model: Product,
                })
                .sort({ addedAt: -1 });

            return NextResponse.json({
                success: true,
                data: wishlistItems.map(item => ({
                    _id: item._id,
                    product: item.product,
                    addedAt: item.addedAt,
                })),
            });
        } catch (error) {
            console.error("Get wishlist error:", error);
            return NextResponse.json(
                { success: false, message: "Failed to fetch wishlist" },
                { status: 500 }
            );
        }
    }

    // POST add item to wishlist
    static async addToWishlist(request) {
        try {
            await connectDB();

            // Get token from Authorization header
            const authHeader = request.headers.get("authorization");
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return NextResponse.json(
                    { success: false, message: "Authorization token required" },
                    { status: 401 }
                );
            }

            const token = authHeader.substring(7);
            const decoded = verifyToken(token);

            if (!decoded || !decoded.userId) {
                return NextResponse.json(
                    { success: false, message: "Invalid token" },
                    { status: 401 }
                );
            }

            const { productId } = await request.json();

            if (!productId) {
                return NextResponse.json(
                    { success: false, message: "Product ID is required" },
                    { status: 400 }
                );
            }

            // Check if product exists
            const product = await Product.findById(productId);
            if (!product) {
                return NextResponse.json(
                    { success: false, message: "Product not found" },
                    { status: 404 }
                );
            }

            // Check if item already exists in wishlist
            const existingItem = await Wishlist.findOne({
                user: decoded.userId,
                product: productId,
            });

            if (existingItem) {
                return NextResponse.json(
                    { success: false, message: "Item already in wishlist" },
                    { status: 409 }
                );
            }

            // Add to wishlist
            const wishlistItem = await Wishlist.create({
                user: decoded.userId,
                product: productId,
            });

            // Populate product details for response
            await wishlistItem.populate({
                path: "product",
                model: Product,
            });

            return NextResponse.json({
                success: true,
                message: "Item added to wishlist",
                data: wishlistItem,
            });
        } catch (error) {
            console.error("Add to wishlist error:", error);
            return NextResponse.json(
                { success: false, message: "Failed to add item to wishlist" },
                { status: 500 }
            );
        }
    }

    // DELETE item from wishlist
    static async delete(request, { params }) {
        try {
            await connectDB();

            // Get token from Authorization header
            const authHeader = request.headers.get("authorization");
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return NextResponse.json(
                    { success: false, message: "Authorization token required" },
                    { status: 401 }
                );
            }

            const token = authHeader.substring(7);
            const decoded = verifyToken(token);

            if (!decoded || !decoded.userId) {
                return NextResponse.json(
                    { success: false, message: "Invalid token" },
                    { status: 401 }
                );
            }

            const { id } = await params;

            // Find and delete the wishlist item
            // Wait, is 'id' the wishlist item _id or the productId? The route logic used _id (wishlistItem id)
            const wishlistItem = await Wishlist.findOneAndDelete({
                _id: id,
                user: decoded.userId, // Ensure user can only delete their own items
            });

            if (!wishlistItem) {
                return NextResponse.json(
                    { success: false, message: "Wishlist item not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Item removed from wishlist",
            });
        } catch (error) {
            console.error("Remove from wishlist error:", error);
            return NextResponse.json(
                { success: false, message: "Failed to remove item from wishlist" },
                { status: 500 }
            );
        }
    }
}
