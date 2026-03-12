const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/payment.controller");

const router = express.Router();

router.use(verifyToken);

router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyPayment);

module.exports = router;
