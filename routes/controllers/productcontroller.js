import Product from "../../models/products.js";
import { isAdmin } from "./usercontroller.js";

// Get all products
export async function getProducts(req, res) {
    try {
        if (isAdmin(req)) {
            const products = await Product.find();
            res.json({
                message: "All products (Admin view)",
                count: products.length,
                products: products
            });
        } else {
            const products = await Product.find({ isAvailable: true });
            res.json({
                message: "Available products",
                count: products.length,
                products: products
            });
        }
    } catch (err) {
        console.error("Error getting products:", err);
        res.status(500).json({
            message: "Failed to get products",
            error: err.message
        });
    }
}

// Save a new product
export async function saveProduct(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({ 
            message: "You are not authorized to add a product. Only admins can add products." 
        });
    }

    // ✅ FIXED - Check for "name" field (matches schema)
if (!req.body.productId || !req.body.name || !req.body.price || !req.body.description) {
    return res.status(400).json({
        message: "Missing required fields: productId, name, price, description"
    });
}

    // Check if productId already exists
    try {
        const existingProduct = await Product.findOne({ productId: req.body.productId });
        if (existingProduct) {
            return res.status(409).json({
                message: "Product with this productId already exists"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error checking product",
            error: error.message
        });
    }

    // ✅ FIXED: Use "name" field (matching schema)
    const product = new Product({
        productId: req.body.productId,
        name: req.body.name,  // ✅ Changed from productName to name
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
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ 
            message: "Error adding product", 
            error: error.message 
        });
    }
}
// Get product by MongoDB _id
export async function getProductById(req,res){
    const productId = req.params.productId
    
    try{

        const product = await Product.findOne(
            {productId : productId}
        )

        if(product == null){
            res.status(404).json({
                message : "Product not found"
            })
            return
        }
        if(product.isAvailable){
            res.json(product)
        }else{
            if(!isAdmin(req)){
                res.status(404).json({
                    message : "Product not found"
                })
                return
            }else{
                res.json(product)
            }
        }

    }catch(err){
        res.status(500).json({
            message : "Internal server error",
            error : err
        })
    }}

// Update product by MongoDB _id
export async function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message: "You are not authorized to update a product"
        })
        return
    }

    const productId = req.params.productId
    const updatingData = req.body

    try{
        await Product.updateOne(
            {productId : productId},
            updatingData
        )

        res.json(
            {
                message : "Product updated successfully"
            }
        )

    }catch(err){
        res.status(500).json({
            message : "Internal server error",
            error : err
        })
    }
}


// Delete product by MongoDB _id (URL parameter)
export async function deleteProduct(req, res) {
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
            message: "Product deleted successfully",
            deletedProduct: deletedProduct
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            message: "Error deleting product",
            error: error.message
        });
    }
}

// Delete product by productId (Request body)
export async function deleteProductByProductId(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "You are not authorized to delete a product"
        });
    }

    const productId = req.body.productId;

    if (!productId) {
        return res.status(400).json({
            message: "productId is required in request body"
        });
    }

    try {
        const deletedProduct = await Product.findOneAndDelete({ productId: productId });

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found with productId: " + productId
            });
        }

        res.json({
            message: "Product deleted successfully",
            deletedProduct: deletedProduct
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            message: "Error deleting product",
            error: error.message
        });
    }
}
//search product
export default async  function  SearchProducts(req,res){
    const searchQuery = req.params.searchQuery;
    try{

        const products = await Product.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },//i=case insensitive
                { altNames: {$elemMatch: { $regex: searchQuery, $options: 'i' } } },
            ]
        });
        res.json(products);
    }catch(err){
        res.status(500).json({
            message : "Internal server error",
            error : err
        })

    }
}