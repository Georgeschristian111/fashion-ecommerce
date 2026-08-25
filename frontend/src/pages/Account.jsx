import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ordersApi } from "../api/orders";
import { formatPrice } from "../utils/formatPrice";
import OrderStatusBadge from "../components/ui/OrderStatusBadge";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    ordersApi
      .getMyOrders()
      .then((res) => isMounted && setOrders(res.orders))
      .catch((err) => console.error("Erreur chargement commandes :", err))
      .finally(() => isMounted && setIsLoading(false));
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Account</h1>
          <p className="mt-1 text-gray-500">
            {user?.fullName} — {user?.email}
          </p>
        </div>
        <button onClick={handleLogout} className="btn-secondary gap-2">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <h2 className="mt-10 text-xl font-bold text-gray-900">Order History</h2>

      {isLoading ? (
        <p className="mt-4 text-sm text-gray-500">Chargement...</p>
      ) : orders.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <Package className="mx-auto text-gray-300" size={36} />
          <p className="mt-3 text-gray-500">Vous n&apos;avez pas encore passé de commande.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-3 rounded-xl border border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-mono text-xs text-gray-400">#{order.id.slice(0, 8)}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {order.items.length} article(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
