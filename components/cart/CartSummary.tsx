"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function CartSummary() {
  const { totalPrice, totalItems } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const count = totalItems();
  const total = totalPrice();

  return (
    <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <ShoppingBag className="mr-2 h-5 w-5 text-blue-600" />
        Ringkasan Belanja
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-base text-gray-600">
          <p>Total Item</p>
          <p>{count} pcs</p>
        </div>
        <div className="flex justify-between text-base text-gray-600">
          <p>Subtotal</p>
          <p>{formatPrice(total)}</p>
        </div>
        <div className="flex justify-between text-base text-gray-600">
          <p>Pengiriman</p>
          <p className="text-green-600 font-medium italic">
            Dihitung saat checkout
          </p>
        </div>

        <div className="border-t pt-4 mt-4 flex justify-between text-xl font-bold text-gray-900">
          <p>Total Harga</p>
          <p>{formatPrice(total)}</p>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/checkout"
          className={`w-full flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
            count > 0
              ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
              : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
          }`}
        >
          Lanjut Checkout
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <p className="mt-4 text-xs text-center text-gray-500">
          Pesanan akan diteruskan ke WhatsApp Admin kami.
        </p>
      </div>
    </div>
  );
}
