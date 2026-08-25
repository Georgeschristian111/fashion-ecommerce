const express = require("express");
const router = express.Router();

const {
  createCheckoutSession,
  handleWebhook,
  verifyPayment,
} = require("../controllers/payment.controller");
const { protect } = require("../middlewares/auth.middleware");

// Le webhook n'est PAS protégé par notre middleware "protect" (Stripe n'a pas de cookie de session) :
// c'est la vérification de signature (dans le contrôleur) qui garantit l'authenticité.
router.post("/webhook", handleWebhook);

router.post("/create-checkout-session/:orderId", protect, createCheckoutSession);
router.get("/verify/:orderId", protect, verifyPayment);

module.exports = router;
