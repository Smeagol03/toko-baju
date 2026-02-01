"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";

export default function AdminEditProdukPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        router.push("/admin/produk");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-blue-600 mb-2" />
        <p className="text-gray-500 text-sm">Memuat data produk...</p>
      </div>
    );
  }

  if (!product) return null;

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Produk</h1>
          <p className="text-gray-500">
            Edit informasi untuk produk: {product.nama}
          </p>
        </div>
      </div>

      <ProductForm
        mode="edit"
        productId={id}
        initialData={product}
        onSuccess={() => {
          router.push("/admin/produk");
          router.refresh();
        }}
      />
    </div>
  );
}
