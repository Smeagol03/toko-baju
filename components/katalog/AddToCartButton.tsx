"use client";

import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import QuickAddModal from "./QuickAddModal";

interface AddToCartButtonProps {
  product: Product;
  variant?: "icon" | "full";
  selectedUkuran?: string;
  selectedWarna?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export default function AddToCartButton({
  product,
  variant = "icon",
  selectedUkuran = "",
  selectedWarna = "",
  className,
  onSuccess,
  onError,
}: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const hasVariants =
    (product.varian_ukuran && product.varian_ukuran.length > 0) ||
    (product.varian_warna && product.varian_warna.length > 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Jika ini adalah tombol icon (di kartu produk) dan produk punya varian, buka modal
    if (variant === "icon" && hasVariants) {
      setShowModal(true);
      return;
    }

    // Validasi jika varian dibutuhkan (biasanya dipanggil dari ProductActions)
    if (variant === "full") {
      if (product.varian_ukuran?.length > 0 && !selectedUkuran) {
        onError?.("Pilih ukuran terlebih dahulu");
        return;
      }
      if (product.varian_warna?.length > 0 && !selectedWarna) {
        onError?.("Pilih warna terlebih dahulu");
        return;
      }
    }

    addItem({
      product_id: product.id,
      nama: product.nama,
      harga: product.harga,
      gambar:
        product.gambar?.[0] || "https://picsum.photos/seed/product/400/500",
      ukuran: selectedUkuran,
      warna: selectedWarna,
      qty: 1,
    });

    setIsAdded(true);
    onSuccess?.();
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={cn(
            "p-2 rounded-lg transition-all active:scale-95",
            isAdded
              ? "bg-green-600 text-white"
              : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white",
            className,
          )}
          title="Tambah ke Keranjang"
        >
          {isAdded ? (
            <Check className="h-4 w-4" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={cn(
            "w-full flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95",
            isAdded
              ? "bg-green-600 text-white shadow-green-100"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200",
            className,
          )}
        >
          {isAdded ? (
            <>
              <Check className="mr-3 h-6 w-6" />
              Berhasil Ditambah!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-3 h-6 w-6" />
              Tambah ke Keranjang
            </>
          )}
        </button>
      )}

      {/* Quick Add Modal */}
      {variant === "icon" && hasVariants && (
        <QuickAddModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          product={product}
        />
      )}
    </>
  );
}
