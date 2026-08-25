const { transporter } = require("../config/mailer");
const { buildOrderConfirmationHtml } = require("./emailTemplates");

async function sendOrderConfirmationEmail(order, userEmail) {
  if (!process.env.SMTP_HOST) {
    console.warn("⚠️ SMTP non configuré, email de confirmation non envoyé.");
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Fashion." <no-reply@fashion.com>',
      to: userEmail,
      subject: `Confirmation de votre commande #${order.id.slice(0, 8)}`,
      html: buildOrderConfirmationHtml(order),
    });
    console.log(`✅ Email de confirmation envoyé à ${userEmail}`);
  } catch (err) {
    console.error("❌ Échec de l'envoi de l'email de confirmation :", err.message);
  }
}

module.exports = { sendOrderConfirmationEmail };