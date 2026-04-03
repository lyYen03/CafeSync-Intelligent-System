const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true }, // Tài dùng để đăng nhập admin
    password: { type: String, required: true },
    name: { type: String, required: true }, // Tên của Yến
    email: { type: String, unique: true, sparse: true }, // Yến thêm vào, dùng sparse để không lỗi nếu khách không nhập
    phone: { type: String }, // Trường phone của Yến
    role: { type: String, default: "user" }, // Mặc định là user, Tài sẽ chỉnh admin sau
  },
  { timestamps: true } // Tài thêm cái này để tự động có ngày tạo/cập nhật
);

// 1. So sánh mật khẩu (Hàm của Tài viết rất tiện)
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 2. Tự động mã hóa mật khẩu trước khi lưu (Cả Yến và Tài đều có, rất bảo mật)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (next) next();
});

module.exports = mongoose.model("User", UserSchema);