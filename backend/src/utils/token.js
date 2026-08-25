const jwt = require("jsonwebtoken");

// Génère un JWT signé contenant uniquement l'id utilisateur (pas de données sensibles dedans)
function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// Envoie le token dans un cookie httpOnly (inaccessible en JS côté client -> protège contre le XSS)
function sendTokenCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd, // HTTPS obligatoire en production
    sameSite: isProd ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  });
}

module.exports = { signToken, sendTokenCookie };
