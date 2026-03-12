const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const shoeRoutes = require("./routes/shoeRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cart.routes");
const addressRoutes = require("./routes/address.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const vendorOrderRoutes = require("./routes/vendor.routes");


const app = express();



// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/shoes", shoeRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/vendor/orders-manage", vendorOrderRoutes);

module.exports = app;