const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

// 1. Load biến môi trường
dotenv.config();

// 2. Khởi tạo app (PHẢI đặt trước khi dùng app.use)
const app = express();

// 3. Kết nối Database
connectDB();

// 4. Middleware
app.use(cors());
app.use(express.json());

// 5. Static folder (Frontend)
app.use(express.static(path.join(__dirname, '../App_KhachHang')));

// 6. Routes giao diện
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../App_KhachHang/index.html'));
});
app.use('/admin', express.static(path.join(__dirname, '../Web_Admin')));
app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../App_KhachHang/cart.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, '../App_KhachHang/checkout.html'));
});

app.use('/images', express.static('public/images'));
// 7. API Routes (QUAN TRỌNG)
const orderRoutes = require('./src/routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const productRoutes = require('./src/routes/productRoutes');
app.use('/api/products', productRoutes);
// ❗ XOÁ API cũ này đi (trùng với routes)
// KHÔNG cần nữa:
// app.post('/api/orders', ...)

// 8. Chạy server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 CaféSync Server đang chạy tại: http://localhost:${PORT}`);
});