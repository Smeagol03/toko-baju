import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 py-16 sm:py-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:py-32">
          {/* Text Content */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Tampil Beda dengan <br />
              <span className="text-blue-600">Sablon Berkualitas</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
              Pusat pembuatan baju sablon custom dan ready stock dengan bahan
              premium. Desain modern, hasil awet, dan nyaman dipakai setiap
              hari.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                href="/katalog"
                className="flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
              >
                Lihat Katalog
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/tentang"
                className="flex items-center justify-center px-8 py-4 text-base font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
              >
                Tentang Kami
              </Link>
            </div>

            {/* Features Brief */}
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3">
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-500 font-medium">
                  Cotton Combed
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24 Jam</p>
                <p className="text-sm text-gray-500 font-medium">
                  Pengerjaan Cepat
                </p>
              </div>
              <div className="hidden sm:block">
                <p className="text-2xl font-bold text-gray-900">1000+</p>
                <p className="text-sm text-gray-500 font-medium">
                  Pelanggan Puas
                </p>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="mt-12 lg:mt-0 flex items-center justify-center relative">
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 -left-4 w-72 h-72 fill-blue-300 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 fill-blue-300 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 fill-blue-300 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border">
                <img
                  src="https://picsum.photos/seed/tshirt/800/800"
                  alt="T-shirt Sablon"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl border flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      Terlaris Minggu Ini
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      Custom Sablon Oversize
                    </p>
                  </div>
                  <p className="text-lg font-bold text-blue-600">Rp 125.000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
