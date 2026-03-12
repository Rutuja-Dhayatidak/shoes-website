const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "vendor"],
      default: "user",
    },

    // 👇 User ne vendor request bheji hai ya nahi
    isVendorRequest: {
      type: Boolean,
      default: false,
    },

    // 👇 Admin ne approve kiya ya nahi
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Password Hash
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare Password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);