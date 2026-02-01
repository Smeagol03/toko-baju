"use client";

import { CartItem as CartItemType } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQty, removeItem } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex items-center space-x-4 py-6 border-b">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200">
        <img
          src={item.gambar}
          alt={item.nama}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between text-base font-semibold text-gray-900">
          <h3>{item.nama}</h3>
          <p className="ml-4">{formatPrice(item.harga * item.qty)}</p>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {item.warna} | {item.ukuran}
        </p>

        <div className="flex flex-1 items-end justify-between text-sm mt-2">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() =>
                updateQty(
                  item.product_id,
                  item.ukuran,
                  item.warna,
                  item.qty - 1,
                )
              }
              className="p-1 px-2 hover:bg-gray-100 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 font-medium border-x">{item.qty}</span>
            <button
              onClick={() =>
                updateQty(
                  item.product_id,
                  item.ukuran,
                  item.warna,
                  item.qty + 1,
                )
              }
              className="p-1 px-2 hover:bg-gray-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.product_id, item.ukuran, item.warna)}
            className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
