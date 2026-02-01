"use client";

import { Product } from "@/types";
import Modal from "@/components/ui/Modal";
import ProductActions from "./ProductActions";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function QuickAddModal({
  isOpen,
  onClose,
  product,
}: QuickAddModalProps) {
  // Format price to Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pilih Varian Produk"
      className="max-w-md"
    >
      <div className="space-y-6">
        {/* Product Quick Info */}
        <div className="flex items-center space-x-4">
          <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 border">
            <img
              src={
                product.gambar?.[0] ||
                "https://picsum.photos/seed/product/400/500"
              }
              alt={product.nama}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{product.nama}</h4>
            <p className="text-blue-600 font-bold mt-1">
              {formatPrice(product.harga)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Stok: {product.stok} pcs
            </p>
          </div>
        </div>

        {/* Variant Selection & Add Button */}
        <ProductActions
          product={product}
          isCompact
          onSuccess={() => {
            // Memberikan waktu sedikit sebelum menutup modal agar user melihat feedback "Berhasil"
            setTimeout(onClose, 800);
          }}
        />
      </div>
    </Modal>
  );
}
