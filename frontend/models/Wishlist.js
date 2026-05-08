import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    timestamps: true,
    // Ensure a user can only have one wishlist entry per product
    index: { user: 1, product: 1 }, 
    unique: true 
  }
);

export default mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
