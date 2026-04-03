const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category" // 👈 liên kết
  },
  image: String,
  description: String
});

module.exports = mongoose.model("Product", ProductSchema);