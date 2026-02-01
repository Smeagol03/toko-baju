import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ShoppingCart, Check, Info } from "lucide-react";
import ProductGallery from "@/components/katalog/ProductGallery";
import ProductActions from "@/components/katalog/ProductActions";

interface DetailProdukPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DetailProdukPage({
  params,
}: DetailProdukPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, categories(nama)")
    .eq("slug", slug)
    .single();

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <Link
            href="/katalog"
            className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Kembali ke Katalog
          </Link>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Image Gallery */}
          <ProductGallery images={product.gambar || []} name={product.nama} />

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="border-b pb-6">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                {product.categories?.nama || "Umum"}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {product.nama}
              </h1>
              <p className="mt-4 text-3xl font-bold text-blue-600">
                {formatPrice(product.harga)}
              </p>
            </div>

            {/* Product Actions (Client Component) */}
            <ProductActions product={product} />

            {/* Product Description */}
            <div className="pt-8 border-t">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                <Info className="mr-2 h-4 w-4 text-blue-600" />
                Deskripsi Produk
              </h3>
              <div className="prose prose-sm text-gray-600 max-w-none">
                {product.deskripsi
                  .split("\n")
                  .map((line: string, i: number) => (
                    <p key={i} className="mb-2">
                      {line}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
