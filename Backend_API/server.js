const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
const Groq = require("groq-sdk");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. CẤU HÌNH & KHỞI TẠO
dotenv.config();
const app = express();

// 2. KẾT NỐI DATABASE
connectDB();

// 3. KHỞI TẠO AI GROQ
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
let chatContext = [];

// 4. MIDDLEWARE
app.use(cors());
app.use(express.json());

// 5. CẤU HÌNH THƯ MỤC TĨNH
const clientPath = path.join(__dirname, '../App_KhachHang');
app.use(express.static(clientPath));
app.use('/admin', express.static(path.join(__dirname, '../Web_Admin')));
app.use('/images', express.static('public/images'));

// 6. ROUTES GIAO DIỆN (HTML)
app.get('/', (req, res) => res.sendFile(path.join(clientPath, 'index.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(clientPath, 'cart.html')));
app.get('/checkout', (req, res) => res.sendFile(path.join(clientPath, 'checkout.html')));
app.get('/track-order', (req, res) => res.sendFile(path.join(clientPath, 'track-order.html')));

// 7. API CHỨC NĂNG (Hệ thống gốc của Tài)
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/orders", require("./src/routes/orderRoutes"));
app.use("/api/products", require("./src/routes/productRoutes"));
app.use("/api/categories", require("./src/routes/category.routes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/ingredients", require("./src/routes/ingredientRoutes"));
app.use("/api/reports", require("./src/routes/reportRoutes"));

// --- 8. CHỨC NĂNG ĐĂNG KÝ & ĐĂNG NHẬP ---
const User = require('./src/models/User');

app.post('/api/auth/register-custom', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Kiểm tra email tồn tại
        const exist = await User.findOne({ email });
        if (exist) return res.status(400).json({ message: "Email này đã được sử dụng!" });

        // Tạo user mới (mật khẩu tự mã hóa trong Model)
        const newUser = new User({
            name,
            email,
            username: email,
            password,
            phone
        });

        await newUser.save();
        res.json({ message: "Đăng ký tài khoản thành công! 🎉" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi hệ thống khi đăng ký." });
    }
});

app.post('/api/auth/login-custom', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại!" });

        // So sánh mật khẩu
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu không chính xác!" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'CAFE_SYNC_SECRET', { expiresIn: '1d' });
        res.json({ token, user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống khi đăng nhập." });
    }
});

// --- 9. API TÌM KIẾM & CHAT AI ---
app.get('/api/search/products', async (req, res) => {
    try {
        const term = req.query.q || "";
        const Product = require('./src/models/Product');
        const results = await Product.find({ name: { $regex: term, $options: 'i' } });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Lỗi tìm kiếm sản phẩm." });
    }
});

app.post('/api/ai/chat', async (req, res) => {
    const user = req.body.userName || "Khách hàng";
    const msg = req.body.message || "";
    try {
        chatContext.push({ role: "user", content: msg });
        if (chatContext.length > 6) chatContext.shift();
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "system", content: "Bạn là Lisieen, trợ lý ảo thông minh của hệ thống CaféSync." }, ...chatContext],
            model: "llama-3.1-8b-instant",
        });
        const reply = chatCompletion.choices[0]?.message?.content || "";
        chatContext.push({ role: "assistant", content: reply });
        res.json({ reply: reply.trim() });
    } catch (error) {
        res.json({ reply: "Lisieen hiện đang bận một chút, bạn thử lại sau nhé!" });
    }
});

// 10. KHỞI CHẠY
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server CaféSync Ready tại cổng: ${PORT}`);
});