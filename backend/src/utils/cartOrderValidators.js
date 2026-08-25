const { body, validationResult } = require("express-validator");
const { AppError } = require("../middlewares/errorHandler");

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

const addCartItemValidator = [
  body("productId").isUUID().withMessage("Identifiant produit invalide."),
  body("variantId").optional().isUUID().withMessage("Identifiant de variante invalide."),
  body("quantity")
    .isInt({ min: 1, max: 20 })
    .withMessage("La quantité doit être comprise entre 1 et 20."),
  checkValidation,
];

const updateCartItemValidator = [
  body("quantity")
    .isInt({ min: 1, max: 20 })
    .withMessage("La quantité doit être comprise entre 1 et 20."),
  checkValidation,
];

const createOrderValidator = [
  body("shippingAddress.fullName").trim().notEmpty().withMessage("Le nom complet est requis."),
  body("shippingAddress.line1").trim().notEmpty().withMessage("L'adresse est requise."),
  body("shippingAddress.city").trim().notEmpty().withMessage("La ville est requise."),
  body("shippingAddress.zipCode").trim().notEmpty().withMessage("Le code postal est requis."),
  body("shippingAddress.country").trim().notEmpty().withMessage("Le pays est requis."),
  checkValidation,
];

const contactValidator = [
  body("name").trim().notEmpty().withMessage("Le nom est requis."),
  body("email").isEmail().withMessage("Email invalide.").normalizeEmail(),
  body("message")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Le message doit contenir entre 10 et 2000 caractères."),
  checkValidation,
];

module.exports = {
  addCartItemValidator,
  updateCartItemValidator,
  createOrderValidator,
  contactValidator,
};
