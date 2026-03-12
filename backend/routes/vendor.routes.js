const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  updateOrderStatus,
  updatePaymentStatus,
  getVendorDashboardStats,
  getVendorOrderDetails
} = require("../controllers/vendor.controller");

const router = express.Router();

router.use(verifyToken);

router.patch("/orders/:orderId/status", updateOrderStatus);
router.patch("/orders/:orderId/payment", updatePaymentStatus);
router.get("/dashboard/stats", getVendorDashboardStats);
router.get("/orders/:orderId", getVendorOrderDetails);

module.exports = router;
