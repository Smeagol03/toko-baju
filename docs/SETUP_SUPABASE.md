# 🚀 Panduan Setup Supabase untuk Toko Baju

Panduan step-by-step untuk setup Supabase sebagai backend aplikasi toko baju.

---

## 📋 Daftar Isi

1. [Buat Akun & Project Supabase](#step-1-buat-akun--project-supabase)
2. [Buat Database Schema](#step-2-buat-database-schema)
3. [Setup Authentication](#step-3-setup-authentication)
4. [Install Supabase Client](#step-4-install-supabase-client)
5. [Konfigurasi Environment Variables](#step-5-konfigurasi-environment-variables)
6. [Setup Supabase Client di Next.js](#step-6-setup-supabase-client-di-nextjs)
7. [Insert Data Placeholder](#step-7-insert-data-placeholder)
8. [Test Koneksi](#step-8-test-koneksi)

---

## Step 1: Buat Akun & Project Supabase

### 1.1 Daftar/Login ke Supabase

1. Buka [https://supabase.com](https://supabase.com)
2. Klik **"Start your project"** atau **"Sign In"**
3. Login dengan GitHub (recommended) atau email

### 1.2 Buat Project Baru

1. Klik **"New Project"**
2. Isi detail project:
   - **Name**: `toko-baju` (atau nama lain)
   - **Database Password**: Buat password yang kuat, **SIMPAN PASSWORD INI!**
   - **Region**: Pilih yang terdekat (Southeast Asia - Singapore)
3. Klik **"Create new project"**
4. Tunggu 1-2 menit sampai project selesai dibuat

### 1.3 Catat Kredensial

Setelah project selesai, pergi ke **Settings > API** dan catat:

| Key                  | Lokasi                                   |
| -------------------- | ---------------------------------------- |
| **Project URL**      | `https://xxxxx.supabase.co`              |
| **anon public key**  | Key yang panjang (aman untuk frontend)   |
| **service_role key** | Key rahasia (JANGAN expose ke frontend!) |

> [!CAUTION]
> **service_role key** memiliki akses penuh ke database. Jangan pernah expose ke client-side code!

---

## Step 2: Buat Database Schema

### 2.1 Buka SQL Editor

1. Di sidebar Supabase, klik **"SQL Editor"**
2. Klik **"New query"**

### 2.2 Jalankan SQL Schema

Copy dan paste SQL berikut, lalu klik **"Run"**:

```sql
-- =============================================
-- TOKO BAJU DATABASE SCHEMA
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: categories (Kategori Produk)
-- =============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  deskripsi TEXT,
  urutan INTEGER DEFAULT 0,
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: products (Produk)
-- =============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  harga INTEGER NOT NULL DEFAULT 0,
  deskripsi TEXT,
  kategori_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  gambar TEXT[] DEFAULT '{}',
  varian_ukuran TEXT[] DEFAULT '{S,M,L,XL}',
  varian_warna TEXT[] DEFAULT '{Hitam,Putih}',
  stok INTEGER DEFAULT 0,
  aktif BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: settings (Pengaturan Toko)
-- =============================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: orders_log (Log Pesanan - Phase 2)
-- =============================================
CREATE TABLE orders_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL DEFAULT 0,
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES (untuk performa query)
-- =============================================
CREATE INDEX idx_products_kategori ON products(kategori_id);
CREATE INDEX idx_products_aktif ON products(aktif);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_settings_key ON settings(key);

-- =============================================
-- FUNCTION: Auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS: Auto-update updated_at
-- =============================================
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2.3 Verifikasi Tabel

1. Pergi ke **"Table Editor"** di sidebar
2. Pastikan ada 4 tabel: `categories`, `products`, `settings`, `orders_log`

---

## Step 3: Setup Authentication

### 3.1 Buat Admin User

1. Pergi ke **"Authentication"** di sidebar
2. Klik tab **"Users"**
3. Klik **"Add user"** > **"Create new user"**
4. Isi:
   - **Email**: email admin (misal: `admin@tokobaju.com`)
   - **Password**: password yang kuat
   - ✅ **Auto Confirm User** (centang)
5. Klik **"Create user"**

### 3.2 Setup Row Level Security (RLS)

Jalankan SQL berikut di SQL Editor:

```sql
-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders_log ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLICIES: Categories
-- =============================================
-- Public: bisa baca kategori aktif
CREATE POLICY "Public can read active categories"
  ON categories FOR SELECT
  USING (aktif = true);

-- Authenticated: bisa semua operasi
CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- POLICIES: Products
-- =============================================
-- Public: bisa baca produk aktif
CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (aktif = true);

-- Authenticated: bisa semua operasi
CREATE POLICY "Authenticated users can manage products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- POLICIES: Settings
-- =============================================
-- Public: bisa baca settings tertentu
CREATE POLICY "Public can read public settings"
  ON settings FOR SELECT
  USING (key IN ('whatsapp_number', 'store_info', 'social_media'));

-- Authenticated: bisa semua operasi
CREATE POLICY "Authenticated users can manage settings"
  ON settings FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- POLICIES: Orders Log
-- =============================================
-- Public: bisa insert (untuk log checkout)
CREATE POLICY "Public can insert orders"
  ON orders_log FOR INSERT
  WITH CHECK (true);

-- Authenticated: bisa baca semua
CREATE POLICY "Authenticated users can read orders"
  ON orders_log FOR SELECT
  USING (auth.role() = 'authenticated');
```

---

## Step 4: Install Supabase Client

Buka terminal di project dan jalankan:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## Step 5: Konfigurasi Environment Variables

### 5.1 Buat file `.env.local`

Buat file `.env.local` di root project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Server-side only (jangan expose ke browser)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 5.2 Isi dengan kredensial Anda

Ganti nilai di atas dengan kredensial dari **Settings > API** di Supabase dashboard.

> [!IMPORTANT]
> Pastikan `.env.local` sudah ada di `.gitignore` agar tidak ter-push ke Git!

---

## Step 6: Setup Supabase Client di Next.js

Setelah Anda selesai Step 5, beritahu saya dan saya akan membantu setup file:

1. `lib/supabase.ts` - Client untuk browser
2. `lib/supabase-server.ts` - Client untuk server components
3. Middleware untuk auth (optional)

---

## Step 7: Insert Data Placeholder

Setelah setup selesai, jalankan SQL ini untuk data contoh:

```sql
-- =============================================
-- INSERT PLACEHOLDER DATA
-- =============================================

-- Insert Categories
INSERT INTO categories (nama, slug, deskripsi, urutan) VALUES
  ('Kaos Polos', 'kaos-polos', 'Kaos polos berbagai warna', 1),
  ('Kaos Sablon', 'kaos-sablon', 'Kaos dengan sablon custom', 2),
  ('Polo Shirt', 'polo-shirt', 'Polo shirt untuk formal dan casual', 3),
  ('Hoodie', 'hoodie', 'Hoodie nyaman untuk sehari-hari', 4),
  ('Jaket', 'jaket', 'Jaket berbagai model', 5),
  ('Kemeja', 'kemeja', 'Kemeja formal dan casual', 6);

-- Insert Settings
INSERT INTO settings (key, value) VALUES
  ('whatsapp_number', '{"number": "6281234567890", "display": "0812-3456-7890"}'),
  ('store_info', '{
    "name": "Toko Baju Sablon",
    "address": "Jl. Contoh No. 123, Kota, Provinsi",
    "phone": "0812-3456-7890",
    "email": "info@tokobajusablon.com",
    "hours": "Senin - Sabtu: 09:00 - 17:00"
  }'),
  ('social_media', '{
    "instagram": "@tokobajusablon",
    "facebook": "tokobajusablon",
    "tiktok": "@tokobajusablon"
  }');

-- Insert Sample Products
INSERT INTO products (nama, slug, harga, deskripsi, kategori_id, gambar, varian_ukuran, varian_warna, stok, featured)
SELECT
  'Kaos Polos Premium',
  'kaos-polos-premium',
  85000,
  'Kaos polos premium dengan bahan cotton combed 30s yang nyaman dan adem. Cocok untuk sehari-hari atau sebagai base sablon.',
  id,
  ARRAY['https://picsum.photos/seed/kaos1/600/600', 'https://picsum.photos/seed/kaos1b/600/600'],
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Hitam', 'Putih', 'Navy', 'Maroon', 'Abu-abu'],
  100,
  true
FROM categories WHERE slug = 'kaos-polos';

INSERT INTO products (nama, slug, harga, deskripsi, kategori_id, gambar, varian_ukuran, varian_warna, stok, featured)
SELECT
  'Kaos Sablon DTF Custom',
  'kaos-sablon-dtf-custom',
  120000,
  'Kaos dengan sablon DTF berkualitas tinggi. Warna cerah dan tahan lama hingga 50x cuci.',
  id,
  ARRAY['https://picsum.photos/seed/sablon1/600/600', 'https://picsum.photos/seed/sablon1b/600/600'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Hitam', 'Putih', 'Navy'],
  50,
  true
FROM categories WHERE slug = 'kaos-sablon';

INSERT INTO products (nama, slug, harga, deskripsi, kategori_id, gambar, varian_ukuran, varian_warna, stok, featured)
SELECT
  'Polo Shirt Executive',
  'polo-shirt-executive',
  150000,
  'Polo shirt dengan bahan lacoste premium. Cocok untuk acara formal maupun casual.',
  id,
  ARRAY['https://picsum.photos/seed/polo1/600/600', 'https://picsum.photos/seed/polo1b/600/600'],
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Hitam', 'Putih', 'Navy', 'Merah'],
  75,
  true
FROM categories WHERE slug = 'polo-shirt';

INSERT INTO products (nama, slug, harga, deskripsi, kategori_id, gambar, varian_ukuran, varian_warna, stok)
SELECT
  'Hoodie Fleece Basic',
  'hoodie-fleece-basic',
  175000,
  'Hoodie dengan bahan fleece tebal dan hangat. Dilengkapi kantong depan dan tali hoodie.',
  id,
  ARRAY['https://picsum.photos/seed/hoodie1/600/600', 'https://picsum.photos/seed/hoodie1b/600/600'],
  ARRAY['M', 'L', 'XL', 'XXL'],
  ARRAY['Hitam', 'Abu-abu', 'Navy', 'Maroon'],
  60
FROM categories WHERE slug = 'hoodie';

INSERT INTO products (nama, slug, harga, deskripsi, kategori_id, gambar, varian_ukuran, varian_warna, stok)
SELECT
  'Jaket Bomber Premium',
  'jaket-bomber-premium',
  250000,
  'Jaket bomber dengan bahan taslan waterproof. Dalaman fleece hangat dan nyaman.',
  id,
  ARRAY['https://picsum.photos/seed/jaket1/600/600', 'https://picsum.photos/seed/jaket1b/600/600'],
  ARRAY['M', 'L', 'XL', 'XXL'],
  ARRAY['Hitam', 'Navy', 'Olive'],
  40
FROM categories WHERE slug = 'jaket';

INSERT INTO products (nama, slug, harga, deskripsi, kategori_id, gambar, varian_ukuran, varian_warna, stok)
SELECT
  'Kemeja Flannel',
  'kemeja-flannel',
  135000,
  'Kemeja flannel dengan motif kotak-kotak klasik. Bahan tebal dan nyaman.',
  id,
  ARRAY['https://picsum.photos/seed/kemeja1/600/600', 'https://picsum.photos/seed/kemeja1b/600/600'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Merah-Hitam', 'Biru-Hitam', 'Hijau-Hitam'],
  55
FROM categories WHERE slug = 'kemeja';
```

---

## Step 8: Test Koneksi

Setelah semua selesai, kita akan test dengan membuat halaman sederhana untuk mengambil data dari Supabase.

---

## ✅ Checklist Progress

- [ ] Step 1: Buat akun & project Supabase
- [ ] Step 2: Buat database schema (jalankan SQL)
- [ ] Step 3: Setup authentication & RLS
- [ ] Step 4: Install Supabase client (`npm install`)
- [ ] Step 5: Buat `.env.local` dengan kredensial
- [ ] Step 6: Setup Supabase client files
- [ ] Step 7: Insert data placeholder
- [ ] Step 8: Test koneksi

---

## 🆘 Butuh Bantuan?

Jika ada langkah yang bingung, beritahu saya step berapa dan error apa yang muncul. Saya akan bantu troubleshoot!
