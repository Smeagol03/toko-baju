// TypeScript interfaces and types
// TODO: Define types

export interface Product {
  id: string;
  slug: string;
  nama: string;
  harga: number;
  deskripsi: string;
  kategori_id: string;
  gambar: string[];
  varian_ukuran: string[];
  varian_warna: string[];
  stok: number;
  aktif: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string;
  urutan: number;
  aktif: boolean;
}

export interface CartItem {
  product_id: string;
  nama: string;
  harga: number;
  gambar: string;
  ukuran: string;
  warna: string;
  qty: number;
}

export interface Settings {
  id: string;
  key: string;
  value: Record<string, unknown>;
}
