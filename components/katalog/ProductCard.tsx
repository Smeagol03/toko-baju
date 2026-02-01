import Link from "next/link";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Format price to Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <Link
        href={`/katalog/${product.slug}`}
        className="relative block aspect-4/5 overflow-hidden"
      >
        <img
          src={
            product.gambar?.[0] || "https://picsum.photos/seed/product/400/500"
          }
          alt={product.nama}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.featured && (
          <div className="absolute top-2 left-2">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              Featured
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/katalog/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors line-clamp-1">
            {product.nama}
          </h3>
        </Link>
        <p className="mt-1 text-lg font-bold text-gray-900">
          {formatPrice(product.harga)}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/katalog/${product.slug}`}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Lihat Detail
          </Link>
          <button
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            title="Tambah ke Keranjang"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
