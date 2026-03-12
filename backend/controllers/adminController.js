const User = require("../models/User");
const Shoe = require("../models/Shoe");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalVendors = await User.countDocuments({ role: "vendor" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    const totalShoes = await Shoe.countDocuments();

    res.status(200).json({
      totalUsers,
      totalVendors,
      totalAdmins,
      totalShoes,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // ✅ Admin khud ko delete na kar sake
    if (req.user.id === userId) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete own account"
      });
    }

    // ✅ Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// controllers/adminController.js


exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const shoes = await Shoe.find()
      .skip(skip)
      .limit(limit);

    const total = await Shoe.countDocuments();

    res.status(200).json({
      success: true,
      products: shoes,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
