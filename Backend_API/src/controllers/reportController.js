const Order = require("../models/Order");


// 💰 1. Tổng doanh thu
const getTotalRevenue = async (req, res) => {
  try {
    const orders = await Order.find({ status: "Hoàn thành" });

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + order.totalPrice;
    }, 0);

    res.json({ totalRevenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📅 2. Doanh thu hôm nay
const getTodayRevenue = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      status: "Hoàn thành",
      createdAt: { $gte: start, $lte: end },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

    res.json({ todayRevenue: totalRevenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📆 3. Doanh thu theo tháng
const getMonthRevenue = async (req, res) => {
  try {
    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const orders = await Order.find({
      status: "Hoàn thành",
      createdAt: { $gte: startMonth, $lte: endMonth },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

    res.json({ monthRevenue: totalRevenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📊 4. Doanh thu theo ngày (chart data)
const getRevenueByDay = async (req, res) => {
  try {
    const days = 7;
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const orders = await Order.find({
        status: "Hoàn thành",
        createdAt: { $gte: start, $lte: end },
      });

      const total = orders.reduce((sum, o) => sum + o.totalPrice, 0);

      result.push({
        date: start.toISOString().split("T")[0],
        revenue: total,
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTotalRevenue,
  getTodayRevenue,
  getMonthRevenue,
  getRevenueByDay,
};