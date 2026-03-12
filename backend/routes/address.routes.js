const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/address.controller");

const router = express.Router();

router.use(verifyToken);

router.post("/add", addAddress);
router.get("/", getAddresses);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

module.exports = router;
