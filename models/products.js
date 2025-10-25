import mongoose from "mongoose";

// Define product schema
const productSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
      },
      productName: {
        type: String,
        required: true
      },
      altNames: [
        { type: String }
      ],
      description: {
        type: String,
        required: true
      },
      images: [
        { type: String }
      ],
      labelledPrice: {
        type: Number,
        required: true
      },price: {
        type: Number,
        required: true
      },
      stock: {
        type: Number,
        required: true
      },
      isAvailable: {
        type: Boolean,
        required: true,
        default: true
      }
    });


// Create the Product model
const Product = mongoose.model("products", productSchema);

export default Product;
