const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const {
  register,
  login,
  googleAuth,
  getMe,
  logout,
} = require("../controllers/auth.controller");
const { registerValidator, loginValidator } = require("../utils/validators");
const { protect } = require("../middlewares/auth.middleware");

// Limite stricte sur les routes sensibles (register/login) : anti brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 tentatives / 15 min / IP
  message: { success: false, message: "Trop de tentatives. Réessayez plus tard." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, registerValidator, register);
router.post("/login", authLimiter, loginValidator, login);
router.post("/google", authLimiter, googleAuth);
router.post("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
