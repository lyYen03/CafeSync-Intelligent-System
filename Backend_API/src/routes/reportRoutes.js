const express = require("express");
const router = express.Router();

const {
  getTotalRevenue,
  getTodayRevenue,
  getMonthRevenue,
  getRevenueByDay,
} = require("../controllers/reportController");

router.get("/total", getTotalRevenue);
router.get("/today", getTodayRevenue);
router.get("/month", getMonthRevenue);
router.get("/chart/week", getRevenueByDay);

module.exports = router;