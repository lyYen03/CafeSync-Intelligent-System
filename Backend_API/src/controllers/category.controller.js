const Category = require("../models/Category");

// GET
exports.getCategories = async (req, res) => {
  const data = await Category.find();
  res.json(data);
};

// POST
exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  const saved = await category.save();
  res.json(saved);
};

// PUT
exports.updateCategory = async (req, res) => {
  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

// DELETE
exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};