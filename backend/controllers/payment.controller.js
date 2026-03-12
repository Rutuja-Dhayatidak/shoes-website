const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Cart = require("../models/cart.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "secret_placeholder",
});

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) throw new ApiError(400, "Amount is required");

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { razorpayOrderId: order.id, amount: order.amount },
          "Razorpay order created"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, error.message || "Razorpay Error"));
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId, // Pass internal DB order ID to update
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "secret_placeholder")
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update internal order
      const order = await Order.findById(dbOrderId);
      if (order) {
        order.paymentStatus = "Paid";
        order.orderStatus = "Confirmed";
        order.razorpayOrderId = razorpay_order_id;
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();

        // Clear user cart
        await Cart.findOneAndUpdate({ userId: order.userId }, { items: [], totalItems: 0, totalAmount: 0 });
      }

      return res
        .status(200)
        .json(new ApiResponse(200, order, "Payment verified successfully"));
    } else {
      throw new ApiError(400, "Invalid payment signature");
    }
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};
