"use client";

import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, MessageSquare, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [waNumber, setWaNumber] = useState("");

  const [formData, setFormData] = useState({
    nama: "",
    hp: "",
    alamat: "",
    catatan: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Redirect if cart is empty
    if (items.length === 0) {
      router.push("/keranjang");
    }

    // Fetch WA Number from settings
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "whatsapp_number")
        .single();

      if (data && data.value) {
        // Expected value format: { number: "628...", display: "..." }
        setWaNumber((data.value as any).number || "6281234567890");
      } else {
        setWaNumber("6281234567890"); // Fallback
      }
    };
    fetchSettings();
  }, []);

  if (!isClient || items.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate WA Message
    const orderDetails = items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.nama} (${item.warna}, ${item.ukuran}) x ${item.qty} = ${formatPrice(
            item.harga * item.qty,
          )}`,
      )
      .join("\n");

    const message = `*HALO ADMIN TOKO BAJU*\n
Saya ingin memesan produk berikut:
------------------------------------------
${orderDetails}
------------------------------------------
*Total: ${formatPrice(totalPrice())}*

*Data Pengiriman:*
Nama: ${formData.nama}
No. HP: ${formData.hp}
Alamat: ${formData.alamat}
Catatan: ${formData.catatan || "-"}

Terima kasih.`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;

    // Small delay to feel like a process
    setTimeout(() => {
      clearCart();
      window.open(waUrl, "_blank");
      router.push("/");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/keranjang"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Kembali ke Keranjang
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                Checkout
              </h1>
              <p className="text-gray-600 mb-8">
                Silakan lengkapi data pengiriman Anda.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="nama"
                    className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    required
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>

                <div>
                  <label
                    htmlFor="hp"
                    className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
                  >
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="hp"
                    name="hp"
                    required
                    value={formData.hp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Contoh: 081234567890"
                  />
                </div>

                <div>
                  <label
                    htmlFor="alamat"
                    className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
                  >
                    Alamat Lengkap
                  </label>
                  <textarea
                    id="alamat"
                    name="alamat"
                    required
                    rows={4}
                    value={formData.alamat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Sebutkan jalan, nomor rumah, kecamatan, kota, dan kode pos."
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="catatan"
                    className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
                  >
                    Catatan (Opsional)
                  </label>
                  <input
                    type="text"
                    id="catatan"
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Contoh: Titip di satpam jika tidak ada orang."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                      isSubmitting
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-100"
                    }`}
                  >
                    <MessageSquare className="mr-3 h-6 w-6" />
                    {isSubmitting ? "Memproses..." : "Pesan via WhatsApp"}
                  </button>
                </div>
              </form>
            </div>

            {/* Summary Brief */}
            <div className="lg:mt-24">
              <div className="bg-white rounded-2xl p-8 border shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Detail Pesanan
                </h2>
                <div className="space-y-4 mb-8">
                  {items.map((item) => (
                    <div
                      key={`${item.product_id}-${item.ukuran}-${item.warna}`}
                      className="flex justify-between items-start text-sm"
                    >
                      <div className="flex-1 pr-4">
                        <p className="font-semibold text-gray-800">
                          {item.nama}
                        </p>
                        <p className="text-gray-500">
                          {item.warna} | {item.ukuran} x {item.qty}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">
                        {formatPrice(item.harga * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between text-lg font-extrabold text-blue-600">
                    <p>Total Bayar</p>
                    <p>{formatPrice(totalPrice())}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center text-xs text-gray-500 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <ShieldCheck className="h-5 w-5 text-blue-600 mr-3 shrink-0" />
                    <p>
                      Pembayaran akan dikonfirmasi manual oleh Admin setelah
                      pesan dikirim.
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <Truck className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
                    <p>
                      Kami melayani pengiriman ke seluruh wilayah Indonesia
                      dengan berbagai ekspedisi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
