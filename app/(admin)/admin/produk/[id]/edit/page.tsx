"use client";

import { useRouter, useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Produk</h1>
          <p className="text-gray-600 mt-2">Ubah informasi produk</p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          Batal
        </Button>
      </div>

      <ProductForm 
        mode="edit" 
        productId={productId} 
        onSubmit={handleSuccess} 
        onCancel={handleCancel} 
      />
    </div>
  );
}