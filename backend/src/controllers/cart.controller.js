const prisma = require("../config/prisma");
const { AppError } = require("../middlewares/errorHandler");

// Récupère (ou crée si besoin, ex: ancien compte créé avant l'ajout du panier) le panier de l'utilisateur
async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: { orderBy: { position: "asc" }, take: 1 } },
          },
          variant: true,
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: { include: { product: true, variant: true } },
      },
    });
  }

  return cart;
}

function computeCartSummary(cart) {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  return {
    itemsCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: Number(subtotal.toFixed(2)),
  };
}

// GET /api/cart
async function getCart(req, res) {
  const cart = await getOrCreateCart(req.user.id);
  res.json({ success: true, cart, summary: computeCartSummary(cart) });
}

// POST /api/cart/items
async function addItem(req, res) {
  const { productId, variantId, quantity } = req.body;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    throw new AppError("Produit introuvable.", 404);
  }

  let variant = null;
  if (variantId) {
    variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant || variant.productId !== productId) {
      throw new AppError("Variante invalide pour ce produit.", 400);
    }
  }

  const availableStock = variant ? variant.stock : product.stock;
  if (availableStock < quantity) {
    throw new AppError(`Stock insuffisant. Il ne reste que ${availableStock} unité(s).`, 400);
  }

  const cart = await getOrCreateCart(req.user.id);

  // Cherche si l'article (même produit + même variante) est déjà dans le panier
  const existingItem = cart.items.find(
    (item) => item.productId === productId && item.variantId === (variantId || null)
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > availableStock) {
      throw new AppError(`Stock insuffisant pour cette quantité totale (max ${availableStock}).`, 400);
    }
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity,
      },
    });
  }

  const updatedCart = await getOrCreateCart(req.user.id);
  res.status(201).json({ success: true, cart: updatedCart, summary: computeCartSummary(updatedCart) });
}

// PUT /api/cart/items/:itemId
async function updateItem(req, res) {
  const { itemId } = req.params;
  const { quantity } = req.body;

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true, product: true, variant: true },
  });

  if (!item || item.cart.userId !== req.user.id) {
    throw new AppError("Article du panier introuvable.", 404);
  }

  const availableStock = item.variant ? item.variant.stock : item.product.stock;
  if (quantity > availableStock) {
    throw new AppError(`Stock insuffisant. Il ne reste que ${availableStock} unité(s).`, 400);
  }

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });

  const cart = await getOrCreateCart(req.user.id);
  res.json({ success: true, cart, summary: computeCartSummary(cart) });
}

// DELETE /api/cart/items/:itemId
async function removeItem(req, res) {
  const { itemId } = req.params;

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== req.user.id) {
    throw new AppError("Article du panier introuvable.", 404);
  }

  await prisma.cartItem.delete({ where: { id: itemId } });

  const cart = await getOrCreateCart(req.user.id);
  res.json({ success: true, cart, summary: computeCartSummary(cart) });
}

// DELETE /api/cart
async function clearCart(req, res) {
  const cart = await getOrCreateCart(req.user.id);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  res.json({ success: true, message: "Panier vidé." });
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart, getOrCreateCart, computeCartSummary };
