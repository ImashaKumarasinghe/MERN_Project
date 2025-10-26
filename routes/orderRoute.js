import express from 'express';
// ✅ Import order controller functions
import { 
    createOrder, 
    getOrders, 
    updateOrderStatus,
    deleteOrder 
} from './controllers/ordercontroller.js';

const orderRouter = express.Router();

// ✅ POST - Create new order (Customer or Admin)
orderRouter.post("/", createOrder);

// ✅ GET - Get all orders (Admin sees all, Customer sees their own)
orderRouter.get("/", getOrders);

// ✅ PUT - Update order status by orderId and status (Admin only)
// Example: PUT /orders/CBC00001/shipped
orderRouter.put("/:orderId/:status", updateOrderStatus);

// ✅ DELETE - Delete order by orderId (Admin only)
// Example: DELETE /orders/CBC00001
orderRouter.delete("/:orderId", deleteOrder);

export default orderRouter;