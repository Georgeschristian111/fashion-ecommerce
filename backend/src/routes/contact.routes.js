const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const { submitMessage } = require("../controllers/contact.controller");
const { contactValidator } = require("../utils/cartOrderValidators");

// Anti-spam sur le formulaire de contact (accessible sans authentification)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5,
  message: { success: false, message: "Trop de messages envoyés. Réessayez plus tard." },
});

router.post("/", contactLimiter, contactValidator, submitMessage);

module.exports = router;
