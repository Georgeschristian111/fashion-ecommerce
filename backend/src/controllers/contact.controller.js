const prisma = require("../config/prisma");

// POST /api/contact
async function submitMessage(req, res) {
  const { name, email, message } = req.body;

  const contactMessage = await prisma.contactMessage.create({
    data: { name, email, message },
  });

  res.status(201).json({
    success: true,
    message: "Votre message a bien été envoyé. Nous vous répondrons rapidement.",
    contactMessage,
  });
}

module.exports = { submitMessage };
