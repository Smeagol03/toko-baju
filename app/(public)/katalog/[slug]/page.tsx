import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ShoppingCart, Check, Info } from "lucide-react";

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
          <div className="mb-10 lg:mb-0">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border shadow-sm">
              <img
                src={
                  product.gambar?.[0] ||
                  "https://picsum.photos/seed/detail/800/800"
                }
                alt={product.nama}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Small Thumbnails (if any) */}
            {product.gambar && product.gambar.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {product.gambar.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-lg overflow-hidden border bg-gray-50 cursor-pointer hover:opacity-75 transition-opacity"
                  >
                    <img
                      src={img}
                      alt={`${product.nama} thumbnail ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

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

            <div className="py-6 space-y-6">
              {/* Varian Ukuran */}
              {product.varian_ukuran && product.varian_ukuran.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                    Pilih Ukuran
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.varian_ukuran.map((ukuran: string) => (
                      <button
                        key={ukuran}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:border-blue-600 hover:text-blue-600 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {ukuran}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Varian Warna */}
              {product.varian_warna && product.varian_warna.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                    Pilih Warna
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.varian_warna.map((warna: string) => (
                      <button
                        key={warna}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:border-blue-600 hover:text-blue-600 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {warna}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stok Info */}
              <div className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Stok tersedia:{" "}
                <span className="font-bold ml-1">{product.stok} pcs</span>
              </div>

              {/* Add to Cart Button */}
              <div className="pt-4">
                <button className="w-full flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  Tambah ke Keranjang
                </button>
              </div>

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
    </div>
  );
}
