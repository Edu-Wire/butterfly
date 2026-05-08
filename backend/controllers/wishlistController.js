import connectDB from "../lib/db.js";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import { verifyToken } from "../lib/jwt.js";

const getDecoded = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ success: false, message: "Authorization token required" });
        return null;
    }
    const decoded = verifyToken(authHeader.substring(7));
    if (!decoded || !decoded.userId) {
        res.status(401).json({ success: false, message: "Invalid token" });
        return null;
    }
    return decoded;
};

export class WishlistController {
    static async getWishlist(req, res) {
        try {
            await connectDB();
            const decoded = getDecoded(req, res);
            if (!decoded) return;

            const wishlistItems = await Wishlist.find({ user: decoded.userId })
                .populate({ path: "product", model: Product })
                .sort({ addedAt: -1 });

            return res.json({
                success: true,
                data: wishlistItems.map((item) => ({
                    _id: item._id,
                    product: item.product,
                    addedAt: item.addedAt,
                })),
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to fetch wishlist" });
        }
    }

    static async addToWishlist(req, res) {
        try {
            await connectDB();
            const decoded = getDecoded(req, res);
            if (!decoded) return;

            const { productId } = req.body;
            if (!productId) return res.status(400).json({ success: false, message: "Product ID is required" });

            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ success: false, message: "Product not found" });

            const existingItem = await Wishlist.findOne({ user: decoded.userId, product: productId });
            if (existingItem) return res.status(409).json({ success: false, message: "Item already in wishlist" });

            const wishlistItem = await Wishlist.create({ user: decoded.userId, product: productId });
            await wishlistItem.populate({ path: "product", model: Product });

            return res.json({ success: true, message: "Item added to wishlist", data: wishlistItem });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to add item to wishlist" });
        }
    }

    static async delete(req, res) {
        try {
            await connectDB();
            const decoded = getDecoded(req, res);
            if (!decoded) return;

            const { id } = req.params;
            const wishlistItem = await Wishlist.findOneAndDelete({ _id: id, user: decoded.userId });
            if (!wishlistItem) return res.status(404).json({ success: false, message: "Wishlist item not found" });

            return res.json({ success: true, message: "Item removed from wishlist" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to remove item from wishlist" });
        }
    }
}
