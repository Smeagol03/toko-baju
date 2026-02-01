"use client";

import { Product } from "@/types";
import { Edit2, Trash2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductTableProps {
  products: (Product & { categories: { nama: string } | null })[];
  onDelete: (id: string) => void;
  isLoading: boolean;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export function ProductTable({
  products,
  onDelete,
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemsPerPage,
}: ProductTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Produk
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Harga
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Stok
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400 italic"
                >
                  Belum ada produk.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                        <img
                          src={
                            product.gambar[0] ||
                            "https://placehold.co/100x100?text=No+Img"
                          }
                          alt={product.nama}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate flex items-center gap-1.5">
                          {product.nama}
                          {product.featured && (
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">
                          {product.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {product.categories?.nama || "Tanpa Kategori"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatPrice(product.harga)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        product.stok < 10 ? "text-red-600" : "text-gray-600",
                      )}
                    >
                      {product.stok}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        product.aktif
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {product.aktif ? "Aktif" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Link href={`/admin/produk/${product.id}/edit`}>
                          <Edit2 className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product.id)}
                        className="size-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="text-sm text-gray-500">
            Menampilkan{" "}
            <span className="font-medium text-gray-700">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium text-gray-700">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            dari <span className="font-medium text-gray-700">{totalItems}</span>{" "}
            produk
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 px-3"
            >
              <ChevronLeft className="size-4 mr-1" />
              Prev
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={cn(
                      "size-9 rounded-lg text-sm font-medium transition-colors",
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 px-3"
            >
              Next
              <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
