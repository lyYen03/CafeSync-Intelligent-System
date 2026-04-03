const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Sử dụng cấu hình của Tài để đảm bảo dùng chung Database CafeSyncDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "CafeSyncDB"
    });

    console.log("✅ Đã kết nối thành công tới CafeSyncDB");
  } catch (err) {
    console.error("❌ Lỗi kết nối Database:", err.message);
    process.exit(1); // Dừng server nếu không kết nối được DB
  }
};

module.exports = connectDB;