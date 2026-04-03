const Ingredient = require("../models/Ingredient");


// 📌 1. Lấy tất cả nguyên liệu
const getIngredients = async (req, res) => {
  try {
    const data = await Ingredient.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📌 2. Thêm nguyên liệu
const createIngredient = async (req, res) => {
  try {
    const newItem = await Ingredient.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// 📌 3. Cập nhật nguyên liệu
const updateIngredient = async (req, res) => {
  try {
    const updated = await Ingredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// 📌 4. Xóa nguyên liệu
const deleteIngredient = async (req, res) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📌 5. Lấy nguyên liệu sắp hết
const getLowStock = async (req, res) => {
  try {
    const data = await Ingredient.find({
      $expr: { $lte: ["$quantity", "$minStock"] },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📌 6. Trừ kho khi bán hàng
const reduceStock = async (req, res) => {
  try {
    const items = req.body.items;

    for (let item of items) {
      await Ingredient.findByIdAndUpdate(item.id, {
        $inc: { quantity: -item.quantity },
      });
    }

    res.json({ message: "Stock updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  getLowStock,
  reduceStock,
};