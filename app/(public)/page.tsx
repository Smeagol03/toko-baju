import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import Link from "next/link";
import { ArrowRight, Shirt, Zap, ShoppingBag, Truck } from "lucide-react";

export default async function Home() {
  const supabase = await createServerSupabaseClient();

  // Fetch categories for the category section
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("aktif", true)
    .order("urutan", { ascending: true })
    .limit(4);

  return (
    <div className="flex flex-col gap-0">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Features/Benefits Section (Small Banner) */}
      <section className="bg-blue-600 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
            <div className="flex flex-col items-center gap-2">
              <Shirt className="h-6 w-6" />
              <span className="text-sm font-medium">Bahan Premium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Zap className="h-6 w-6" />
              <span className="text-sm font-medium">Proses Cepat</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="text-sm font-medium">Bisa Satuan</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Truck className="h-6 w-6" />
              <span className="text-sm font-medium">Kirim Seluruh RI</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <FeaturedProducts />

      {/* 4. Categories Section */}
      {categories && categories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Jelajahi Kategori
              </h2>
              <p className="mt-4 text-gray-600">
                Temukan berbagai pilihan produk sesuai kebutuhan Anda.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/katalog?kategori=${category.slug}`}
                  className="group relative h-64 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center p-6 text-center"
                >
                  <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/50 transition-colors z-10" />
                  <img
                    src={`https://picsum.photos/seed/${category.slug}/400/600`}
                    alt={category.nama}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="relative z-20">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {category.nama}
                    </h3>
                    <span className="inline-flex items-center text-xs font-semibold text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30 group-hover:bg-white group-hover:text-blue-900 transition-all">
                      Lihat Katalog
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Testimonials */}
      <Testimonials />

      {/* 6. CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-blue-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                Punya Desain Sendiri? Sablon Sekarang!
              </h2>
              <p className="text-lg text-blue-100 mb-10 leading-relaxed">
                Kami menerima pesanan custom satuan maupun partai besar. Tim
                desainer kami siap membantu mewujudkan ide keren Anda.
              </p>
              <Link
                href="/kontak"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Konsultasi via WhatsApp
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
