"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminTambahProdukPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tambah Produk Baru
          </h1>
          <p className="text-gray-500">Isi detail produk di bawah ini.</p>
        </div>
      </div>

      <ProductForm
        mode="create"
        onSuccess={() => {
          router.push("/admin/produk");
          router.refresh();
        }}
      />
    </div>
  );
}
