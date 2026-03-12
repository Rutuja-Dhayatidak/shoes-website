const Order = require("../models/Order");
const Shoe = require("../models/Shoe");
const Cart = require("../models/cart.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod, totalAmount } = req.body;
    const userId = req.user._id;

    if (!products || products.length === 0 || !shippingAddress || !totalAmount) {
      throw new ApiError(400, "Missing required order details");
    }

    // Enhance products with vendorId from database for security
    const enhancedProducts = await Promise.all(
      products.map(async (p) => {
        const shoe = await Shoe.findById(p.productId);
        if (!shoe) throw new ApiError(404, `Product ${p.productId} not found`);
        return {
          ...p,
          vendorId: shoe.vendor,
        };
      })
    );

    const order = new Order({
      userId,
      products: enhancedProducts,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
      orderStatus: paymentMethod === "COD" ? "Confirmed" : "Pending",
      statusHistory: [
        {
          status: paymentMethod === "COD" ? "Confirmed" : "Pending",
          message: paymentMethod === "COD" ? "Order Confirmed (COD)" : "Order Placed Successfully",
        },
      ],
    });

    await order.save();

    // If COD, clear the cart immediately
    if (paymentMethod === "COD") {
      await Cart.findOneAndUpdate(
        { userId },
        { items: [], totalItems: 0, totalAmount: 0 }
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders fetched successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: id, userId });

    if (!order) throw new ApiError(404, "Order not found");

    return res
      .status(200)
      .json(new ApiResponse(200, order, "Order fetched successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

const getOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).select("orderStatus deliveredAt");

    if (!order) throw new ApiError(404, "Order not found");

    const response = {
      orderStatus: order.orderStatus,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // Dummy estimation
    };

    return res
      .status(200)
      .json(new ApiResponse(200, response, "Order status fetched"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;

    // Find orders where at least one product belongs to this vendor
    const orders = await Order.find({
      "products.vendorId": vendorId,
    }).sort({ createdAt: -1 });

    // For each order, we might want to only show the products belonging to THIS vendor
    // or show the whole order but labeled. Usually, vendors see the whole order if they are part of it.
    // However, for privacy, we'll filter the products array to only include this vendor's items.
    
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.vendorProducts = orderObj.products.filter(p => p.vendorId.toString() === vendorId.toString());
      return orderObj;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, filteredOrders, "Vendor orders fetched successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrderStatus,
  getVendorOrders,
};
