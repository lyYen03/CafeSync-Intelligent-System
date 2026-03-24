const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// 1. Cấu hình biến môi trường
dotenv.config();

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// QUAN TRỌNG: Cấu hình đường dẫn tĩnh để nhận diện HTML/CSS/JS từ App_KhachHang
// Vì server.js nằm trong Backend_API, ta dùng '..' để nhảy ra ngoài vào App_KhachHang
app.use(express.static(path.join(__dirname, '../App_KhachHang')));

// 3. Routes xử lý các trang chính
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../App_KhachHang/index.html'));
});

// Thêm các route này để khi gõ trực tiếp link vẫn ra đúng trang
app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../App_KhachHang/cart.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, '../App_KhachHang/checkout.html'));
});

// 4. Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 CaféSync Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`📂 Thư mục gốc hiện tại: ${__dirname}`);
});