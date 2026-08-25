const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const prisma = require("../config/prisma");
const { AppError } = require("../middlewares/errorHandler");
const { signToken, sendTokenCookie } = require("../utils/token");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Ne jamais renvoyer le hash du mot de passe au client
function toPublicUser(user) {
  const { password, googleId, ...publicUser } = user;
  return publicUser;
}

// POST /api/auth/register
async function register(req, res) {
  const { fullName, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("Un compte existe déjà avec cet email.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // On crée l'utilisateur ET son panier vide en une seule transaction
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      cart: { create: {} },
    },
  });

  const token = signToken(user.id);
  sendTokenCookie(res, token);

  res.status(201).json({ success: true, user: toPublicUser(user) });
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  // Message volontairement générique : on ne révèle pas si l'email existe ou non
  if (!user || !user.password) {
    throw new AppError("Email ou mot de passe incorrect.", 401);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError("Email ou mot de passe incorrect.", 401);
  }

  const token = signToken(user.id);
  sendTokenCookie(res, token);

  res.json({ success: true, user: toPublicUser(user) });
}

// POST /api/auth/google  { credential: "<id_token venant de Google Identity Services>" }
async function googleAuth(req, res) {
  const { credential } = req.body;
  if (!credential) {
    throw new AppError("Token Google manquant.", 400);
  }

  // Vérifie la signature et la validité du token directement auprès de Google
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  let user = await prisma.user.findUnique({ where: { email: payload.email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        fullName: payload.name || payload.email.split("@")[0],
        email: payload.email,
        googleId: payload.sub,
        cart: { create: {} },
      },
    });
  } else if (!user.googleId) {
    // Lie le compte existant (créé par email/mdp) à Google
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId: payload.sub },
    });
  }

  const token = signToken(user.id);
  sendTokenCookie(res, token);

  res.json({ success: true, user: toPublicUser(user) });
}

// GET /api/auth/me
async function getMe(req, res) {
  res.json({ success: true, user: req.user });
}

// POST /api/auth/logout
function logout(req, res) {
  res.clearCookie("token");
  res.json({ success: true, message: "Déconnecté avec succès." });
}

module.exports = { register, login, googleAuth, getMe, logout };
