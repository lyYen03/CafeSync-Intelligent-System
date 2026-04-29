const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getOrdersByEmail,
    cancelOrder // <--- THÊM hàm này vào đây
} = require("../controllers/orderController");

// 1. Nhận đơn hàng
router.post("/", createOrder);
router.post("/place-order", createOrder);

// 2. Lấy danh sách đơn hàng
router.get("/", getOrders);

// 3. Lấy lịch sử theo Email
router.get("/user/:email", getOrdersByEmail);

// 4. Hủy đơn (Phải đặt TRÊN cái /:id để tránh trùng lặp route)
router.get('/cancel/:orderId', cancelOrder); // <--- ĐỔI THÀNH THẾ NÀY

// 5. Lấy chi tiết & Cập nhật
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;