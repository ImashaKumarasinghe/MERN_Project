import express from "express";
import { 
    getProducts, 
    saveProduct, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    deleteProductByProductId,
    SearchProducts  // Import new function
} from "./controllers/productcontroller.js";

const productRouter = express.Router();

// Get all products
productRouter.get("/", getProducts);

// Get single product by MongoDB _id
productRouter.get("/:productId", getProductById);

// Create new product
productRouter.post("/", saveProduct);

// Update product by MongoDB _id
productRouter.put("/:productId", updateProduct);

// Delete product by MongoDB _id
productRouter.delete("/:id", deleteProduct);

// Delete product by productId (using body)
productRouter.delete("/", deleteProductByProductId);
//search query
productRouter.get("/search/:searchQuery", SearchProducts);

export default productRouter;