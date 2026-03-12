const User = require("../models/User");
const Shoe = require("../models/Shoe");
// 👤 User sends vendor request
exports.requestVendor = async (req, res) => {
  try {
    if (req.user.role === "vendor") {
      return res.status(400).json({ message: "Already a vendor" });
    }

    req.user.isVendorRequest = true;
    await req.user.save();

    res.json({ message: "Vendor request sent to admin" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👑 Admin get pending vendor requests
exports.getVendorRequests = async (req, res) => {
  try {
    const users = await User.find({
      isVendorRequest: true,
      role: "user",
    });

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 👑 Admin approve vendor
exports.approveVendor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "vendor";
    user.isApproved = true;
    user.isVendorRequest = false;

    await user.save();

    res.json({ message: "Vendor approved successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const totalProducts = await Shoe.countDocuments({
      vendor: vendorId,
    });

    res.status(200).json({
      success: true,
      totalProducts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// 👟 Get only logged-in vendor products


exports.getMyProducts = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalProducts = await Shoe.countDocuments({ vendor: vendorId });
    const products = await Shoe.find({ vendor: vendorId }).skip(skip).limit(limit);

    const updatedProducts = products.map((product) => {
      const totalStock = product.sizes.reduce(
        (sum, sizeObj) => sum + sizeObj.stock,
        0
      );

      let stockStatus = "In Stock";

      if (totalStock === 0) {
        stockStatus = "Out of Stock";
      } else if (totalStock < 5) {
        stockStatus = "Low Stock";
      }

      return {
        ...product.toObject(),
        totalStock,
        stockStatus,
      };
    });

    res.status(200).json({
      success: true,
      products: updatedProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      totalProducts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateStock = async (req, res) => {
  try {
    const { sizes } = req.body;

    const updatedProduct = await Shoe.findOneAndUpdate(
      { _id: req.params.id, vendor: req.user.id }, // 🔐 only own product
      { sizes },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      product: updatedProduct,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Shoe.findOneAndDelete({
      _id: req.params.id,
      vendor: req.user.id, // 🔐 only own product delete
    });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};