const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderID: { type: String, required: true },
    items: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            options: {
                size: String,
                sugar: String,
                ice: String
            },
            note: String
        }
    ],
    totalPrice: { type: Number, required: true },
    location: { type: String, required: true }, // Bàn số hoặc Mang đi
    status: { type: String, default: 'Chờ xác nhận' }, // Chờ xác nhận, Đang pha chế, Hoàn thành
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);