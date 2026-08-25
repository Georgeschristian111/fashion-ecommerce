const prisma = require("../config/prisma");
const { AppError } = require("../middlewares/errorHandler");
const { getOrCreateCart } = require("./cart.controller");

const TAX_RATE = 0.05; // 5%, cohérent avec votre maquette (subtotal 240 -> tax 12)
const SHIPPING_FEE = 5.99;
const FREE_SHIPPING_THRESHOLD = 100;

function computeTotals(subtotal) {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));
  return { shipping, tax, total };
}

// POST /api/orders  { shippingAddress: {...} }
// Crée la commande à partir du panier courant, vérifie et décrémente le stock de façon atomique.
async function createOrder(req, res) {
  const { shippingAddress } = req.body;
  const userId = req.user.id;

  const cart = await getOrCreateCart(userId);
  if (cart.items.length === 0) {
    throw new AppError("Votre panier est vide.", 400);
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const { shipping, tax, total } = computeTotals(subtotal);

  // Transaction : vérifie le stock, le décrémente, crée l'adresse + la commande, vide le panier.
  // Si une étape échoue (ex: stock devenu insuffisant entre-temps), tout est annulé.
  const order = await prisma.$transaction(async (tx) => {
    for (const item of cart.items) {
      const availableStock = item.variant ? item.variant.stock : item.product.stock;
      if (availableStock < item.quantity) {
        throw new AppError(
          `Stock insuffisant pour "${item.product.name}". Il ne reste que ${availableStock} unité(s).`,
          409
        );
      }
    }

    for (const item of cart.items) {
      if (item.variant) {
        await tx.productVariant.update({
          where: { id: item.variant.id },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    const address = await tx.address.create({
      data: { userId, ...shippingAddress },
    });

    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId: address.id,
        subtotal,
        shipping,
        tax,
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.product.price, // on fige le prix au moment de l'achat
          })),
        },
      },
      include: { items: true, address: true },
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });

  res.status(201).json({ success: true, order });
}

// GET /api/orders/my
async function getMyOrders(req, res) {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true, variant: true } } },
  });
  res.json({ success: true, orders });
}

// GET /api/orders/:id
async function getOrderById(req, res) {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      items: { include: { product: true, variant: true } },
      address: true,
    },
  });

  if (!order) throw new AppError("Commande introuvable.", 404);

  // Un utilisateur ne peut voir que ses propres commandes, sauf s'il est admin
  if (order.userId !== req.user.id && req.user.role !== "ADMIN") {
    throw new AppError("Accès refusé.", 403);
  }

  res.json({ success: true, order });
}

// PUT /api/orders/:id/status (admin)
async function updateOrderStatus(req, res) {
  const { status } = req.body;
  const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (!validStatuses.includes(status)) {
    throw new AppError(`Statut invalide. Valeurs autorisées : ${validStatuses.join(", ")}.`, 400);
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
  });

  res.json({ success: true, order });
}

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus };
