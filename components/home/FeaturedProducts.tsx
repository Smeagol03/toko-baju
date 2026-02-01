import { createServerSupabaseClient } from "@/lib/supabase-server";
import ProductCard from "@/components/katalog/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function FeaturedProducts() {
  const supabase = await createServerSupabaseClient();

  // Fetch featured products
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(nama)")
    .eq("aktif", true)
    .eq("featured", true)
    .limit(4);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Produk Unggulan
            </h2>
            <p className="mt-2 text-gray-600">
              Pilihan terbaik untuk gaya Anda setiap hari.
            </p>
          </div>
          <Link
            href="/katalog"
            className="hidden sm:flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Lihat Semua
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/katalog"
            className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all"
          >
            Lihat Semua Produk
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
