import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ordersApi } from "../api/orders";
import { paymentsApi } from "../api/payments";
import { formatPrice } from "../utils/formatPrice";

const TAX_RATE = 0.05;
const SHIPPING_FEE = 5.99;
const FREE_SHIPPING_THRESHOLD = 100;

const initialAddress = { fullName: "", line1: "", city: "", zipCode: "", country: "", phone: "" };

export default function Checkout() {
  const { cart, summary, refreshCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = cart?.items || [];
  const shipping = summary.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = Number((summary.subtotal * TAX_RATE).toFixed(2));
  const total = Number((summary.subtotal + shipping + tax).toFixed(2));

  function handleChange(e) {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 1) Crée la commande côté serveur : vérifie et réserve le stock, calcule le total final
      const { order } = await ordersApi.createOrder({ shippingAddress: address });

      // 2) Demande une session de paiement Stripe pour cette commande
      const { url } = await paymentsApi.createCheckoutSession(order.id);

      await refreshCart(); // le panier a été vidé côté serveur après création de la commande

      // 3) Redirige vers la page de paiement hébergée par Stripe (jamais de champ carte sur notre site)
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-gray-500">Votre panier est vide.</p>
        <button onClick={() => navigate("/shop")} className="btn-primary mt-6">
          Retour à la boutique
        </button>
      </div>
    );
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>

          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              required
              value={address.fullName}
              onChange={handleChange}
              className="input-field mt-2"
            />
          </div>

          <div>
            <label htmlFor="line1" className="block text-sm font-semibold text-gray-900">
              Address
            </label>
            <input
              id="line1"
              name="line1"
              required
              value={address.line1}
              onChange={handleChange}
              className="input-field mt-2"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-gray-900">
                City
              </label>
              <input
                id="city"
                name="city"
                required
                value={address.city}
                onChange={handleChange}
                className="input-field mt-2"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-900">
                ZIP Code
              </label>
              <input
                id="zipCode"
                name="zipCode"
                required
                value={address.zipCode}
                onChange={handleChange}
                className="input-field mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-gray-900">
                Country
              </label>
              <input
                id="country"
                name="country"
                required
                value={address.country}
                onChange={handleChange}
                className="input-field mt-2"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-900">
                Phone <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                className="input-field mt-2"
              />
            </div>
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button type="submit" disabled={isSubmitting} className="btn-primary mt-2 w-full gap-2">
            <Lock size={16} />
            {isSubmitting ? "Redirection vers le paiement..." : "Continue to Payment"}
          </button>
          <p className="text-center text-xs text-gray-400">
            Paiement sécurisé géré par Stripe. Vos données de carte ne transitent jamais par nos serveurs.
          </p>
        </form>

        {/* Récapitulatif */}
        <div className="h-fit rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm text-gray-600">
                <span className="pr-3">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium text-gray-900">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(summary.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
            <span className="text-lg font-extrabold text-gray-900">Total</span>
            <span className="text-lg font-extrabold text-gray-900">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
