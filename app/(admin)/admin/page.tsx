import DashboardStats from "@/components/admin/DashboardStats";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">Ringkasan data toko Anda</p>
      </div>

      <DashboardStats />

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/produk/tambah">
            <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4" />
              <span>Tambah Produk</span>
            </Button>
          </Link>
          <Link href="/admin/kategori">
            <Button variant="outline" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Tambah Kategori</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}