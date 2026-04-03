const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

// 1. Cấu hình & Biến môi trường
dotenv.config();

// 2. Khởi tạo app (Quan trọng: Đặt trước khi dùng middleware)
const app = express();

// 3. Kết nối Database
connectDB();

// 4. Middleware
app.use(cors());
app.use(express.json());

// Bắt lỗi parse JSON (Code của Tài giúp server không bị sập khi client gửi data lỗi)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Dữ liệu JSON không hợp lệ' });
    }
    next();
});

// 5. Cấu hình thư mục tĩnh (Static folders)
app.use(express.static(path.join(__dirname, '../App_KhachHang')));
app.use('/admin', express.static(path.join(__dirname, '../Web_Admin'))); // Giao diện quản lý của Tài
app.use('/images', express.static('public/images')); // Thư mục chứa ảnh món ăn

// 6. Routes giao diện (Phần của Yến)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../App_KhachHang/index.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../App_KhachHang/cart.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, '../App_KhachHang/checkout.html'));
});

app.get('/track-order', (req, res) => {
    res.sendFile(path.join(__dirname, '../App_KhachHang/track-order.html'));
});

// 7. API Routes (Sử dụng hệ thống Route của Tài cho gọn)
const authRoutes = require("./src/routes/authRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const productRoutes = require('./src/routes/productRoutes');
const categoryRoutes = require('./src/routes/category.routes');
const userRoutes = require("./src/routes/userRoutes");
const ingredientRoutes = require("./src/routes/ingredientRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
// const aiRoutes = require("./src/routes/aiRoutes"); // Bật dòng này nếu Yến đã có file aiRoutes

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes); // Đã bao gồm cả logic tạo đơn và lấy đơn của Yến
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/reports", reportRoutes);
// app.use("/api/ai", aiRoutes); 

// 8. Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 CaféSync Server đang chạy tại: http://localhost:${PORT}`);
});