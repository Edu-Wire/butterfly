import mongoose from "mongoose";
import Product from "./Product";

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true, // summer-2026, winter-edit
    },

    description: {
      type: String,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    bannerImage: {
      type: String, // hero image for collection page
    },

    aiVariants: [
      {
        url: String,
        type: {
          type: String,
          enum: ["quality", "background", "generative", "style"],
        },
        description: String,
      },
    ],

    selectedVariant: {
      type: String,
      default: null,
    },

    aiEnhanced: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Virtual for display image (selected variant or original)
collectionSchema.virtual("displayImage").get(function () {
  return this.selectedVariant || this.bannerImage;
});

// Ensure virtuals are included in JSON and Object conversion
collectionSchema.set("toJSON", { virtuals: true });
collectionSchema.set("toObject", { virtuals: true });

export default mongoose.models.Collection ||
  mongoose.model("Collection", collectionSchema);
