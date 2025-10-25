import express from "express";
import { getProducts, saveProduct } from "./controllers/productcontroller.js"; // Import saveProduct

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/", saveProduct); // Corrected to saveProduct instead of saveProducts

export default productRouter;
