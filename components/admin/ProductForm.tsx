"use client";

import { useState, useEffect } from "react";
import { Product, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploader } from "./ImageUploader";
import { supabase } from "@/lib/supabase";

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  initialData?: Product;
  onSuccess: () => void;
}

const UKURAN_OPTIONS = ["S", "M", "L", "XL", "XXL", "All Size"];

export function ProductForm({
  mode,
  productId,
  initialData,
  onSuccess,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [nama, setNama] = useState(initialData?.nama || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [harga, setHarga] = useState(initialData?.harga || 0);
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "");
  const [kategori_id, setKategoriId] = useState(initialData?.kategori_id || "");
  const [gambar, setGambar] = useState<string[]>(initialData?.gambar || []);
  const [varian_ukuran, setVarianUkuran] = useState<string[]>(
    initialData?.varian_ukuran || [],
  );
  const [varian_warna, setVarianWarna] = useState<string[]>(
    initialData?.varian_warna || [],
  );
  const [newWarna, setNewWarna] = useState("");
  const [stok, setStok] = useState(initialData?.stok || 0);
  const [aktif, setAktif] = useState(initialData?.aktif ?? true);
  const [featured, setFeatured] = useState(initialData?.featured ?? false);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("aktif", true)
        .order("urutan");
      setCategories(data || []);
      setIsFetchingCategories(false);

      if (!initialData && data && data.length > 0) {
        setKategoriId(data[0].id);
      }
    }
    fetchCategories();
  }, [initialData]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNama(val);
    if (mode === "create") {
      setSlug(generateSlug(val));
    }
  };

  const toggleUkuran = (size: string) => {
    setVarianUkuran((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const addWarna = () => {
    if (newWarna.trim() && !varian_warna.includes(newWarna.trim())) {
      setVarianWarna([...varian_warna, newWarna.trim()]);
      setNewWarna("");
    }
  };

  const removeWarna = (color: string) => {
    setVarianWarna(varian_warna.filter((c) => c !== color));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gambar.length === 0) {
      setError("Minimal harus ada 1 gambar produk.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(true);
    setError(null);

    const productData = {
      nama,
      slug,
      harga: Number(harga),
      deskripsi,
      kategori_id,
      gambar,
      varian_ukuran,
      varian_warna,
      stok: Number(stok),
      aktif,
      featured,
    };

    try {
      if (mode === "create") {
        const { error: insertError } = await supabase
          .from("products")
          .insert([productData]);
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", productId);
        if (updateError) throw updateError;
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan produk.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      {error && (
        <div className="flex items-center text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
          {error}
        </div>
      )}

      {/* Informasi Dasar */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-4">
          Informasi Dasar
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nama Produk
            </label>
            <Input
              value={nama}
              onChange={handleNameChange}
              placeholder="Contoh: Kaos Polos Cotton Combed"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Slug</label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="kaos-polos-cotton-combed"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Kategori
            </label>
            <select
              value={kategori_id}
              onChange={(e) => setKategoriId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm h-10 shadow-sm"
              required
            >
              {isFetchingCategories ? (
                <option>Memuat kategori...</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nama}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Harga (Rp)
            </label>
            <Input
              type="number"
              value={harga}
              onChange={(e) => setHarga(Number(e.target.value))}
              min={0}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            className="w-full min-h-[150px] border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm shadow-sm"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Jelaskan detail produk, bahan, keunggulan, dll..."
            required
          />
        </div>
      </section>

      {/* Gambar Produk */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-4">
          Gambar Produk
        </h3>
        <ImageUploader images={gambar} onChange={setGambar} />
      </section>

      {/* Varian */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-4">
          Varian & Spesifikasi
        </h3>
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 italic">
              Pilih Ukuran Tersedia:
            </label>
            <div className="flex flex-wrap gap-2">
              {UKURAN_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleUkuran(size)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium border transition-all shadow-sm",
                    varian_ukuran.includes(size)
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:border-blue-400",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 italic">
              Warna:
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {varian_warna.map((color) => (
                <span
                  key={color}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 group border border-gray-200"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => removeWarna(color)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <Input
                value={newWarna}
                onChange={(e) => setNewWarna(e.target.value)}
                placeholder="Tambah warna (contoh: Hitam)"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addWarna())
                }
              />
              <Button
                type="button"
                onClick={addWarna}
                variant="outline"
                className="shrink-0 h-10 px-3"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stok & Visibilitas */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-4">
          Stok & Visibilitas
        </h3>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Total Stok
            </label>
            <Input
              type="number"
              value={stok}
              onChange={(e) => setStok(Number(e.target.value))}
              min={0}
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-8">
            <button
              type="button"
              onClick={() => setAktif(!aktif)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-sm",
                aktif ? "bg-blue-600" : "bg-gray-200",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  aktif ? "translate-x-5" : "translate-x-0",
                )}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">
              Publikasikan
            </span>
          </div>

          <div className="flex items-center gap-3 pt-8">
            <button
              type="button"
              onClick={() => setFeatured(!featured)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-sm",
                featured ? "bg-amber-500" : "bg-gray-200",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  featured ? "translate-x-5" : "translate-x-0",
                )}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">
              Tampilkan di Homepage
            </span>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50 flex justify-end gap-3 max-w-[calc(100%-var(--sidebar-width))] ml-auto">
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all font-semibold min-w-[160px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : mode === "create" ? (
            "Tambah Produk"
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </div>
    </form>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
