import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from "cors";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import productRouter from './routes/productroute.js';
import userRouter from './routes/userRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI || "mongodb+srv://admin:Sandu%40123@cluster0.jzpa1pa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_KEY = process.env.JWT_KEY || "cbc-batch-five@2025";

app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB FIRST
mongoose.connect(DB_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
    });

// ✅ Token verification middleware
app.use((req, res, next) => {
    const tokenString = req.header("Authorization");//it include in postman header authorization part
    
    if(tokenString != null){
        const token = tokenString.replace("Bearer ", "");

        jwt.verify(token, JWT_KEY, (err, decoded) => {
            if(!err && decoded != null){
                req.user = decoded;
                console.log("✅ Token verified for user:", decoded.email);
            } else {
                console.log("❌ Invalid token");
                // Don't send response here, just log
            }
        });
    }
    
    next(); // ✅ Always call next()
});

// Register routes
app.use('/products', productRouter);
app.use('/users', userRouter);

// ✅ Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(err.status || 500).json({
        message: "Internal Server Error",
        error: err.message
    });
});

// ✅ 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});