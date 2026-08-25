const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { productValidator, listProductsValidator } = require("../utils/productValidators");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

// --- Routes publiques ---
router.get("/", listProductsValidator, getProducts);
router.get("/:slug", getProductBySlug);

// --- Routes admin (protégées) ---
router.post("/", protect, restrictTo("ADMIN"), productValidator, createProduct);
router.put("/:id", protect, restrictTo("ADMIN"), updateProduct);
router.delete("/:id", protect, restrictTo("ADMIN"), deleteProduct);

module.exports = router;
