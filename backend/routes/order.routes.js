const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrderStatus,
  getVendorOrders,
} = require("../controllers/order.controller");

const router = express.Router();

router.use(verifyToken);

router.post("/create", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/vendor-orders", getVendorOrders);
router.get("/:id", getOrderById);
router.get("/status/:id", getOrderStatus);

module.exports = router;
