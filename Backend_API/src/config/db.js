const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "CafeSyncDB" // 👈 ép dùng đúng DB
    });

    console.log("✅ Connected to CafeSyncDB");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;