import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { cartApi } from "../api/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [summary, setSummary] = useState({ itemsCount: 0, subtotal: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setSummary({ itemsCount: 0, subtotal: 0 });
      return;
    }
    setIsLoading(true);
    try {
      const res = await cartApi.getCart();
      setCart(res.cart);
      setSummary(res.summary);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  async function addItem(data) {
    const res = await cartApi.addItem(data);
    setCart(res.cart);
    setSummary(res.summary);
  }

  async function updateItem(itemId, quantity) {
    const res = await cartApi.updateItem(itemId, quantity);
    setCart(res.cart);
    setSummary(res.summary);
  }

  async function removeItem(itemId) {
    const res = await cartApi.removeItem(itemId);
    setCart(res.cart);
    setSummary(res.summary);
  }

  const value = { cart, summary, isLoading, addItem, updateItem, removeItem, refreshCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé à l'intérieur de <CartProvider>.");
  return context;
}
