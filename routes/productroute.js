import express from "express";
import { 
    getProducts, 
    saveProduct, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    deleteProductByProductId  // Import new function
} from "./controllers/productcontroller.js";

const productRouter = express.Router();

// Get all products
productRouter.get("/", getProducts);

// Get single product by MongoDB _id
productRouter.get("/:id", getProductById);

// Create new product
productRouter.post("/", saveProduct);

// Update product by MongoDB _id
productRouter.put("/:id", updateProduct);

// Delete product by MongoDB _id
productRouter.delete("/:id", deleteProduct);

// Delete product by productId (using body)
productRouter.delete("/", deleteProductByProductId);

export default productRouter;