const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
const Order = require('./src/models/Order');

// 1. Cấu hình
dotenv.config();

// 2. Kết nối Database
connectDB();

const app = express();

// 3. Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../App_KhachHang')));

// 4. View Routes (Giao diện)
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

// 5. API Routes (Xử lý dữ liệu)

// API nhận đơn hàng
app.post('/api/orders', async (req, res) => {
    console.log("📩 Nhận được đơn hàng mới:", req.body.orderID);

    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();

        console.log("✅ Lưu MongoDB thành công:", savedOrder.orderID);

        // DÒNG NÀY LÀ CỨU CÁNH: Gửi tín hiệu về để Frontend biết mà tắt "Đang gửi đơn"
        return res.status(201).json({
            success: true,
            message: "Đơn hàng đã được gửi tới quán!",
            order: savedOrder
        });

    } catch (error) {
        console.error("❌ Lỗi lưu đơn hàng:", error.message);
        // Trả về lỗi để Frontend hiện SweetAlert báo lỗi, không bị treo nút
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// API lấy chi tiết đơn hàng theo ID
app.get('/api/orders/:id', async (req, res) => {
    try {
        // Kiểm tra nếu id là 'latest' thì chuyển hướng logic
        if (req.params.id === 'latest') {
            const lastOrder = await Order.findOne().sort({ createdAt: -1 });
            return res.json(lastOrder);
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Không tìm thấy" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Khởi chạy
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 CaféSync Server: http://localhost:${PORT}`);
});