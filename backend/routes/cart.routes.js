const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeCartItem,
  clearCart,
} = require("../controllers/cart.controller");

const router = express.Router();

// All cart routes are protected
router.use(verifyToken);

router.get("/", getCart);
router.post("/add", addToCart);
router.patch("/increase/:productId", increaseQuantity);
router.patch("/decrease/:productId", decreaseQuantity);
router.delete("/remove/:productId", removeCartItem);
router.delete("/clear", clearCart);

module.exports = router;
