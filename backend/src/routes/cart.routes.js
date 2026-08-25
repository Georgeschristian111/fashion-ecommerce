const express = require("express");
const router = express.Router();

const { getCart, addItem, updateItem, removeItem, clearCart } = require("../controllers/cart.controller");
const { addCartItemValidator, updateCartItemValidator } = require("../utils/cartOrderValidators");
const { protect } = require("../middlewares/auth.middleware");

// Toutes les routes du panier nécessitent d'être connecté
router.use(protect);

router.get("/", getCart);
router.post("/items", addCartItemValidator, addItem);
router.put("/items/:itemId", updateCartItemValidator, updateItem);
router.delete("/items/:itemId", removeItem);
router.delete("/", clearCart);

module.exports = router;
