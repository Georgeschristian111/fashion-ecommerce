const { body, query, validationResult } = require("express-validator");
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

const CATEGORIES = ["MEN", "WOMEN", "CHILDREN"];
const PRODUCT_TYPES = [
  "T_SHIRTS",
  "SHIRTS",
  "HOODIES",
  "JACKETS",
  "JEANS",
  "TROUSERS",
  "SHORTS",
  "SHOES",
];

const productValidator = [
  body("name").trim().notEmpty().withMessage("Le nom du produit est requis."),
  body("description").trim().notEmpty().withMessage("La description est requise."),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Le prix doit être un nombre positif."),
  body("category")
    .isIn(CATEGORIES)
    .withMessage(`Catégorie invalide. Valeurs autorisées : ${CATEGORIES.join(", ")}.`),
  body("productType")
    .isIn(PRODUCT_TYPES)
    .withMessage(`Type de produit invalide. Valeurs autorisées : ${PRODUCT_TYPES.join(", ")}.`),
  body("variants")
    .optional()
    .isArray()
    .withMessage("Les variantes doivent être un tableau."),
  checkValidation,
];

const listProductsValidator = [
  query("category").optional().isIn(CATEGORIES).withMessage("Catégorie invalide."),
  query("productType").optional().isIn(PRODUCT_TYPES).withMessage("Type de produit invalide."),
  query("sort")
    .optional()
    .isIn(["price_asc", "price_desc", "newest"])
    .withMessage("Tri invalide."),
  query("page").optional().isInt({ min: 1 }).withMessage("Page invalide."),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limite invalide."),
  checkValidation,
];

module.exports = { productValidator, listProductsValidator, CATEGORIES, PRODUCT_TYPES };
