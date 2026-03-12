const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL not found in .env file");
    }

    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;