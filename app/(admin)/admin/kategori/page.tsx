"use client";

import CategoryTable from "@/components/admin/CategoryTable";
import { useState } from "react";

export default function AdminKategoriPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kelola Kategori</h1>
        <p className="text-gray-600 mt-2">Tambah, edit, atau hapus kategori produk</p>
      </div>

      <CategoryTable refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
    </div>
  );
}