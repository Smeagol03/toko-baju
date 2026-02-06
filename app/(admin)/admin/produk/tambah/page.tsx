"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";

export default function AddProductPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/produk");
    router.refresh();
  };

  const handleCancel = () => {
    router.push("/admin/produk");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Produk Baru</h1>
          <p className="text-gray-600 mt-2">Isi informasi produk dengan lengkap</p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          Batal
        </Button>
      </div>

      <ProductForm 
        mode="create" 
        onSubmit={handleSuccess} 
        onCancel={handleCancel} 
      />
    </div>
  );
}