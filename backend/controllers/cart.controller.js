const Cart = require("../models/cart.model");
const Shoe = require("../models/Shoe");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

/**
 * Reusable helper function to recalculate totalItems and totalAmount
 * @param {Object} cart - The cart document
 */
const calculateCartTotals = (cart) => {
  let totalItems = 0;
  let totalAmount = 0;

  cart.items.forEach((item) => {
    totalItems += item.quantity;
    totalAmount += item.price * item.quantity;
  });

  cart.totalItems = totalItems;
  cart.totalAmount = totalAmount;
};

/**
 * Get logged-in user's cart
 */
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart exists, return an empty cart structure (or 200 with null data)
      return res
        .status(200)
        .json(new ApiResponse(200, { items: [], totalItems: 0, totalAmount: 0 }, "Cart fetched successfully"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart fetched successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

const addToCart = async (req, res) => {
  try {
    const {
      productId,
      productName,
      productImage,
      price,
      quantity,
      selectedSize,
      brand,
      category,
    } = req.body;

    // Validation
    if (!productId || !productName || !price || !selectedSize) {
      throw new ApiError(400, "Missing required fields");
    }

    const shoe = await Shoe.findById(productId);
    if (!shoe) throw new ApiError(404, "Product not found");

    const vendorId = shoe.vendor;

    // Validation
    if (!productId || !productName || !price || !selectedSize) {
      throw new ApiError(400, "Missing required fields");
    }

    if (price <= 0 || quantity < 1) {
      throw new ApiError(400, "Invalid price or quantity");
    }

    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already exists with same productId AND selectedSize
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.selectedSize === selectedSize
    );

    if (existingItemIndex > -1) {
      // Increase quantity
      cart.items[existingItemIndex].quantity += quantity || 1;
    } else {
      // Add as new item
      cart.items.push({
        productId,
        vendorId,
        productName,
        productImage,
        price,
        quantity: quantity || 1,
        selectedSize,
        brand,
        category,
      });
    }

    calculateCartTotals(cart);
    await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Item added to cart successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

/**
 * Increase quantity of an item
 */
const increaseQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { selectedSize } = req.body; // Size passed in body for exact matching
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) throw new ApiError(404, "Cart not found");

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        (!selectedSize || item.selectedSize === selectedSize)
    );

    if (itemIndex === -1) throw new ApiError(404, "Item not found in cart");

    cart.items[itemIndex].quantity += 1;

    calculateCartTotals(cart);
    await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Quantity increased successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

/**
 * Decrease quantity of an item
 */
const decreaseQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { selectedSize } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) throw new ApiError(404, "Cart not found");

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        (!selectedSize || item.selectedSize === selectedSize)
    );

    if (itemIndex === -1) throw new ApiError(404, "Item not found in cart");

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      // Optional: Remove item if quantity becomes 0
      // In this case, we'll keep it at 1 as per requirements or remove if requested.
      // Requirements said "Quantity must never go below 1". 
      // Some production apps remove the item, but we'll stick to min 1 or throw error.
      // Let's stick to min 1 as per "Quantity must never go below 1" rule.
      throw new ApiError(400, "Quantity cannot be less than 1. Use remove API instead.");
    }

    calculateCartTotals(cart);
    await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Quantity decreased successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

/**
 * Remove specific item from cart
 */
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { selectedSize } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) throw new ApiError(404, "Cart not found");

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          (!selectedSize || item.selectedSize === selectedSize)
        )
    );

    calculateCartTotals(cart);
    await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Item removed from cart successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

/**
 * Clear entire cart
 */
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Cart is already empty"));
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalAmount = 0;

    await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart cleared successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

module.exports = {
  getCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeCartItem,
  clearCart,
};
