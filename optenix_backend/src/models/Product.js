import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    image: { type: String, default: "" },
    images: { type: [String], default: [] },

    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },

    rating: { type: Number, default: 0 },
    discount: { type: String, default: "" },

    description: { type: String, default: "" },
    specifications: [
      {
        key: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],

    category: {
      type: String,
      required: true,
      trim: true,
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    // isActive and status controls shop visibility
    // Shop page only shows published + active products
    // Shop visibility
    isActive: { type: Boolean, default: true },

    //  Publish control
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);