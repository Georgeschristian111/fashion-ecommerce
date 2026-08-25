function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function buildOrderConfirmationHtml(order) {
  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee;">
          <strong>${item.product.name}</strong>
          ${item.variant ? `<br/><span style="color:#888;font-size:13px;">${item.variant.size} · ${item.variant.color}</span>` : ""}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:center;">×${item.quantity}</td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.unitPrice)}</td>
      </tr>`
    )
    .join("");

  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111;">
    <div style="background:#111827;padding:24px;text-align:center;">
      <span style="color:#fff;font-size:22px;font-weight:800;">Fashion.</span>
    </div>

    <div style="padding:32px 24px;">
      <h1 style="font-size:20px;margin:0 0 8px;">Merci pour votre commande !</h1>
      <p style="color:#555;font-size:14px;line-height:1.6;">
        Nous avons bien reçu votre paiement. Voici le récapitulatif de votre commande
        <strong>#${order.id.slice(0, 8)}</strong>.
      </p>

      <table style="width:100%;border-collapse:collapse;margin-top:24px;font-size:14px;">
        ${itemsRows}
      </table>

      <table style="width:100%;margin-top:16px;font-size:14px;">
        <tr><td style="color:#555;">Subtotal</td><td style="text-align:right;">${formatPrice(order.subtotal)}</td></tr>
        <tr><td style="color:#555;">Shipping</td><td style="text-align:right;">${Number(order.shipping) === 0 ? "Free" : formatPrice(order.shipping)}</td></tr>
        <tr><td style="color:#555;">Tax</td><td style="text-align:right;">${formatPrice(order.tax)}</td></tr>
        <tr>
          <td style="font-weight:800;font-size:16px;padding-top:8px;">Total</td>
          <td style="font-weight:800;font-size:16px;padding-top:8px;text-align:right;">${formatPrice(order.total)}</td>
        </tr>
      </table>

      ${
        order.address
          ? `<div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:8px;font-size:13px;color:#555;">
              <strong style="color:#111;">Shipping to</strong><br/>
              ${order.address.fullName}<br/>
              ${order.address.line1}<br/>
              ${order.address.city}, ${order.address.zipCode}<br/>
              ${order.address.country}
            </div>`
          : ""
      }

      <p style="margin-top:32px;color:#888;font-size:12px;">
        Une question ? Répondez simplement à cet email ou contactez-nous à support@fashion.com.
      </p>
    </div>
  </div>`;
}

module.exports = { buildOrderConfirmationHtml };