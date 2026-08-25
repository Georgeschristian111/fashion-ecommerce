require("express-async-errors"); // permet d'utiliser async/await dans les routes sans try/catch répétitifs
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

// --- Sécurité de base ---
app.use(helmet()); // en-têtes HTTP sécurisés
app.use(
  cors({
    origin: process.env.CLIENT_URL, // uniquement notre frontend
    credentials: true,
  })
);

// Limite le nombre de requêtes pour éviter le brute-force / DoS basique
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requêtes / IP / 15min
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// --- Le webhook Stripe a besoin du body brut : il est monté AVANT express.json() ---
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// --- Parsers ---
app.use(express.json({ limit: "10kb" })); // limite la taille du body (évite les abus)
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- Routes ---
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/contact", require("./routes/contact.routes"));

// --- Gestion des erreurs (toujours en dernier) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
