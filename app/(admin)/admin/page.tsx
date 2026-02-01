"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Package, FolderOpen, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProduk: 0,
    totalKategori: 0,
    totalFeatured: 0,
    stokMenipis: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: productsCount },
          { count: categoriesCount },
          { count: featuredCount },
          { count: lowStockCount },
        ] = await Promise.all([
          supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("aktif", true),
          supabase
            .from("categories")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("featured", true),
          supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .lt("stok", 10),
        ]);

        setStats({
          totalProduk: productsCount || 0,
          totalKategori: categoriesCount || 0,
          totalFeatured: featuredCount || 0,
          stokMenipis: lowStockCount || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Selamat Datang, Admin!
        </h1>
        <p className="text-gray-500 mt-1">
          Berikut adalah ringkasan data toko Anda saat ini.
        </p>
      </div>

      {/* Stats Widgets */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <DashboardStats stats={stats} />
      )}

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Aksi Cepat</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/produk/tambah" className="group">
            <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm group-hover:border-blue-200 group-hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Plus className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Tambah Produk</h3>
                  <p className="text-xs text-gray-500">
                    Buat item baru di katalog
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>

          <Link href="/admin/kategori" className="group">
            <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm group-hover:border-blue-200 group-hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                  <FolderOpen className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Kelola Kategori</h3>
                  <p className="text-xs text-gray-500">
                    Atur pengelompokan produk
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-gray-300 group-hover:text-purple-500 transition-colors" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Low Stock Alert */}
      {stats.stokMenipis > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-4">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0">
            <Package className="size-5" />
          </div>
          <div>
            <h3 className="font-medium text-amber-800">
              Perhatian: Stok Menipis
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              Ada {stats.stokMenipis} produk dengan stok kurang dari 10 item.
              Segera lakukan restock untuk menjaga ketersediaan barang.
            </p>
            <Link
              href="/admin/produk"
              className="text-sm font-semibold text-amber-800 hover:underline mt-2 inline-block"
            >
              Lihat Produk &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
