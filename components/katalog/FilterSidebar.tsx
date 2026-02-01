"use client";

import { Category } from "@/types";
import { Search, X } from "lucide-react";

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceChange,
  onClearFilters,
}: FilterSidebarProps) {
  // Common price ranges
  const priceRanges: [number, number][] = [
    [0, 50000],
    [50000, 100000],
    [100000, 200000],
    [200000, 500000],
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Cari Produk
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Nama baju..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Kategori
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              selectedCategory === null
                ? "bg-blue-600 text-white font-semibold shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Semua Produk
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                selectedCategory === category.slug
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category.nama}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Rentang Harga
        </h3>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => onPriceChange(range)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                priceRange[0] === range[0] && priceRange[1] === range[1]
                  ? "bg-blue-50 text-blue-600 font-semibold border border-blue-200"
                  : "text-gray-600 border border-transparent hover:bg-gray-100"
              }`}
            >
              {range[0] === 0
                ? `Di bawah ${formatPrice(range[1])}`
                : `${formatPrice(range[0])} - ${formatPrice(range[1])}`}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={onClearFilters}
        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-dashed border-gray-200 hover:border-red-200"
      >
        <X className="mr-2 h-4 w-4" />
        Hapus Filter
      </button>
    </div>
  );
}
