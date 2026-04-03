const express = require("express");
const router = express.Router();

const {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  getLowStock,
  reduceStock,
} = require("../controllers/ingredientController");

router.get("/", getIngredients);
router.post("/", createIngredient);
router.put("/:id", updateIngredient);
router.delete("/:id", deleteIngredient);

router.get("/low-stock", getLowStock);
router.patch("/reduce", reduceStock);

module.exports = router;