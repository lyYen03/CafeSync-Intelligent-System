const Order = require("../models/Order");


// 📌 1. Tạo order
const createOrder = async (req, res) => {
  try {
    const newOrder = await Order.create({
      orderID: `ORD-${Date.now()}`,
      items: req.body.items,
      totalPrice: req.body.totalPrice,
      location: req.body.location,
      status: req.body.status || "Chờ xác nhận",
      createdAt: req.body.createdAt || Date.now(), // 👈 FIX HERE
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 2. Lấy tất cả order
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📌 3. Lấy order theo ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📌 4. Cập nhật trạng thái đơn
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📌 5. Xóa order
const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted order" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};