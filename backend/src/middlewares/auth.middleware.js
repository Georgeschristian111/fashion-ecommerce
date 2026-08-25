const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { AppError } = require("./errorHandler");

// Vérifie que l'utilisateur est authentifié (lit le token depuis le cookie httpOnly)
async function protect(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    throw new AppError("Vous devez être connecté pour accéder à cette ressource.", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new AppError("Session invalide ou expirée. Veuillez vous reconnecter.", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
    select: { id: true, fullName: true, email: true, role: true },
  });

  if (!user) {
    throw new AppError("Utilisateur introuvable.", 401);
  }

  req.user = user; // disponible dans les routes suivantes
  next();
}

// Restreint l'accès à certains rôles (ex: admin uniquement)
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("Vous n'avez pas la permission d'effectuer cette action.", 403);
    }
    next();
  };
}

module.exports = { protect, restrictTo };
