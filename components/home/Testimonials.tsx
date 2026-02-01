import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Freelancer",
    content:
      "Kualitas sablonnya luar biasa! Sudah dicuci berkali-kali tapi desainnya masih tetap tajam dan tidak pecah. Sangat direkomendasikan.",
    avatar: "https://i.pravatar.cc/150?u=budi",
    rating: 5,
  },
  {
    id: 2,
    name: "Siti Aminah",
    role: "Mahasiswa",
    content:
      "Bahannya adem banget (Cotton Combed 30s). Pas banget dipakai buat harian. Pengirimannya juga cepat, packing aman.",
    avatar: "https://i.pravatar.cc/150?u=siti",
    rating: 5,
  },
  {
    id: 3,
    name: "Andi Wijaya",
    role: "Owner Cafe",
    content:
      "Pesan buat seragam karyawan di sini. Hasilnya konsisten dan rapi. Ownernya ramah dan kasih solusi buat desain yang agak rumit.",
    avatar: "https://i.pravatar.cc/150?u=andi",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Apa Kata Mereka?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Kepuasan pelanggan adalah prioritas kami. Berikut adalah testimoni
            jujur dari mereka yang telah memesan di Toko Baju.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative p-8 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl transition-all duration-300 group"
            >
              <Quote className="absolute top-6 right-8 h-8 w-8 text-blue-100 group-hover:text-blue-200 transition-colors" />

              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 italic mb-8 relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
