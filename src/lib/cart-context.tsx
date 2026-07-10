import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  product: Product;
  size: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  add: (product: Product, size: string, qty?: number) => void;
  remove: (id: string, size: string) => void;
  setQty: (id: string, size: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
  lastAddedAt: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "youdo-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add: CartCtx["add"] = (product, size, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.size === size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { product, size, qty }];
    });
    setLastAddedAt(Date.now());
  };

  const remove: CartCtx["remove"] = (id, size) =>
    setItems((prev) => prev.filter((i) => !(i.product.id === id && i.size === size)));

  const setQty: CartCtx["setQty"] = (id, size, qty) =>
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === id && i.size === size ? { ...i, qty: Math.max(1, qty) } : i,
      ),
    );

  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, count, total, lastAddedAt }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
