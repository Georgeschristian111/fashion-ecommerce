// Classe d'erreur personnalisée pour des erreurs métier claires (404, 400, 401...)
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware 404 (aucune route ne correspond)
function notFound(req, res, next) {
  next(new AppError(`Route non trouvée : ${req.originalUrl}`, 404));
}

// Middleware global de gestion des erreurs (doit être déclaré en dernier dans app.js)
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Erreur interne du serveur";

  // Erreurs Prisma connues
  if (err.code === "P2002") {
    statusCode = 409;
    message = "Cette valeur existe déjà (violation de contrainte unique).";
  }
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Ressource introuvable.";
  }

  // Ne jamais exposer la stack trace en production
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = { AppError, notFound, errorHandler };
