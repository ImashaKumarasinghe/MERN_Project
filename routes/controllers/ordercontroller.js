// ✅ Import Order model - goes up 2 levels (controllers -> routes -> models)
import Order from "../../models/order.js";
// ✅ Import Product model
import Product from "../../models/products.js";
// ✅ Import isAdmin function from usercontroller
import { isAdmin } from "./usercontroller.js";

// ✅ CREATE ORDER FUNCTION
export async function createOrder(req, res) {
    // ✅ Step 1: Check if user is logged in
    if (req.user == null) {
        res.status(403).json({
            message: "Please login and try again"
        });
        return;
    }

    const orderInfo = req.body;

    // ✅ Step 2: Use logged-in user's name if not provided
    if (orderInfo.name == null) {
        orderInfo.name = req.user.firstName + " " + req.user.lastName;
    }

    // ✅ Step 3: Generate unique order ID (CBC00001, CBC00002, etc.)
    let orderId = "CBC00001";

    try {
        const lastOrder = await Order.find().sort({ date: -1 }).limit(1);

        if (lastOrder.length > 0) {
            const lastOrderId = lastOrder[0].orderId;
            const lastOrderNumberString = lastOrderId.replace("CBC", "");
            const lastOrderNumber = parseInt(lastOrderNumberString);
            const newOrderNumber = lastOrderNumber + 1;
            const newOrderNumberString = String(newOrderNumber).padStart(5, "0");
            orderId = "CBC" + newOrderNumberString;
        }

        let total = 0;
        let labelledTotal = 0;
        const products = [];

        // ✅ Step 4: Validate each product and calculate totals
        for (let i = 0; i < orderInfo.products.length; i++) {
            const item = await Product.findOne({
                productId: orderInfo.products[i].productId
            });

            // ✅ Check if product exists
            if (item == null) {
                res.status(404).json({
                    message: "Product with productId " + orderInfo.products[i].productId + " not found"
                });
                return;
            }

            // ✅ Check if product is available
            if (item.isAvailable == false) {
                res.status(404).json({
                    message: "Product with productId " + orderInfo.products[i].productId + " is not available right now!"
                });
                return;
            }

            // ✅ FIXED: Handle both "productName" and "name" fields
            // Check productName first since most products use this
            const productName = item.productName || item.name || "Product";
            const productAltNames = item.altNames || [];
            const productDescription = item.description || "";
            const productImages = item.images || [];
            const productLabelledPrice = item.labelledPrice || item.price;

            // ✅ Add product to order array
            products[i] = {
                productInfo: {
                    productId: item.productId,
                    name: productName,  // ✅ Works with both field names
                    altNames: productAltNames,
                    description: productDescription,
                    images: productImages,
                    labelledPrice: productLabelledPrice,
                    price: item.price
                },
                quantity: orderInfo.products[i].qty
            };

            // ✅ Calculate totals
            total += item.price * orderInfo.products[i].qty;
            labelledTotal += productLabelledPrice * orderInfo.products[i].qty;
        }

        // ✅ Step 5: Create order object
        const order = new Order({
            orderId: orderId,
            email: req.user.email,
            name: orderInfo.name,
            address: orderInfo.address,
            phone: orderInfo.phone,
            products: products,
            labelledTotal: labelledTotal,
            total: total
        });

        // ✅ Step 6: Save order to database
        const createdOrder = await order.save();

        res.json({
            message: "Order created successfully",
            order: createdOrder
        });

    } catch (err) {
        console.error("❌ Error creating order:", err);
        res.status(500).json({
            message: "Failed to create order",
            error: err.message
        });
    }
}

// ✅ GET ORDERS FUNCTION
export async function getOrders(req, res) {
    // ✅ Step 1: Check if user is logged in
    if (req.user == null) {
        res.status(403).json({
            message: "Please login and try again"
        });
        return;
    }

    try {
        // ✅ Step 2: Admin sees all orders, customers see only their own
        if (req.user.role == "admin") {
            const orders = await Order.find();
            res.json({
                message: "All orders (Admin view)",
                count: orders.length,
                orders: orders
            });
        } else {
            const orders = await Order.find({ email: req.user.email });
            res.json({
                message: "Your orders",
                count: orders.length,
                orders: orders
            });
        }
    } catch (err) {
        console.error("❌ Error fetching orders:", err);
        res.status(500).json({
            message: "Failed to fetch orders",
            error: err.message
        });
    }
}

// ✅ UPDATE ORDER STATUS FUNCTION (Admin only)
export async function updateOrderStatus(req, res) {
    // ✅ Step 1: Check if user is admin
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authorized to update order status"
        });
        return;
    }

    try {
        const orderId = req.params.orderId;
        const status = req.params.status;

        // ✅ Step 2: Update order status
        const result = await Order.updateOne(
            { orderId: orderId },
            { status: status }
        );

        // ✅ Step 3: Check if order was found
        if (result.matchedCount === 0) {
            res.status(404).json({
                message: "Order not found with orderId: " + orderId
            });
            return;
        }

        res.json({
            message: "Order status updated successfully"
        });

    } catch (e) {
        console.error("❌ Error updating order status:", e);
        res.status(500).json({
            message: "Failed to update order status",
            error: e.message
        });
    }
}

// ✅ DELETE ORDER FUNCTION (Admin only)
export async function deleteOrder(req, res) {
    // ✅ Step 1: Check if user is admin
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authorized to delete orders"
        });
        return;
    }

    try {
        const orderId = req.params.orderId;

        // ✅ Step 2: Delete order
        const result = await Order.findOneAndDelete({ orderId: orderId });

        // ✅ Step 3: Check if order was found
        if (!result) {
            res.status(404).json({
                message: "Order not found with orderId: " + orderId
            });
            return;
        }

        res.json({
            message: "Order deleted successfully",
            deletedOrder: result
        });

    } catch (e) {
        console.error("❌ Error deleting order:", e);
        res.status(500).json({
            message: "Failed to delete order",
            error: e.message
        });
    }
}