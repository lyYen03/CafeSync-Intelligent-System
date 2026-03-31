const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db'); // Nhập file cấu hình DB

// 1. Cấu hình biến môi trường
dotenv.config();

// 2. Kết nối Database (Phải gọi trước khi định nghĩa Route)
connectDB();

const app = express();

// 3. Middleware
app.use(cors());
app.use(express.json());

// Cấu hình đường dẫn tĩnh cho App_KhachHang
app.use(express.static(path.join(__dirname, '../App_KhachHang')));

// 4. Các Routes hiển thị giao diện (View Routes)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../App_KhachHang/index.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../App_KhachHang/cart.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, '../App_KhachHang/checkout.html'));
});

// 5. Các API Routes (Phần xử lý dữ liệu - Tài sẽ làm tiếp ở đây)
// Ví dụ: app.use('/api/orders', require('./src/routes/orderRoutes'));
// Thêm Model để lưu vào DB (Giả sử Yến đã tạo file models/Order.js như mình chỉ)
const Order = require('./src/models/Order');

// API nhận đơn hàng từ Frontend
app.post('/api/orders', async (req, res) => {
    try {
        console.log("--- DỮ LIỆU FRONTEND GỬI LÊN ---");
        console.log(req.body); // Xem nó có ra đúng { items: [...], total: ... } không

        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();

        console.log("✅ Đã lưu vào MongoDB thành công!");
        res.status(201).json({ success: true, message: "Đơn hàng đã được gửi tới quán!" });
    } catch (error) {
        console.error("❌ LỖI LƯU DATABASE:");
        console.error(error.message); // Nó sẽ hiện cụ thể là thiếu trường nào (vd: Path `location` is required)
        res.status(500).json({ success: false, message: "Lỗi Server", error: error.message });
    }
});
// 6. Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 CaféSync Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`📂 Thư mục gốc hiện tại: ${__dirname}`);
});