import Product from "../../models/products.js";
import { isAdmin } from "./usercontroller.js";

// Get all products
export async function getProducts(req, res) {
    try {
        const products = await Product.find();
        res.json(products);
    } catch(err) {
        res.status(500).json({
            message: "Failed to get products",
            error: err.message
        });
    }
}

// Save a new product
export async function saveProduct(req, res) {
    // ✅ Check authorization FIRST
    if (!isAdmin(req)) {
        return res.status(403).json({ 
            message: "You are not authorized to add a product. Only admins can add products." 
        });
    }

    // ✅ Validate required fields
    if (!req.body.productId || !req.body.productName || !req.body.price || !req.body.description) {
        return res.status(400).json({
            message: "Missing required fields: productId, productName, price, description"
        });
    }

    const product = new Product({
        productId: req.body.productId,
        productName: req.body.productName,
        description: req.body.description,
        altNames: req.body.altNames || [],
        images: req.body.images || [],
        labelledPrice: req.body.labelledPrice || req.body.price,
        price: req.body.price,
        stock: req.body.stock || 0,
        isAvailable: req.body.isAvailable !== false
    });

    try {
        const savedProduct = await product.save();
        res.status(201).json({ 
            message: "Product added successfully",
            product: savedProduct
        });
    } catch(error) {
        res.status(500).json({ 
            message: "Error adding product", 
            error: error.message 
        });
    }
}

// Get product by ID
export async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.json(product);
    } catch(error) {
        res.status(500).json({
            message: "Error fetching product",
            error: error.message
        });
    }
}

// Update product
export async function updateProduct(req, res) {
    // ✅ Check authorization
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "You are not authorized to update a product"
        });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch(error) {
        res.status(500).json({
            message: "Error updating product",
            error: error.message
        });
    }
}

// Delete product
export async function deleteProduct(req, res) {
    // ✅ Check authorization
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "You are not authorized to delete a product"
        });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    } catch(error) {
        res.status(500).json({
            message: "Error deleting product",
            error: error.message
        });
    }
}