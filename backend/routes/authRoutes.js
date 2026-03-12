const express = require("express");
const { register, login } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected Route Example
router.get("/profile", verifyToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;