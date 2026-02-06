"use client";

import ProductTable from "@/components/admin/ProductTable";
import { useState } from "react";

export default function AdminProdukPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kelola Produk</h1>
        <p className="text-gray-600 mt-2">Tambah, edit, atau hapus produk</p>
      </div>

      <ProductTable refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
    </div>
  );
}