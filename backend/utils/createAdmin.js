const User = require("../models/User");

const createOrUpdateAdmin = async () => {
  try {
    const admin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!admin) {
      await User.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
        isApproved: true,
      });

      console.log("✅ Admin created");
    } else {
      admin.role = "admin";
      admin.isApproved = true;
      await admin.save();

      console.log("✅ Admin role updated");
    }

  } catch (error) {
    console.log("❌ Admin creation error:", error.message);
  }
};

module.exports = createOrUpdateAdmin;