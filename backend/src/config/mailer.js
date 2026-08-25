const nodemailer = require("nodemailer");

// Compatible avec n'importe quel fournisseur SMTP : Gmail, SendGrid, Mailtrap (tests), Brevo, etc.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function verifyMailer() {
  try {
    await transporter.verify();
    console.log(" Serveur d'emails prêt");
  } catch (err) {
    console.warn(" Configuration email invalide, les emails ne seront pas envoyés :", err.message);
  }
}

module.exports = { transporter, verifyMailer };