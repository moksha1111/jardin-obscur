const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, required: true, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Lipgloss", "Body Splash"],
    },
    brand: { type: String, default: "" },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    // Cosmetics-specific fields
    volume: { type: String, default: "" },
    shade: { type: String, default: "" },
    finish: {
      type: String,
      enum: ["Matte", "Satin", "Glossy", "Shimmer", "Dewy", "Cream", ""],
      default: "",
    },
    ingredients: [{ type: String }],
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
