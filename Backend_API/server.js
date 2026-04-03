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

// Bắt lỗi parse JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON payload' });
    }
    next();
});

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
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

const orderRoutes = require("./src/routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const productRoutes = require('./src/routes/productRoutes');
app.use('/api/products', productRoutes);

const categoryRoutes = require('./src/routes/category.routes');
app.use('/api/categories', categoryRoutes);

const userRoutes = require("./src/routes/userRoutes");
app.use("/api/users", userRoutes);

const ingredientRoutes = require("./src/routes/ingredientRoutes");
app.use("/api/ingredients", ingredientRoutes);

const reportRoutes = require("./src/routes/reportRoutes");
app.use("/api/reports", reportRoutes);
// ❗ XOÁ API cũ này đi (trùng với routes)
// KHÔNG cần nữa:
// app.post('/api/orders', ...)

// 8. Chạy server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 CaféSync Server đang chạy tại: http://localhost:${PORT}`);
});