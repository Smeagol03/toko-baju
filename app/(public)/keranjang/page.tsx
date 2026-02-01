"use client";

import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function KeranjangPage() {
  const { items, clearCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b pb-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                Keranjang Belanja
              </h1>
              <p className="mt-2 text-gray-500">
                Lengkapi gaya Anda dengan produk pilihan yang sudah Anda
                masukkan.
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Kosongkan Keranjang
              </button>
            )}
          </div>

          {items.length > 0 ? (
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
              {/* Product List */}
              <div className="lg:col-span-8">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {items.map((item, idx) => (
                      <CartItem
                        key={`${item.product_id}-${item.ukuran}-${item.warna}`}
                        item={item}
                      />
                    ))}
                  </ul>
                </div>

                <div className="mt-10">
                  <Link
                    href="/katalog"
                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Lanjut Belanja
                  </Link>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-16 lg:col-span-4 lg:mt-0">
                <CartSummary />
              </div>
            </div>
          ) : (
            <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="inline-flex items-center justify-center p-6 bg-gray-100 rounded-full mb-6">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Keranjang Anda Kosong
              </h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Belum ada produk yang Anda tambahkan. Yuk, cek koleksi terbaik
                kami di katalog!
              </p>
              <Link
                href="/katalog"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
              >
                Lihat Katalog
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
