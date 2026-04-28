const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getOrdersByEmail // <--- Đã thêm hàm mới
} = require("../controllers/orderController");

// 1. Nhận đơn hàng
router.post("/", createOrder);
router.post("/place-order", createOrder);

// 2. Lấy danh sách đơn hàng (Cho Admin)
router.get("/", getOrders);

// 3. Lấy lịch sử đơn hàng theo Email (Cho tính năng của Yến)
// Phải đặt cái này TRÊN cái /:id để Express không nhầm "user" là một cái "id"
router.get("/user/:email", getOrdersByEmail);

// 4. Lấy chi tiết đơn hàng theo ID
router.get("/:id", getOrderById);

// 5. Cập nhật & Xóa
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;