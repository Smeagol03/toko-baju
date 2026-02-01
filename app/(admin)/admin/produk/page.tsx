"use client";

import { useState, useEffect } from "react";
import { Plus, Package, Search, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product, Category } from "@/types";
import { ProductTable } from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

export default function AdminProdukPage() {
  const [products, setProducts] = useState<
    (Product & { categories: { nama: string } | null })[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [{ data: productsData }, { data: categoriesData }] =
        await Promise.all([
          supabase
            .from("products")
            .select("*, categories(nama)")
            .order("created_at", { ascending: false }),
          supabase.from("categories").select("*").order("urutan"),
        ]);

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteConfirmId);
      if (error) throw error;
      setProducts(products.filter((p) => p.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.kategori_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="size-6 text-blue-600" />
            Kelola Produk
          </h1>
          <p className="text-gray-500 mt-1">
            Daftar semua produk di toko Anda.
          </p>
        </div>
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 shadow-sm"
        >
          <Link href="/admin/produk/tambah">
            <Plus className="size-4 mr-2" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Cari produk berdasarkan nama atau slug..."
            className="pl-10 h-11 bg-white border-gray-100 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white border border-gray-100 rounded-lg text-sm h-11 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nama}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <ProductTable
        products={paginatedProducts}
        onDelete={(id) => setDeleteConfirmId(id)}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredProducts.length}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Hapus Produk?"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak
            dapat dibatalkan.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmId(null)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
