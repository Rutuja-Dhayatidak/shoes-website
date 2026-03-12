const express = require("express");
const {
  createShoe,
  getShoes,
  getSingleShoe,
  updateShoe,
  deleteShoe,
  getShoeTypes,
  getShoeBrands,
} = require("../controllers/shoeController");

const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/types", getShoeTypes);
router.get("/brands", getShoeBrands);
router.get("/", getShoes);
router.get("/:id", getSingleShoe);

// Vendor Create
router.post(
  "/create",
  verifyToken,
  authorizeRoles("vendor"),
  upload.array("images", 5),   // 👈 up to 5 images
  createShoe
);

// Vendor + Admin Update/Delete
router.put("/:id", verifyToken, authorizeRoles("vendor", "admin"), updateShoe);
router.delete("/:id", verifyToken, authorizeRoles("vendor", "admin"), deleteShoe);

module.exports = router;