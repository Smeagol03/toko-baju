"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryFormProps {
  initialData?: Category | null;
  onSubmit: (data: Partial<Category>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: CategoryFormProps) {
  const [nama, setNama] = useState(initialData?.nama || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "");
  const [urutan, setUrutan] = useState(initialData?.urutan || 0);
  const [aktif, setAktif] = useState(initialData?.aktif ?? true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama);
      setSlug(initialData.slug);
      setDeskripsi(initialData.deskripsi);
      setUrutan(initialData.urutan);
      setAktif(initialData.aktif);
    }
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
    if (!initialData) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !slug) {
      setError("Nama dan Slug wajib diisi.");
      return;
    }

    try {
      await onSubmit({
        nama,
        slug,
        deskripsi,
        urutan: Number(urutan),
        aktif,
      });
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan kategori.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        {error && (
          <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
            <AlertCircle className="h-4 w-4 mr-2 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nama Kategori
            </label>
            <Input
              value={nama}
              onChange={handleNameChange}
              placeholder="Contoh: Kaos Polos"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Slug</label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="kaos-polos"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Deskripsi (Opsional)
          </label>
          <textarea
            className="w-full min-h-[100px] border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Koleksi kaos polos berkualitas..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Urutan Tampil
            </label>
            <Input
              type="number"
              value={urutan}
              onChange={(e) => setUrutan(Number(e.target.value))}
              min={0}
            />
          </div>
          <div className="flex items-center gap-3 pt-8">
            <button
              type="button"
              onClick={() => setAktif(!aktif)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
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
            <span className="text-sm text-gray-700">Status Aktif</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="submit"
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : initialData ? (
            "Simpan Perubahan"
          ) : (
            "Tambah Kategori"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex-1 h-11 text-gray-600 hover:bg-gray-100 font-medium rounded-xl"
          disabled={isLoading}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
