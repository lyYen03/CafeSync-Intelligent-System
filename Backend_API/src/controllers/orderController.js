const Order = require("../models/Order");

// 📌 1. Xử lý đặt hàng
const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, location, paymentMethod, orderID, customerEmail } = req.body;
    const finalOrderID = orderID || `CFS${Math.floor(Math.random() * 900000 + 100000)}`;

    // --- TRƯỜNG HỢP 1: THANH TOÁN TIỀN MẶT ---
    if (paymentMethod === "Tiền mặt") {
      const newOrder = await Order.create({
        orderID: finalOrderID,
        items,
        totalPrice,
        location,
        paymentMethod: "Tiền mặt",
        customerEmail: customerEmail || "Guest", // Lưu email để làm lịch sử
        status: "Chờ xác nhận",
        createdAt: Date.now(),
      });
      console.log(`✅ Đơn tiền mặt đang đợi xác nhận: ${finalOrderID}`);
      return res.status(201).json(newOrder);
    }

    // --- TRƯỜNG HỢP 2: THANH TOÁN ONLINE (PAYOS) ---
    try {
      const PayOSPkg = require("@payos/node");
      const PayOS = PayOSPkg.default || (typeof PayOSPkg === 'function' ? PayOSPkg : null);

      if (!PayOS) throw new Error("Không tìm thấy Constructor PayOS.");

      const payosInstance = new PayOS(
        process.env.PAYOS_CLIENT_ID,
        process.env.PAYOS_API_KEY,
        process.env.PAYOS_CHECKSUM_KEY
      );

      const orderCode = Number(finalOrderID.replace(/[^0-9]/g, ""));

      const paymentData = {
        orderCode: orderCode,
        amount: totalPrice,
        description: `Thanh toan don ${finalOrderID}`,
        returnUrl: `http://localhost:3001/track-order`,
        cancelUrl: `http://localhost:3001/checkout`,
      };

      const paymentLinkRes = await payosInstance.createPaymentLink(paymentData);

      const pendingOrder = await Order.create({
        orderID: finalOrderID,
        items,
        totalPrice,
        location,
        paymentMethod: "Chuyển khoản/Ví điện tử",
        customerEmail: customerEmail || "Guest", // Lưu email ở đây luôn
        status: "Chờ thanh toán",
        createdAt: Date.now(),
      });

      return res.status(200).json({
        _id: pendingOrder._id,
        checkoutUrl: paymentLinkRes.checkoutUrl,
        message: "Vui lòng quét mã QR để hoàn tất."
      });

    } catch (payError) {
      console.error("Lỗi PayOS:", payError);
      return res.status(500).json({ message: "Lỗi kết nối cổng thanh toán!" });
    }

  } catch (err) {
    console.error("Lỗi tổng quát:", err);
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

// 📌 3. Lấy lịch sử đơn hàng theo Email/Name (Dành cho Yến)
const getOrdersByEmail = async (req, res) => {
  try {
    const identifier = req.params.email;
    const orders = await Order.find({ customerEmail: identifier }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy lịch sử!", error: err.message });
  }
};

// 📌 4. Lấy order theo ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 5. Cập nhật trạng thái
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

// 📌 6. Xóa đơn hàng
const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa đơn hàng thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrdersByEmail, // <--- Nhớ export hàm này
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};