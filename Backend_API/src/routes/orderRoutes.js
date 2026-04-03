const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
} = require("../controllers/orderController");

// 1. Nhận đơn hàng (Dùng cho cả giao diện Khách và Admin)
// Cả hai đường dẫn này đều sẽ chạy hàm createOrder của Tài
router.post("/", createOrder);
router.post("/place-order", createOrder); // Giữ cái này để code Frontend cũ của Yến không bị lỗi

// 2. Lấy danh sách đơn hàng (Cho Admin của Tài)
router.get("/", getOrders);

// 3. Lấy chi tiết đơn hàng (Cho tính năng Theo dõi đơn của Yến)
router.get("/:id", getOrderById);

// 4. Cập nhật trạng thái & Xóa (Cho Admin)
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;