import { createServerSupabaseClient } from "@/lib/supabase-server";
import ProductCard from "@/components/katalog/ProductCard";
import FilterWrapper from "@/components/katalog/KatalogClient";
import Link from "next/link";

interface KatalogPageProps {
  searchParams: Promise<{
    kategori?: string;
    search?: string;
    min?: string;
    max?: string;
  }>;
}

export default async function KatalogPage({ searchParams }: KatalogPageProps) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();

  // 1. Fetch Categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("aktif", true)
    .order("urutan", { ascending: true });

  // 2. Fetch Products with Filters
  let query = supabase
    .from("products")
    .select("*, categories(nama)")
    .eq("aktif", true);

  if (params.kategori) {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.kategori)
      .single();

    if (catData) {
      query = query.eq("kategori_id", catData.id);
    }
  }

  if (params.search) {
    query = query.ilike("nama", `%${params.search}%`);
  }

  if (params.min) {
    query = query.gte("harga", parseInt(params.min));
  }

  if (params.max) {
    query = query.lte("harga", parseInt(params.max));
  }

  const { data: products } = await query.order("created_at", {
    ascending: false,
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-10 mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Katalog Produk
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Temukan koleksi baju sablon terbaik kami. Gunakan filter untuk
            mencari produk yang sesuai dengan keinginan Anda.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Filters - Sidebar (Desktop) */}
          <aside className="hidden lg:block">
            <FilterWrapper categories={categories || []} />
          </aside>

          {/* Product Grid */}
          <div className="mt-6 lg:mt-0 lg:col-span-3">
            {/* Mobile Filter Trigger (Placeholder for logic) */}
            <div className="lg:hidden mb-10 bg-gray-50 p-4 rounded-xl">
              <FilterWrapper categories={categories || []} />
            </div>

            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-lg">
                  Tidak ada produk yang ditemukan.
                </p>
                <Link
                  href="/katalog"
                  className="mt-4 inline-block text-blue-600 font-semibold hover:underline"
                >
                  Hapus semua filter
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
