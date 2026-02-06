import DashboardStats from "@/components/admin/DashboardStats";
import Link from "next/link";
import { Plus, ShoppingCart, BarChart3, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const quickActions = [
    {
      title: "Tambah Produk Baru",
      icon: Plus,
      href: "/admin/produk/tambah",
      color: "bg-indigo-600 hover:bg-indigo-700",
      description: "Tambah produk ke katalog"
    },
    {
      title: "Kelola Kategori",
      icon: Tag,
      href: "/admin/kategori",
      color: "bg-emerald-600 hover:bg-emerald-700",
      description: "Atur kategori produk"
    },
    // {
    //   title: "Kelola Pesanan",
    //   icon: ShoppingCart,
    //   href: "/admin/pesanan",
    //   color: "bg-blue-600 hover:bg-blue-700",
    //   description: "Lihat pesanan pelanggan"
    // },
    // {
    //   title: "Laporan Penjualan",
    //   icon: BarChart3,
    //   href: "/admin/laporan",
    //   color: "bg-amber-600 hover:bg-amber-700",
    //   description: "Analisis penjualan"
    // }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-1">Kelola toko Anda dengan mudah dan efisien</p>
          
          {/* Stats Overview */}
          <div className="mt-6">
            <DashboardStats />
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Akses Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="group h-full cursor-pointer">
                  <div className={`${action.color} text-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 h-full flex flex-col items-center text-center`}>
                    <div className="mb-3 p-3 bg-slate-800 bg-opacity-20 rounded-lg">
                      <action.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs opacity-90 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Pesanan Terbaru</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">#ORD-{1000 + item}</p>
                      <p className="text-xs text-gray-600">Rp {(Math.floor(Math.random() * 1000000) + 500000).toLocaleString('id-ID')}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Selesai</span>
                  </div>
                ))}
              </div>
              <Link href="/admin/pesanan">
                <Button variant="outline" className="w-full mt-4">
                  Lihat Semua Pesanan
                </Button>
              </Link>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Produk Terlaris</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {['Kaos Polos Premium', 'Celana Jeans Modern', 'Jaket Hoodie Hangat'].map((product, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{product}</p>
                      <p className="text-xs text-gray-600">Terjual: {Math.floor(Math.random() * 50) + 10} pcs</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-gray-900 text-sm">Rp {(Math.floor(Math.random() * 200000) + 100000).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/produk">
                <Button variant="outline" className="w-full mt-4">
                  Lihat Semua Produk
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}