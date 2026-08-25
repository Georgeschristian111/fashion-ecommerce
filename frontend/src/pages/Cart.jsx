import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import CartItemRow from "../components/ui/CartItemRow";

// Reproduit côté client la même logique que le backend (voir order.controller.js) pour
// afficher un récapitulatif immédiat. Le total définitif est toujours recalculé et
// vérifié côté serveur à la création de la commande — ceci n'est qu'un aperçu.
const TAX_RATE = 0.05;
const SHIPPING_FEE = 5.99;
const FREE_SHIPPING_THRESHOLD = 100;

export default function Cart() {
  const { cart, summary, isLoading, updateItem, removeItem } = useCart();

  const items = cart?.items || [];
  const shipping = summary.subtotal >= FREE_SHIPPING_THRESHOLD || summary.subtotal === 0 ? 0 : SHIPPING_FEE;
  const tax = Number((summary.subtotal * TAX_RATE).toFixed(2));
  const total = Number((summary.subtotal + shipping + tax).toFixed(2));

  if (isLoading) {
    return <div className="container-page py-20 text-center text-gray-500">Chargement...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag size={40} className="text-gray-300" />
        <h1 className="mt-4 text-2xl font-extrabold text-gray-900">Votre panier est vide</h1>
        <p className="mt-2 text-sm text-gray-500">Parcourez notre boutique pour trouver votre style.</p>
        <Link to="/shop" className="btn-primary mt-6">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/">Home</Link> <span>›</span> <span className="font-medium text-gray-900">Cart</span>
      </nav>
      <p className="mb-8 text-gray-500">{summary.itemsCount} Items in your cart</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} onUpdateQuantity={updateItem} onRemove={removeItem} />
          ))}
        </div>

        <div className="h-fit rounded-xl border border-gray-100 p-6">
          <h2 className="text-xl font-extrabold text-gray-900">Order Summary</h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items</span>
              <span>{summary.itemsCount}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(summary.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
            <span className="text-lg font-extrabold text-gray-900">Total</span>
            <span className="text-lg font-extrabold text-gray-900">{formatPrice(total)}</span>
          </div>

          <Link to="/checkout" className="btn-primary mt-6 w-full">
            Proceed to Checkout
          </Link>
          <Link
            to="/shop"
            className="mt-3 block text-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Continue Shopping
          </Link>

          <div className="mt-6 space-y-1.5 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
            <p>✓ Free shipping on orders over $100</p>
            <p>✓ Secure payment with Stripe</p>
            <p>✓ Easy 7-day returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
