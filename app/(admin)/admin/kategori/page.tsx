"use client";

import { useState, useEffect } from "react";
import { Plus, FolderOpen, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types";
import { CategoryTable } from "@/components/admin/CategoryTable";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("urutan", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditData(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditData(category);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditData(null);
  };

  const handleSubmit = async (formData: Partial<Category>) => {
    setIsSubmitting(true);
    try {
      if (editData) {
        // Update
        const { error } = await supabase
          .from("categories")
          .update(formData)
          .eq("id", editData.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from("categories").insert([formData]);
        if (error) throw error;
      }

      await fetchCategories();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving category:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsSubmitting(true);
    try {
      // Check if products exist in this category (optional but recommended)
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("kategori_id", deleteConfirmId);

      if (count && count > 0) {
        alert(`Gagal menghapus: Masih ada ${count} produk dalam kategori ini.`);
        return;
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", deleteConfirmId);

      if (error) throw error;
      await fetchCategories();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="size-6 text-blue-600" />
            Kelola Kategori
          </h1>
          <p className="text-gray-500 mt-1">
            Tambahkan atau edit kategori produk Anda.
          </p>
        </div>
        {!isFormOpen && (
          <Button
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 shadow-sm"
          >
            <Plus className="size-4 mr-2" />
            Tambah Kategori
          </Button>
        )}
      </div>

      {isFormOpen ? (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="size-4 mr-2" />
              Kembali ke Daftar
            </Button>
          </div>
          <CategoryForm
            initialData={editData}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            isLoading={isSubmitting}
          />
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleOpenEdit}
          onDelete={(id) => setDeleteConfirmId(id)}
          isLoading={isLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Hapus Kategori?"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak
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
