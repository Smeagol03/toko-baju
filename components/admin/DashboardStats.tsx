"use client";

import { Package, FolderOpen, Star, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  description: string;
}

interface DashboardStatsProps {
  stats: {
    totalProduk: number;
    totalKategori: number;
    totalFeatured: number;
    stokMenipis: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems: StatItem[] = [
    {
      label: "Total Produk",
      value: stats.totalProduk,
      icon: Package,
      color: "text-blue-600 bg-blue-50",
      description: "Produk aktif di toko",
    },
    {
      label: "Total Kategori",
      value: stats.totalKategori,
      icon: FolderOpen,
      color: "text-purple-600 bg-purple-50",
      description: "Kategori produk",
    },
    {
      label: "Produk Featured",
      value: stats.totalFeatured,
      icon: Star,
      color: "text-amber-600 bg-amber-50",
      description: "Menampil di homepage",
    },
    {
      label: "Stok Menipis",
      value: stats.stokMenipis,
      icon: AlertTriangle,
      color: "text-red-600 bg-red-50",
      description: "Stok kurang dari 10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn("p-2.5 rounded-xl", item.color)}>
              <item.icon className="size-5" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{item.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {item.value}
            </h3>
            <p className="text-xs text-gray-400 mt-1">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
