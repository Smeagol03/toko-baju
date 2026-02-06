"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Product, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function ProductForm({ mode, productId, onSubmit, onCancel }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nama: "",
    slug: "",
    harga: 0,
    deskripsi: "",
    kategori_id: "",
    gambar: [] as string[],
    varian_ukuran: [] as string[],
    varian_warna: [] as string[],
    stok: 0,
    aktif: true,
    featured: false,
  });

  const [newWarna, setNewWarna] = useState("");
  const availableUkuran = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    loadCategoriesAndProduct();
  }, []);

  const loadCategoriesAndProduct = async () => {
    try {
      const supabase = createClient();
      
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("urutan", { ascending: true });

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // If editing, load product data
      if (mode === "edit" && productId) {
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (productError) throw productError;

        if (productData) {
          setFormData({
            nama: productData.nama,
            slug: productData.slug,
            harga: productData.harga,
            deskripsi: productData.deskripsi,
            kategori_id: productData.kategori_id,
            gambar: productData.gambar || [],
            varian_ukuran: productData.varian_ukuran || [],
            varian_warna: productData.varian_warna || [],
            stok: productData.stok || 0,
            aktif: productData.aktif,
            featured: productData.featured,
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? Number(value) : value;
    
    setFormData({
      ...formData,
      [name]: val,
    });

    // Auto-generate slug when name changes
    if (name === "nama") {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const toggleUkuran = (size: string) => {
    setFormData(prev => {
      if (prev.varian_ukuran.includes(size)) {
        return {
          ...prev,
          varian_ukuran: prev.varian_ukuran.filter(s => s !== size),
        };
      } else {
        return {
          ...prev,
          varian_ukuran: [...prev.varian_ukuran, size],
        };
      }
    });
  };

  const addWarna = () => {
    if (newWarna.trim() && !formData.varian_warna.includes(newWarna.trim())) {
      setFormData(prev => ({
        ...prev,
        varian_warna: [...prev.varian_warna, newWarna.trim()],
      }));
      setNewWarna("");
    }
  };

  const removeWarna = (warna: string) => {
    setFormData(prev => ({
      ...prev,
      varian_warna: prev.varian_warna.filter(w => w !== warna),
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      gambar: images,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      if (mode === "edit" && productId) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update({
            ...formData,
            slug: formData.slug || generateSlug(formData.nama),
          })
          .eq("id", productId);

        if (error) throw error;
      } else {
        // Insert new product
        const { error } = await supabase
          .from("products")
          .insert([{
            ...formData,
            slug: formData.slug || generateSlug(formData.nama),
          }]);

        if (error) throw error;
      }

      if (onSubmit) onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan produk");
      console.error("Error saving product:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="h-12 bg-gray-100 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {mode === "edit" ? "Edit Produk" : "Tambah Produk Baru"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Produk *
            </label>
            <Input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              required
              minLength={3}
              className="w-full"
              placeholder="Nama produk"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <Input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: generateSlug(e.target.value)})}
              className="w-full"
              placeholder="Slug otomatis dari nama"
            />
            <p className="mt-1 text-xs text-gray-500">Slug akan digunakan dalam URL</p>
          </div>

          <div>
            <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-1">
              Harga *
            </label>
            <Input
              type="number"
              id="harga"
              name="harga"
              value={formData.harga}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="kategori_id" className="block text-sm font-medium text-gray-700 mb-1">
              Kategori *
            </label>
            <Select 
              name="kategori_id" 
              value={formData.kategori_id} 
              onValueChange={(value) => setFormData({...formData, kategori_id: value})}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi *
            </label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full"
              placeholder="Deskripsi produk"
            />
          </div>
        </div>

        <div className="space-y-4">
          <ImageUploader 
            images={formData.gambar} 
            onImagesChange={handleImagesChange} 
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Varian Ukuran
            </label>
            <div className="flex flex-wrap gap-2">
              {availableUkuran.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleUkuran(size)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                    formData.varian_ukuran.includes(size)
                      ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                      : "border-gray-200 text-gray-700 hover:border-blue-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Varian Warna
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                value={newWarna}
                onChange={(e) => setNewWarna(e.target.value)}
                placeholder="Tambah warna"
                className="flex-1"
              />
              <Button type="button" onClick={addWarna} variant="secondary">
                Tambah
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.varian_warna.map((warna, index) => (
                <div 
                  key={index} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                >
                  {warna}
                  <button
                    type="button"
                    onClick={() => removeWarna(warna)}
                    className="ml-2 text-blue-600 hover:text-blue-900"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="stok" className="block text-sm font-medium text-gray-700 mb-1">
              Stok
            </label>
            <Input
              type="number"
              id="stok"
              name="stok"
              value={formData.stok}
              onChange={handleInputChange}
              min="0"
              className="w-full"
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                Produk Aktif
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Produk Featured
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "edit" ? "Memperbarui..." : "Menyimpan..."}
            </>
          ) : (
            mode === "edit" ? "Perbarui Produk" : "Simpan Produk"
          )}
        </Button>
      </div>
    </form>
  );
}