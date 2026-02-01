import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function TestPage() {
  const supabase = await createServerSupabaseClient();

  // Test 1: Ambil data kategori
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("urutan");

  // Test 2: Ambil data produk
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("*, categories(nama)")
    .limit(5);

  // Test 3: Ambil settings
  const { data: settings, error: setError } = await supabase
    .from("settings")
    .select("*");

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">
        🧪 Test Koneksi Supabase
      </h1>

      {/* Status Koneksi */}
      <div className="mb-8 p-4 rounded-lg bg-gray-100">
        <h2 className="text-xl font-semibold mb-2">Status Koneksi:</h2>
        <p className="text-lg">
          {!catError && !prodError && !setError ? (
            <span className="text-green-600">
              ✅ Berhasil terhubung ke Supabase!
            </span>
          ) : (
            <span className="text-red-600">❌ Ada masalah koneksi</span>
          )}
        </p>
      </div>

      {/* Test Kategori */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          📁 Kategori ({categories?.length || 0})
        </h2>
        {catError ? (
          <div className="text-red-500 p-4 bg-red-50 rounded">
            <p className="font-bold">Error:</p>
            <pre className="text-sm">{JSON.stringify(catError, null, 2)}</pre>
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <p className="font-medium">{cat.nama}</p>
                <p className="text-sm text-gray-500">{cat.slug}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-yellow-600">
            ⚠️ Belum ada data kategori. Jalankan SQL Step 7!
          </p>
        )}
      </section>

      {/* Test Produk */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          👕 Produk ({products?.length || 0})
        </h2>
        {prodError ? (
          <div className="text-red-500 p-4 bg-red-50 rounded">
            <p className="font-bold">Error:</p>
            <pre className="text-sm">{JSON.stringify(prodError, null, 2)}</pre>
          </div>
        ) : products && products.length > 0 ? (
          <div className="space-y-3">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-lg">{prod.nama}</p>
                    <p className="text-sm text-gray-500">
                      Kategori: {prod.categories?.nama || "Tidak ada"}
                    </p>
                  </div>
                  <p className="text-blue-600 font-bold">
                    Rp {prod.harga?.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {prod.varian_warna?.map((warna: string) => (
                    <span
                      key={warna}
                      className="text-xs px-2 py-1 bg-gray-100 rounded"
                    >
                      {warna}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-yellow-600">
            ⚠️ Belum ada data produk. Jalankan SQL Step 7!
          </p>
        )}
      </section>

      {/* Test Settings */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          ⚙️ Settings ({settings?.length || 0})
        </h2>
        {setError ? (
          <div className="text-red-500 p-4 bg-red-50 rounded">
            <p className="font-bold">Error:</p>
            <pre className="text-sm">{JSON.stringify(setError, null, 2)}</pre>
          </div>
        ) : settings && settings.length > 0 ? (
          <div className="space-y-2">
            {settings.map((s) => (
              <div key={s.id} className="p-3 bg-gray-50 rounded border">
                <p className="font-medium text-blue-600">{s.key}</p>
                <pre className="text-xs mt-1 text-gray-600 overflow-x-auto">
                  {JSON.stringify(s.value, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-yellow-600">
            ⚠️ Belum ada data settings. Jalankan SQL Step 7!
          </p>
        )}
      </section>

      {/* Link Kembali */}
      <div className="mt-8 pt-4 border-t">
        <a href="/" className="text-blue-600 hover:underline">
          ← Kembali ke Home
        </a>
      </div>
    </div>
  );
}
