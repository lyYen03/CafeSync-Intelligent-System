<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Route nhận đơn hàng từ khách
router.post('/place-order', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json({ message: "Đặt món thành công!", order: savedOrder });
    } catch (error) {
        res.status(400).json({ message: "Lỗi khi đặt món", error: error.message });
    }
});
=======
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);

router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);
>>>>>>> origin/tai

module.exports = router;