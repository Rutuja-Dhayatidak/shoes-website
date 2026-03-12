const express = require("express");

const {
  requestVendor,
  getVendorRequests,
  approveVendor,
  getVendorDashboard,
  getMyProducts,
  updateStock,
  deleteProduct
} = require("../controllers/vendorController");

const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// 👤 User request to become vendor
router.post("/request", verifyToken, requestVendor);

// 👑 Admin view requests
router.get(
  "/requests",
  verifyToken,
  authorizeRoles("admin"),
  getVendorRequests
);

// 👑 Admin approve vendor
router.put(
  "/approve/:id",
  verifyToken,
  authorizeRoles("admin"),
  approveVendor
);


router.get(
  "/dashboard",
  verifyToken,
  authorizeRoles("vendor"),
  getVendorDashboard
);



router.get(
  "/my-products",
  verifyToken,
  authorizeRoles("vendor"),
  getMyProducts
);

router.put(
  "/update-stock/:id",
  verifyToken,
  authorizeRoles("vendor"),
  updateStock
);


router.delete(
  "/delete-product/:id",
  verifyToken,
  authorizeRoles("vendor"),
  deleteProduct
);

module.exports = router;