"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { NormalizedProduct, CartItem } from "@/lib/commerce/types";

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  subtotal: string;
  addItem: (product: NormalizedProduct, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  checkoutUrl: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback(
    (product: NormalizedProduct, quantity: number = 1) => {
      // Only Shopify products go in cart; Amazon products link out
      if (product.source === "amazon") return;

      const variantId = product.variants[0]?.id ?? product.id;

      setItems((prev) => {
        const existing = prev.find((item) => item.variantId === variantId);
        if (existing) {
          return prev.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prev,
          {
            id: `cart-${Date.now()}`,
            variantId,
            product,
            quantity,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(() => {
    const total = items.reduce(
      (sum, item) => sum + Number(item.product.price.amount) * item.quantity,
      0
    );
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total);
  }, [items]);

  /**
   * In production, this would be the Shopify checkout URL from the cart API.
   * For now, null since we're using demo data.
   */
  const checkoutUrl: string | null = null;

  const value = useMemo(
    () => ({
      items,
      totalQuantity,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      checkoutUrl,
    }),
    [
      items,
      totalQuantity,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      checkoutUrl,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
