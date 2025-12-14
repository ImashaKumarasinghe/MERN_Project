import express from "express";
import Review from "../models/review.js";

const router = express.Router();

// ➤ Add new review
router.post("/", async (req, res) => {
  try {
    const { productId, name, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ error: "Product, rating, and comment are required" });
    }

    const review = await Review.create({
      productId,
      name: req.user.firstname + " " + req.user.lastname,
      rating: Number(rating),
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ➤ Get reviews for a specific product
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reviews with product info
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({
  path: "productId",
  select: "name images",
  model: "products"
})

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


export default router;
