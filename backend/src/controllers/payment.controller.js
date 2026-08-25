const stripe = require("../config/stripe");
const prisma = require("../config/prisma");
const { AppError } = require("../middlewares/errorHandler");
const { sendOrderConfirmationEmail } = require("../utils/emailService");

// POST /api/payments/create-checkout-session/:orderId
// Crée une session Stripe Checkout à partir d'une commande PENDING existante.
async function createCheckoutSession(req, res) {
  const { orderId } = req.params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true, variant: true } } },
  });

  if (!order) throw new AppError("Commande introuvable.", 404);
  if (order.userId !== req.user.id) throw new AppError("Accès refusé.", 403);
  if (order.status !== "PENDING") {
    throw new AppError("Cette commande a déjà été traitée.", 400);
  }

  // Chaque article de la commande devient une "line item" Stripe.
  // On utilise le prix figé dans OrderItem (unitPrice), jamais un prix envoyé par le client.
  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.variant
          ? `${item.product.name} (${item.variant.size}, ${item.variant.color})`
          : item.product.name,
      },
      unit_amount: Math.round(Number(item.unitPrice) * 100),
    },
    quantity: item.quantity,
  }));

  if (Number(order.shipping) > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Frais de livraison" },
        unit_amount: Math.round(Number(order.shipping) * 100),
      },
      quantity: 1,
    });
  }
  if (Number(order.tax) > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Taxe" },
        unit_amount: Math.round(Number(order.tax) * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    customer_email: req.user.email,
    success_url: `${process.env.CLIENT_URL}/order-confirmation?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    metadata: { orderId: order.id },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  res.json({ success: true, url: session.url });
}

// Remet en stock les articles d'une commande annulée/expirée
async function restoreStock(order) {
  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      } else {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }
  });
}

// POST /api/payments/webhook
async function handleWebhook(req, res) {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️ Signature webhook Stripe invalide :", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { orderId } = session.metadata;

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (order && order.status === "PENDING") {
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { status: "PAID", stripePaymentId: session.payment_intent },
          include: {
            items: { include: { product: true, variant: true } },
            address: true,
          },
        });

        const user = await prisma.user.findUnique({ where: { id: updatedOrder.userId } });
        if (user) {
          await sendOrderConfirmationEmail(updatedOrder, user.email);
        }
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object;
      const { orderId } = session.metadata;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (order && order.status === "PENDING") {
        await restoreStock(order);
        await prisma.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
      }
      break;
    }

    default:
      break;
  }

  res.json({ received: true });
}

// GET /api/payments/verify/:orderId
async function verifyPayment(req, res) {
  const order = await prisma.order.findUnique({ where: { id: req.params.orderId } });

  if (!order) throw new AppError("Commande introuvable.", 404);
  if (order.userId !== req.user.id) throw new AppError("Accès refusé.", 403);

  res.json({ success: true, status: order.status, order });
}

module.exports = { createCheckoutSession, handleWebhook, verifyPayment };