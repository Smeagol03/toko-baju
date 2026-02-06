"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderOpen, Star, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

interface StatsData {
  totalProduk: number;
  totalKategori: number;
  produkFeatured: number;
  stokMenipis: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient();

        // Fetch total produk aktif
        const { count: totalProdukCount, error: produkError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("aktif", true);

        if (produkError) throw produkError;

        // Fetch total kategori
        const { count: totalKategoriCount, error: kategoriError } = await supabase
          .from("categories")
          .select("*", { count: "exact", head: true });

        if (kategoriError) throw kategoriError;

        // Fetch produk featured
        const { count: featuredCount, error: featuredError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("featured", true);

        if (featuredError) throw featuredError;

        // Fetch produk stok menipis (< 10)
        const { count: stokMenipisCount, error: stokError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .lt("stok", 10);

        if (stokError) throw stokError;

        setStats({
          totalProduk: totalProdukCount || 0,
          totalKategori: totalKategoriCount || 0,
          produkFeatured: featuredCount || 0,
          stokMenipis: stokMenipisCount || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data");
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg">
        <p>Data tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Produk */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Produk</CardTitle>
          <Package className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProduk}</div>
          <p className="text-xs text-gray-500 mt-1">Produk aktif</p>
        </CardContent>
      </Card>

      {/* Total Kategori */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Kategori</CardTitle>
          <FolderOpen className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalKategori}</div>
          <p className="text-xs text-gray-500 mt-1">Kategori tersedia</p>
        </CardContent>
      </Card>

      {/* Produk Featured */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Produk Featured</CardTitle>
          <Star className="h-5 w-5 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.produkFeatured}</div>
          <p className="text-xs text-gray-500 mt-1">Produk utama</p>
        </CardContent>
      </Card>

      {/* Stok Menipis */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Stok Menipis</CardTitle>
          <AlertTriangle className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.stokMenipis}</div>
          <p className="text-xs text-gray-500 mt-1">Perlu diisi ulang</p>
        </CardContent>
      </Card>
    </div>
  );
}