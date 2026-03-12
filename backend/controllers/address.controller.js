const Address = require("../models/Address");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

const addAddress = async (req, res) => {
  try {
    const { name, phone, pincode, state, city, address, type } = req.body;
    const userId = req.user._id;

    if (!name || !phone || !pincode || !state || !city || !address) {
      throw new ApiError(400, "All fields are required");
    }

    const newAddress = new Address({
      userId,
      name,
      phone,
      pincode,
      state,
      city,
      address,
      type,
    });

    await newAddress.save();

    return res
      .status(201)
      .json(new ApiResponse(201, newAddress, "Address added successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await Address.find({ userId });

    return res
      .status(200)
      .json(new ApiResponse(200, addresses, "Addresses fetched successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!address) throw new ApiError(404, "Address not found");

    return res
      .status(200)
      .json(new ApiResponse(200, address, "Address updated successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const address = await Address.findOneAndDelete({ _id: id, userId });

    if (!address) throw new ApiError(404, "Address not found");

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Address deleted successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
};
