"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

interface CategoryFormProps {
  category?: Category;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    urutan: 0,
    aktif: true,
  });
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setFormData({
        nama: category.nama,
        deskripsi: category.deskripsi || "",
        urutan: category.urutan,
        aktif: category.aktif,
      });
      setSlug(category.slug);
    } else {
      setFormData({
        nama: "",
        deskripsi: "",
        urutan: 0,
        aktif: true,
      });
      setSlug("");
    }
  }, [category]);

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "nama") {
      setSlug(generateSlug(value));
    }
    
    setFormData({
      ...formData,
      [name]: name === "urutan" ? Number(value) : value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      if (category) {
        // Update existing category
        const { error } = await supabase
          .from("categories")
          .update({
            ...formData,
            slug,
          })
          .eq("id", category.id);

        if (error) throw error;
      } else {
        // Insert new category
        const { error } = await supabase
          .from("categories")
          .insert([{
            ...formData,
            slug,
          }]);

        if (error) throw error;
      }

      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan kategori");
      console.error("Error saving category:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      <div>
        <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
          Nama Kategori *
        </label>
        <input
          type="text"
          id="nama"
          name="nama"
          value={formData.nama}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nama kategori"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => setSlug(generateSlug(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Slug otomatis dari nama"
        />
        <p className="mt-1 text-xs text-gray-500">Slug akan digunakan dalam URL</p>
      </div>

      <div>
        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Deskripsi kategori (opsional)"
        />
      </div>

      <div>
        <label htmlFor="urutan" className="block text-sm font-medium text-gray-700 mb-1">
          Urutan Tampil
        </label>
        <input
          type="number"
          id="urutan"
          name="urutan"
          value={formData.urutan}
          onChange={handleInputChange}
          min="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Urutan tampil"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="aktif"
          name="aktif"
          checked={formData.aktif}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="aktif" className="ml-2 block text-sm text-gray-700">
          Kategori Aktif
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {category ? "Memperbarui..." : "Menyimpan..."}
            </>
          ) : (
            category ? "Perbarui Kategori" : "Simpan Kategori"
          )}
        </Button>
      </div>
    </form>
  );
}