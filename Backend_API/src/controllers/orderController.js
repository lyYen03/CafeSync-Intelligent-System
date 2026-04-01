const Order = require('../models/Order');

// Lấy tất cả đơn hàng
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllOrders,
    updateOrderStatus
};