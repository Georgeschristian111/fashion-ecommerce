const { body, validationResult } = require("express-validator");
const { AppError } = require("../middlewares/errorHandler");

// Rassemble les erreurs de validation et les transforme en AppError lisible
function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(" ");
    throw new AppError(message, 400);
  }
  next();
}

const registerValidator = [
  body("fullName").trim().notEmpty().withMessage("Le nom complet est requis."),
  body("email").isEmail().withMessage("Email invalide.").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères.")
    .matches(/\d/)
    .withMessage("Le mot de passe doit contenir au moins un chiffre."),
  checkValidation,
];

const loginValidator = [
  body("email").isEmail().withMessage("Email invalide.").normalizeEmail(),
  body("password").notEmpty().withMessage("Le mot de passe est requis."),
  checkValidation,
];

module.exports = { registerValidator, loginValidator };
