"use client";

import { useRouter, useSearchParams } from "next/navigation";
import FilterSidebar from "./FilterSidebar";
import { Category } from "@/types";

interface FilterWrapperProps {
  categories: Category[];
}

export default function FilterWrapper({ categories }: FilterWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentKategori = searchParams.get("kategori");
  const currentSearch = searchParams.get("search") || "";
  const currentMin = searchParams.get("min");
  const currentMax = searchParams.get("max");

  const updateFilters = (newParams: {
    kategori?: string | null;
    search?: string;
    min?: number | null;
    max?: number | null;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newParams.kategori !== undefined) {
      if (newParams.kategori) params.set("kategori", newParams.kategori);
      else params.delete("kategori");
    }

    if (newParams.search !== undefined) {
      if (newParams.search) params.set("search", newParams.search);
      else params.delete("search");
    }

    if (newParams.min !== undefined) {
      if (newParams.min) params.set("min", newParams.min.toString());
      else params.delete("min");
    }

    if (newParams.max !== undefined) {
      if (newParams.max) params.set("max", newParams.max.toString());
      else params.delete("max");
    }

    router.push(`/katalog?${params.toString()}`);
  };

  return (
    <FilterSidebar
      categories={categories}
      selectedCategory={currentKategori}
      onCategoryChange={(slug) => updateFilters({ kategori: slug })}
      searchQuery={currentSearch}
      onSearchChange={(query) => updateFilters({ search: query })}
      priceRange={[
        parseInt(currentMin || "0"),
        parseInt(currentMax || "1000000"),
      ]}
      onPriceChange={(range) => updateFilters({ min: range[0], max: range[1] })}
      onClearFilters={() => router.push("/katalog")}
    />
  );
}
