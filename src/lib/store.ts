"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export type CartItem = {
  key: string;
  id: string;
  quantity: number;
  color: string;
  storage: string;
};
type State = {
  cart: CartItem[];
  wishlist: string[];
  add: (id: string, color: string, storage: string) => void;
  quantity: (key: string, n: number) => void;
  remove: (key: string) => void;
  toggle: (id: string) => void;
};
export const useShop = create<State>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      add: (id, color, storage) =>
        set((s) => {
          const key = `${id}:${color}:${storage}`;
          const found = s.cart.find((i) => i.key === key);
          return {
            cart: found
              ? s.cart.map((i) =>
                  i.key === key
                    ? { ...i, quantity: Math.min(99, i.quantity + 1) }
                    : i,
                )
              : [...s.cart, { key, id, color, storage, quantity: 1 }],
          };
        }),
      quantity: (key, n) =>
        set((s) => ({
          cart: s.cart.map((i) =>
            i.key === key
              ? {
                  ...i,
                  quantity: Math.max(1, Math.min(99, Math.floor(n) || 1)),
                }
              : i,
          ),
        })),
      remove: (key) =>
        set((s) => ({ cart: s.cart.filter((i) => i.key !== key) })),
      toggle: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((v) => v !== id)
            : [...s.wishlist, id],
        })),
    }),
    { name: "okmobile-shop-v1", skipHydration: true },
  ),
);
