const mongoose = require("mongoose");

const shoeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    // 👇 Main Category
    category: {
      type: String,
      enum: ["men", "women", "kids"],
      required: true,
    },

    // 👇 Sub Category (type of shoe)
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["Running", "Casual", "Formal", "Sports", "Sneakers", "Boots", "Loafers", "Sandals", "Flip Flops", "Hiking"],
    },

    price: {
      type: Number,
      required: true,
    },

    sizes: [
      {
        size: {
          type: Number,
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    image: String,        // kept for backward compatibility (first image)
    images: [String],     // array of all uploaded images
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shoe", shoeSchema);