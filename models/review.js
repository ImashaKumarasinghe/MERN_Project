import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products", // MUST MATCH EXACT MODEL NAME
    required: true,
  },
  name: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Review", reviewSchema);
