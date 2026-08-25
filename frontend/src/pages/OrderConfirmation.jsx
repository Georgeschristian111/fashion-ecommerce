import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { paymentsApi } from "../api/payments";
import { formatPrice } from "../utils/formatPrice";

const MAX_POLL_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 2000;

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let timeoutId;

    async function poll() {
      try {
        const res = await paymentsApi.verifyPayment(orderId);
        if (!isMounted) return;
        setOrder(res.order);

        // Le webhook Stripe peut arriver quelques secondes après la redirection.
        // On revérifie automatiquement tant que la commande est encore PENDING.
        if (res.status === "PENDING" && attemptsRef.current < MAX_POLL_ATTEMPTS) {
          attemptsRef.current += 1;
          timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
        } else {
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    }

    poll();
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="container-page py-20 text-center text-gray-500">
        Aucune commande à afficher.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <Clock className="animate-pulse text-gray-400" size={40} />
        <p className="mt-4 text-gray-500">Confirmation du paiement en cours...</p>
      </div>
    );
  }

  const isPaid = order?.status === "PAID" || order?.status === "SHIPPED" || order?.status === "DELIVERED";
  const isCancelled = order?.status === "CANCELLED";

  return (
    <div className="container-page flex flex-col items-center py-16 text-center">
      {isPaid && (
        <>
          <CheckCircle2 size={56} className="text-green-500" />
          <h1 className="mt-5 text-3xl font-extrabold text-gray-900">Merci pour votre commande !</h1>
          <p className="mt-2 text-gray-500">
            Votre paiement a été confirmé. Un email de confirmation vous a été envoyé.
          </p>
        </>
      )}

      {isCancelled && (
        <>
          <XCircle size={56} className="text-red-500" />
          <h1 className="mt-5 text-3xl font-extrabold text-gray-900">Commande annulée</h1>
          <p className="mt-2 text-gray-500">
            Le paiement n&apos;a pas été finalisé. Votre panier n&apos;a pas été débité.
          </p>
        </>
      )}

      {!isPaid && !isCancelled && (
        <>
          <Clock size={56} className="text-amber-500" />
          <h1 className="mt-5 text-3xl font-extrabold text-gray-900">Paiement en cours de traitement</h1>
          <p className="mt-2 max-w-md text-gray-500">
            Cela peut prendre quelques instants. Vous pouvez suivre le statut de votre commande
            dans votre compte.
          </p>
        </>
      )}

      {order && (
        <div className="mt-8 w-full max-w-sm rounded-xl border border-gray-100 p-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="font-mono text-gray-900">{order.id.slice(0, 8)}...</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="font-bold text-gray-900">{order.status}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Link to="/shop" className="btn-secondary">
          Continue Shopping
        </Link>
        <Link to="/account" className="btn-primary">
          Voir mes commandes
        </Link>
      </div>
    </div>
  );
}
