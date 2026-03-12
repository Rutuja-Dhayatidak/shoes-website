const express = require("express");
const { getDashboardStats, getAllUsers, deleteUser, getAllProducts } = require("../controllers/adminController");

const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Dashboard stats
router.get(
  "/stats",
  verifyToken,
  authorizeRoles("admin"),
  getDashboardStats
);

// 👇 Users route alag se banana hoga
router.get(
  "/users",
  verifyToken,
  authorizeRoles("admin"),
  getAllUsers
);



router.delete(
  "/delete-user/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteUser
);


router.get(
  "/products",
  verifyToken,
  authorizeRoles("admin"),
  getAllProducts
);

module.exports = router;