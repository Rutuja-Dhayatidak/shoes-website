const Shoe = require("../models/Shoe");




exports.createShoe = async (req, res) => {
  try {

    const sizes = JSON.parse(req.body.sizes);

    // Support multiple images (req.files) or single image (req.file)
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(f => `/uploads/${f.filename}`);
    } else if (req.file) {
      imagePaths = [`/uploads/${req.file.filename}`];
    }

    const shoe = await Shoe.create({
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      type: req.body.type,
      price: req.body.price,
      description: req.body.description,
      sizes,
      image: imagePaths[0] || null,   // first image (backward-compatible)
      images: imagePaths,              // all images
      vendor: req.user._id,
    });

    res.status(201).json({ success: true, data: shoe });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✅ Get All Shoes (with pagination)
exports.getShoes = async (req, res) => {
  try {
    const { category, type, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (type) filter.type = { $regex: new RegExp(`^${type}$`, 'i') };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // max 50 per page
    const skip = (pageNum - 1) * limitNum;

    const [shoes, totalCount] = await Promise.all([
      Shoe.find(filter).populate("vendor", "name email").skip(skip).limit(limitNum),
      Shoe.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: shoes.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: shoes,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Single Shoe
exports.getSingleShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);

    if (!shoe) {
      return res.status(404).json({ message: "Shoe not found" });
    }

    res.json(shoe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Shoe (Admin Only)
exports.updateShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);

    if (!shoe) {
      return res.status(404).json({ message: "Shoe not found" });
    }

    // Admin OR Owner Vendor
    if (
      req.user.role !== "admin" &&
      shoe.vendor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(shoe, req.body);
    await shoe.save();

    res.json({ success: true, data: shoe });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Shoe (Admin Only)
exports.deleteShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findOne({
      _id: req.params.id,
      vendor: req.user._id,
    });

    if (!shoe) {
      return res.status(404).json({ message: "Not authorized" });
    }

    await shoe.deleteOne();

    res.json({ message: "Shoe deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get distinct shoe types for a category
exports.getShoeTypes = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const types = await Shoe.distinct('type', filter);
    res.json({ success: true, data: types.filter(Boolean).sort() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get distinct shoe brands for a category
exports.getShoeBrands = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const brands = await Shoe.distinct('brand', filter);
    res.json({ success: true, data: brands.filter(Boolean).sort() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
