const Order = require("../models/Order");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

const STATUS_FLOW = ["Pending", "Confirmed", "Packed", "Shipped", "OutForDelivery", "Delivered"];

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, message } = req.body;
    const vendorId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");

    // Security: Check if vendor owns any product in this order
    const hasVendorProduct = order.products.some(p => p.vendorId.toString() === vendorId.toString());
    if (!hasVendorProduct) throw new ApiError(403, "You can only update your own orders");

    if (status === "Cancelled") {
        if (order.orderStatus === "Delivered") throw new ApiError(400, "Cannot cancel a delivered order");
        order.orderStatus = "Cancelled";
        if (!order.statusHistory) order.statusHistory = [];
        order.statusHistory.push({ status: "Cancelled", message: message || "Order cancelled by vendor" });
    } else {
        const currentIndex = STATUS_FLOW.indexOf(order.orderStatus);
        const nextIndex = STATUS_FLOW.indexOf(status);

        if (nextIndex === -1) throw new ApiError(400, "Invalid status");
        if (nextIndex !== currentIndex + 1) {
            throw new ApiError(400, `Invalid transition from ${order.orderStatus} to ${status}`);
        }

        order.orderStatus = status;
        if (!order.statusHistory) order.statusHistory = [];
        order.statusHistory.push({ status, message: message || `Order ${status}` });

        if (status === "Delivered" && order.paymentMethod !== "COD") {
            order.paymentStatus = "Paid";
        }
    }

    await order.save();

    return res.status(200).json(new ApiResponse(200, order, `Order status updated to ${status}`));
  } catch (error) {
    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const vendorId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");

    const hasVendorProduct = order.products.some(p => p.vendorId.toString() === vendorId.toString());
    if (!hasVendorProduct) throw new ApiError(403, "Access denied");

    if (order.orderStatus !== "Delivered") {
        throw new ApiError(400, "Payment can only be marked as received after delivery");
    }

    order.paymentStatus = "Paid";
    await order.save();

    return res.status(200).json(new ApiResponse(200, order, "Payment marked as received"));
  } catch (error) {
    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

const getVendorDashboardStats = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const vendorOrders = await Order.find({ "products.vendorId": vendorId });

    let stats = {
        totalOrders: vendorOrders.length,
        pendingOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0
    };

    vendorOrders.forEach(order => {
        if (order.orderStatus === "Pending") stats.pendingOrders++;
        if (order.orderStatus === "Delivered") stats.deliveredOrders++;
        
        // Revenue from vendor's own products
        order.products.forEach(p => {
            if (p.vendorId.toString() === vendorId.toString()) {
                stats.totalRevenue += (p.price * p.quantity);
            }
        });
    });

    return res.status(200).json(new ApiResponse(200, stats, "Vendor stats fetched successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

const getVendorOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const vendorId = req.user._id;

        const order = await Order.findById(orderId);
        if (!order) throw new ApiError(404, "Order not found");

        const hasVendorProduct = order.products.some(p => p.vendorId.toString() === vendorId.toString());
        if (!hasVendorProduct) throw new ApiError(403, "Access denied");

        // Filter products to only show this vendor's items
        const orderObj = order.toObject();
        orderObj.vendorProducts = orderObj.products.filter(p => p.vendorId.toString() === vendorId.toString());

        return res.status(200).json(new ApiResponse(200, orderObj, "Order details fetched"));
    } catch (error) {
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
    }
};

module.exports = {
  updateOrderStatus,
  updatePaymentStatus,
  getVendorDashboardStats,
  getVendorOrderDetails
};
