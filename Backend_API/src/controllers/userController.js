const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ĐĂNG KÝ
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email đã tồn tại" });

        const user = await User.create({ name, email, password, phone });
        res.status(201).json({ message: "Đăng ký thành công!", userId: user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ĐĂNG NHẬP
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token
            });
        } else {
            res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };