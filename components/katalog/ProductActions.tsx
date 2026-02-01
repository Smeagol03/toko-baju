"use client";

import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { ShoppingCart, Check, AlertCircle } from "lucide-react";
import AddToCartButton from "./AddToCartButton";

import { cn } from "@/lib/utils";

interface ProductActionsProps {
  product: Product;
  isCompact?: boolean;
  onSuccess?: () => void;
}

export default function ProductActions({
  product,
  isCompact,
  onSuccess,
}: ProductActionsProps) {
  const { addItem } = useCartStore();
  const [selectedUkuran, setSelectedUkuran] = useState<string>("");
  const [selectedWarna, setSelectedWarna] = useState<string>("");
  const [error, setError] = useState("");

  return (
    <div className={cn("space-y-6", isCompact ? "py-2" : "py-6")}>
      {/* Varian Ukuran */}
      {product.varian_ukuran && product.varian_ukuran.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
            Pilih Ukuran
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.varian_ukuran.map((ukuran: string) => (
              <button
                key={ukuran}
                onClick={() => setSelectedUkuran(ukuran)}
                className={cn(
                  "px-4 py-2 border rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  selectedUkuran === ukuran
                    ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                    : "border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600",
                )}
              >
                {ukuran}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Varian Warna */}
      {product.varian_warna && product.varian_warna.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
            Pilih Warna
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.varian_warna.map((warna: string) => (
              <button
                key={warna}
                onClick={() => setSelectedWarna(warna)}
                className={cn(
                  "px-4 py-2 border rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  selectedWarna === warna
                    ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                    : "border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600",
                )}
              >
                {warna}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {/* Stok Info */}
      <div className="flex items-center text-sm text-gray-600">
        <Check className="h-4 w-4 text-green-500 mr-2" />
        Stok tersedia:{" "}
        <span className="font-bold ml-1">{product.stok} pcs</span>
      </div>

      {/* Add to Cart Button */}
      <div className="pt-4">
        <AddToCartButton
          product={product}
          variant="full"
          selectedUkuran={selectedUkuran}
          selectedWarna={selectedWarna}
          onError={(msg) => setError(msg)}
          onSuccess={() => {
            setError("");
            onSuccess?.();
          }}
        />
      </div>
    </div>
  );
}
