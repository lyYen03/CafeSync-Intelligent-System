const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Lấy tất cả user
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// Lấy user theo ID
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
  res.json(user);
};

// Tạo user mới
exports.createUser = async (req, res) => {
  try {
    const { username, password, name, role } = req.body;

    const exist = await User.findOne({ username });
    if (exist)
      return res.status(400).json({ message: "Username đã tồn tại" });

    const user = new User({ username, password, name, role });
    await user.save();

    res.json({
      message: "Tạo user thành công",
      user: { ...user._doc, password: undefined },
    });
  } catch (err) {
    console.log("🔥 ERROR:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const { username, name, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, name, role },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa user
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xóa user" });
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy user" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch {
    res.status(500).json({ message: "Lỗi server" });
  }
};