# 🎨 Panduan Development UI/UX - Toko Baju

Dokumen ini berisi panduan lengkap untuk membangun UI/UX website toko baju.
Struktur dasar dan backend sudah disiapkan, fokus Anda adalah **membangun tampilan**.

---

## 📋 Daftar Isi

1. [Overview Project](#overview-project)
2. [Tech Stack](#tech-stack)
3. [Struktur Folder](#struktur-folder)
4. [Design System](#design-system)
5. [Data Models](#data-models)
6. [Cara Fetch Data](#cara-fetch-data)
7. [Panduan Per Halaman](#panduan-per-halaman)
8. [Components yang Perlu Dibuat](#components-yang-perlu-dibuat)
9. [State Management (Zustand)](#state-management-zustand)
10. [Aturan Penting](#aturan-penting)

---

## Overview Project

**Nama**: Website Toko Baju Sablon  
**Jenis**: E-commerce katalog dengan checkout via WhatsApp  
**Target**: UMKM baju sablon  
**Theme**: Biru dominan, modern, clean

### Fitur Utama:

- Landing page dengan hero, produk unggulan, testimoni
- Katalog produk dengan filter & search
- Detail produk dengan varian (ukuran, warna)
- Keranjang belanja (localStorage + Zustand)
- Checkout form → redirect WhatsApp
- Admin dashboard (CRUD produk, kategori, settings)

---

## Tech Stack

| Layer      | Teknologi               | Status          |
| ---------- | ----------------------- | --------------- |
| Framework  | Next.js 15 (App Router) | ✅ Installed    |
| Language   | TypeScript              | ✅ Ready        |
| Styling    | Tailwind CSS            | ✅ Installed    |
| UI Library | shadcn/ui               | ✅ Installed    |
| State      | Zustand                 | ✅ Installed    |
| Backend    | Supabase                | ✅ Connected    |
| Database   | PostgreSQL (Supabase)   | ✅ Schema ready |

---

## Struktur Folder

```
toko-baju/
├── app/
│   ├── page.tsx                      # Landing Page (HOME)
│   ├── layout.tsx                    # Root Layout
│   ├── globals.css                   # Global Styles
│   │
│   ├── (public)/                     # Route Group - Public
│   │   ├── katalog/
│   │   │   ├── page.tsx              # Katalog Produk
│   │   │   └── [slug]/page.tsx       # Detail Produk
│   │   ├── keranjang/page.tsx        # Keranjang
│   │   ├── checkout/page.tsx         # Checkout Form
│   │   ├── tentang/page.tsx          # Tentang Kami
│   │   └── kontak/page.tsx           # Kontak
│   │
│   ├── (admin)/                      # Route Group - Admin
│   │   └── admin/
│   │       ├── page.tsx              # Dashboard
│   │       ├── login/page.tsx        # Login
│   │       ├── produk/
│   │       │   ├── page.tsx          # List Produk
│   │       │   ├── tambah/page.tsx   # Tambah Produk
│   │       │   └── [id]/edit/page.tsx # Edit Produk
│   │       ├── kategori/page.tsx     # Kelola Kategori
│   │       └── pengaturan/page.tsx   # Settings
│   │
│   ├── api/                          # API Routes
│   │   ├── produk/route.ts
│   │   ├── kategori/route.ts
│   │   └── settings/route.ts
│   │
│   └── test/page.tsx                 # Test page (bisa dihapus nanti)
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── layout/
│   │   ├── Header.tsx                # Navbar public
│   │   ├── Footer.tsx                # Footer public
│   │   └── AdminSidebar.tsx          # Sidebar admin
│   ├── home/
│   │   ├── Hero.tsx                  # Hero section
│   │   ├── FeaturedProducts.tsx      # Produk unggulan
│   │   └── Testimonials.tsx          # Testimoni
│   ├── katalog/
│   │   ├── ProductCard.tsx           # Card produk
│   │   └── FilterSidebar.tsx         # Filter sidebar
│   ├── cart/
│   │   ├── CartItem.tsx              # Item di keranjang
│   │   └── CartSummary.tsx           # Ringkasan keranjang
│   └── admin/
│       ├── ProductForm.tsx           # Form tambah/edit produk
│       └── CategoryForm.tsx          # Form kategori
│
├── lib/
│   ├── supabase.ts                   # Supabase client (browser)
│   ├── supabase-server.ts            # Supabase client (server)
│   └── utils.ts                      # Utility functions
│
├── store/
│   └── cartStore.ts                  # Zustand cart store
│
├── types/
│   └── index.ts                      # TypeScript interfaces
│
├── hooks/
│   ├── useCart.ts
│   └── useProducts.ts
│
└── middleware.ts                     # Auth middleware (admin protection)
```

---

## Design System

### Warna Utama (Biru Theme)

```css
/* Primary Colors - Gunakan ini */
--primary: blue-600 (#2563eb) --primary-hover: blue-700 (#1d4ed8)
  --primary-light: blue-50 (#eff6ff) /* Neutral */ --background: white
  --foreground: gray-900 --muted: gray-100 --muted-foreground: gray-500
  --border: gray-200 /* Status */ --success: green-600 --warning: yellow-600
  --error: red-600;
```

### Tailwind Classes yang Direkomendasikan

```tsx
// Primary Button
className = "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg";

// Secondary Button
className =
  "border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg";

// Card
className = "bg-white border border-gray-200 rounded-xl shadow-sm p-4";

// Input
className =
  "border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
```

### Typography

```tsx
// Heading 1
className = "text-4xl font-bold text-gray-900";

// Heading 2
className = "text-2xl font-semibold text-gray-900";

// Body
className = "text-base text-gray-700";

// Caption
className = "text-sm text-gray-500";

// Price
className = "text-xl font-bold text-blue-600";
```

---

## Data Models

### Product

```typescript
interface Product {
  id: string;
  slug: string;
  nama: string;
  harga: number;
  deskripsi: string;
  kategori_id: string;
  gambar: string[]; // Array of image URLs
  varian_ukuran: string[]; // ["S", "M", "L", "XL"]
  varian_warna: string[]; // ["Hitam", "Putih", "Navy"]
  stok: number;
  aktif: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  // Join
  categories?: { nama: string };
}
```

### Category

```typescript
interface Category {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string;
  urutan: number;
  aktif: boolean;
}
```

### CartItem (untuk Zustand)

```typescript
interface CartItem {
  product_id: string;
  nama: string;
  harga: number;
  gambar: string;
  ukuran: string;
  warna: string;
  qty: number;
}
```

### Settings

```typescript
// Key: "whatsapp_number"
{ number: "6281234567890", display: "0812-3456-7890" }

// Key: "store_info"
{ name: "...", address: "...", phone: "...", email: "...", hours: "..." }

// Key: "social_media"
{ instagram: "...", facebook: "...", tiktok: "..." }
```

---

## Cara Fetch Data

### Server Component (Recommended untuk SEO)

```tsx
// Gunakan ini untuk halaman yang perlu SEO (katalog, detail produk)
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function Page() {
  const supabase = await createServerSupabaseClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(nama)")
    .eq("aktif", true)
    .order("created_at", { ascending: false });

  return <div>{/* render products */}</div>;
}
```

### Client Component (untuk interaktif)

```tsx
"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Component() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("products").select("*");
      setData(data || []);
    }
    fetchData();
  }, []);

  return <div>{/* render data */}</div>;
}
```

### Query Recipes

```typescript
// Produk featured
.from("products").select("*").eq("featured", true).eq("aktif", true)

// Produk by kategori
.from("products").select("*").eq("kategori_id", kategoriId).eq("aktif", true)

// Produk by slug (detail)
.from("products").select("*, categories(nama)").eq("slug", slug).single()

// Search produk
.from("products").select("*").ilike("nama", `%${query}%`)

// Kategori aktif
.from("categories").select("*").eq("aktif", true).order("urutan")

// Settings by key
.from("settings").select("value").eq("key", "whatsapp_number").single()
```

---

## Panduan Per Halaman

### 1. Landing Page (`app/page.tsx`)

**Sections:**

1. **Hero** - Judul besar, tagline, CTA "Lihat Katalog"
2. **Featured Products** - Grid 4-6 produk unggulan
3. **Kategori** - Grid kategori dengan icon/gambar
4. **Testimoni** - Slider/grid testimoni (bisa hardcode dulu)
5. **CTA Section** - Ajakan belanja + link WhatsApp

**Data needed:**

- Products where `featured = true`
- Categories (semua aktif)
- Settings for store info

---

### 2. Katalog (`app/(public)/katalog/page.tsx`)

**Layout:**

- Sidebar filter (kiri) + Grid produk (kanan)
- Mobile: Filter jadi dropdown/sheet

**Features:**

- Filter by kategori
- Filter by range harga
- Search by nama
- Sorting (terbaru, harga rendah-tinggi)
- Pagination atau infinite scroll

**Components:**

- `FilterSidebar` - Filter controls
- `ProductCard` - Card untuk tiap produk

---

### 3. Detail Produk (`app/(public)/katalog/[slug]/page.tsx`)

**Sections:**

1. Gallery gambar (carousel/grid)
2. Info produk (nama, harga, deskripsi)
3. Pilih varian (dropdown ukuran & warna)
4. Quantity selector
5. Tombol "Tambah ke Keranjang"
6. Produk terkait (opsional)

**Params:** `slug` dari URL

---

### 4. Keranjang (`app/(public)/keranjang/page.tsx`)

**Features:**

- List item dari Zustand store
- Update quantity
- Hapus item
- Total harga
- Tombol "Lanjut Checkout"

**State:** Ambil dari `useCartStore()`

---

### 5. Checkout (`app/(public)/checkout/page.tsx`)

**Form fields:**

- Nama lengkap
- No. HP
- Alamat lengkap
- Catatan (opsional)

**On Submit:**

1. Generate pesan WhatsApp dengan detail pesanan
2. Redirect ke `https://wa.me/{nomor}?text={pesan}`

---

### 6. Admin Pages

**Login** - Form email + password (Supabase Auth)  
**Dashboard** - Overview (total produk, kategori)  
**Produk** - Tabel CRUD  
**Kategori** - Tabel CRUD  
**Pengaturan** - Form edit nomor WA, info toko

---

## Components yang Perlu Dibuat

### Layout Components

| Component    | File                                 | Deskripsi                           |
| ------------ | ------------------------------------ | ----------------------------------- |
| Header       | `components/layout/Header.tsx`       | Navbar dengan logo, menu, cart icon |
| Footer       | `components/layout/Footer.tsx`       | Info toko, sosmed, copyright        |
| AdminSidebar | `components/layout/AdminSidebar.tsx` | Sidebar navigasi admin              |

### Home Components

| Component        | File                                   | Deskripsi               |
| ---------------- | -------------------------------------- | ----------------------- |
| Hero             | `components/home/Hero.tsx`             | Hero section dengan CTA |
| FeaturedProducts | `components/home/FeaturedProducts.tsx` | Grid produk featured    |
| Testimonials     | `components/home/Testimonials.tsx`     | Testimoni pelanggan     |

### Katalog Components

| Component     | File                                   | Deskripsi              |
| ------------- | -------------------------------------- | ---------------------- |
| ProductCard   | `components/katalog/ProductCard.tsx`   | Card produk untuk grid |
| FilterSidebar | `components/katalog/FilterSidebar.tsx` | Sidebar filter         |

### Cart Components

| Component   | File                              | Deskripsi                 |
| ----------- | --------------------------------- | ------------------------- |
| CartItem    | `components/cart/CartItem.tsx`    | Item tunggal di keranjang |
| CartSummary | `components/cart/CartSummary.tsx` | Ringkasan total           |

---

## State Management (Zustand)

### Cart Store Template

Buat di `store/cartStore.ts`:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  product_id: string;
  nama: string;
  harga: number;
  gambar: string;
  ukuran: string;
  warna: string;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, ukuran: string, warna: string) => void;
  updateQty: (
    product_id: string,
    ukuran: string,
    warna: string,
    qty: number,
  ) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.product_id === item.product_id &&
              i.ukuran === item.ukuran &&
              i.warna === item.warna,
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id &&
                i.ukuran === item.ukuran &&
                i.warna === item.warna
                  ? { ...i, qty: i.qty + item.qty }
                  : i,
              ),
            };
          }

          return { items: [...state.items, item] };
        }),

      removeItem: (product_id, ukuran, warna) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.product_id === product_id &&
                i.ukuran === ukuran &&
                i.warna === warna
              ),
          ),
        })),

      updateQty: (product_id, ukuran, warna, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === product_id &&
            i.ukuran === ukuran &&
            i.warna === warna
              ? { ...i, qty }
              : i,
          ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.qty, 0),

      totalPrice: () =>
        get().items.reduce((acc, i) => acc + i.harga * i.qty, 0),
    }),
    {
      name: "cart-storage", // localStorage key
    },
  ),
);
```

### Cara Pakai di Component

```tsx
"use client";
import { useCartStore } from "@/store/cartStore";

function Component() {
  const { items, addItem, removeItem, totalItems, totalPrice } = useCartStore();

  // ...
}
```

---

## Aturan Penting

### ✅ DO (Lakukan)

1. **Gunakan struktur folder yang sudah ada** - Jangan buat folder baru kecuali perlu
2. **Pakai shadcn/ui components** - Button, Input, Card, dll dari `@/components/ui`
3. **Ikuti color scheme biru** - Primary: blue-600
4. **Server Component untuk SEO** - Katalog, detail produk
5. **Client Component untuk interaktif** - Cart, forms
6. **Responsive design** - Mobile-first approach
7. **Gunakan TypeScript** - Definisikan types dengan benar

### ❌ DON'T (Jangan)

1. **Jangan edit file lib/supabase\*.ts** - Sudah dikonfigurasi
2. **Jangan edit middleware.ts** - Auth sudah di-setup
3. **Jangan edit file .env.local** - Kredensial sensitif
4. **Jangan hapus folder/file struktur** - Sudah direncanakan
5. **Jangan install package tanpa konfirmasi** - Tanyakan dulu

### 📝 Catatan untuk AI Developer

- Gambar produk menggunakan placeholder dari `picsum.photos`
- Data sudah ada di database Supabase (bisa di-fetch langsung)
- Nomor WhatsApp diambil dari tabel `settings` key `whatsapp_number`
- Admin routes sudah dilindungi middleware (harus login)

---

## 🚀 Urutan Development yang Disarankan

1. **Layout dulu** - Header & Footer
2. **Landing Page** - Hero, Featured Products
3. **Katalog** - ProductCard, Filter
4. **Detail Produk**
5. **Cart Store** - Setup Zustand
6. **Keranjang & Checkout**
7. **Admin Pages** (terakhir)

---

## 🆘 Jika Ada Masalah

- **Error fetch data?** → Cek RLS policy di Supabase
- **Styling tidak muncul?** → Pastikan import `globals.css` di layout
- **Cart tidak persist?** → Zustand persist perlu client component
- **Admin redirect loop?** → Cek middleware.ts

Selamat coding! 🎨
