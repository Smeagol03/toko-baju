import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, ukuran: string, warna: string) => void;
  updateQty: (
    product_id: string,
    ukuran: string,
    warna: string,
    qty: number
  ) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.product_id === item.product_id &&
              i.ukuran === item.ukuran &&
              i.warna === item.warna
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id &&
                i.ukuran === item.ukuran &&
                i.warna === item.warna
                  ? { ...i, qty: i.qty + item.qty }
                  : i
              ),
            };
          }

          return { items: [...state.items, item] };
        }),

      removeItem: (product_id, ukuran, warna) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.product_id === product_id &&
                i.ukuran === ukuran &&
                i.warna === warna
              )
          ),
        })),

      updateQty: (product_id, ukuran, warna, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === product_id &&
            i.ukuran === ukuran &&
            i.warna === warna
              ? { ...i, qty: Math.max(1, qty) }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.qty, 0),

      totalPrice: () =>
        get().items.reduce((acc, i) => acc + i.harga * i.qty, 0),
    }),
    {
      name: "cart-storage", // localStorage key
    }
  )
);
