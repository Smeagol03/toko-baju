# 📋 Phase 5: Admin Dashboard - Perencanaan Detail

Dokumen ini berisi panduan lengkap untuk membangun Admin Dashboard.
Dibuat agar **model AI lain** dapat mengikuti tanpa keluar dari perencanaan.

---

## 📌 Overview

| Item         | Detail                                                                          |
| ------------ | ------------------------------------------------------------------------------- |
| **Tujuan**   | Membangun dashboard admin untuk mengelola produk, kategori, dan pengaturan toko |
| **Proteksi** | Sudah ada middleware autentikasi di `middleware.ts`                             |
| **Auth**     | Supabase Auth (single admin)                                                    |
| **Theme**    | Blue theme, konsisten dengan halaman public                                     |

---

## 🗂️ Struktur File yang Akan Dikerjakan

```text
app/(admin)/admin/
├── layout.tsx              [BUAT BARU] Admin layout dengan sidebar
├── login/page.tsx          [EDIT] Halaman login
├── page.tsx                [EDIT] Dashboard overview
├── produk/
│   ├── page.tsx            [EDIT] List produk + tabel CRUD
│   ├── tambah/page.tsx     [EDIT] Form tambah produk
│   └── [id]/edit/page.tsx  [EDIT] Form edit produk
├── kategori/page.tsx       [EDIT] List kategori + inline CRUD
└── pengaturan/page.tsx     [EDIT] Form pengaturan toko

components/admin/
├── AdminSidebar.tsx        [BUAT BARU] Sidebar navigasi
├── ProductForm.tsx         [EDIT] Form produk (reusable tambah/edit)
├── CategoryForm.tsx        [EDIT] Form kategori
├── ProductTable.tsx        [BUAT BARU] Tabel produk
├── CategoryTable.tsx       [BUAT BARU] Tabel kategori
├── DashboardStats.tsx      [BUAT BARU] Widget statistik
└── ImageUploader.tsx       [BUAT BARU] Komponen upload gambar
```

---

## 🎯 Urutan Pengerjaan (WAJIB IKUTI)

### Phase 5.1: Foundation (Login + Layout)

### Phase 5.2: Dashboard Overview

### Phase 5.3: CRUD Kategori

### Phase 5.4: CRUD Produk

### Phase 5.5: Pengaturan Toko

---

## 📁 Phase 5.1: Foundation (Login + Layout)

### 5.1.1 Halaman Login (`/admin/login`)

**File**: `app/(admin)/admin/login/page.tsx`

**Fitur yang harus ada**:

- Form email + password
- Validasi client-side
- Integrasi Supabase Auth `signInWithPassword`
- Error handling (kredensial salah)
- Loading state saat submit
- Redirect ke `/admin` setelah login sukses

**Kode Supabase Auth**:

```typescript
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase.auth.signInWithPassword({
  email: formData.email,
  password: formData.password,
});

if (error) {
  // Tampilkan error
}

// Redirect ke /admin
```

**Design Requirements**:

- Centered card login
- Background subtle (gray-50 atau pattern)
- Logo toko di atas form
- Input dengan icon (mail, lock)
- Button primary (blue-600)

---

### 5.1.2 Admin Layout (`/admin/layout.tsx`)

**File**: `app/(admin)/admin/layout.tsx`

**Struktur**:

```tsx
<div className="flex min-h-screen">
  <AdminSidebar />
  <main className="flex-1 bg-gray-50 p-6">{children}</main>
</div>
```

**Catatan**: Layout ini HANYA untuk halaman admin, bukan login.

---

### 5.1.3 Admin Sidebar (`components/admin/AdminSidebar.tsx`)

**Navigasi Menu**:
| Icon | Label | Path |
|------|-------|------|
| LayoutDashboard | Dashboard | `/admin` |
| Package | Produk | `/admin/produk` |
| FolderOpen | Kategori | `/admin/kategori` |
| Settings | Pengaturan | `/admin/pengaturan` |

**Fitur**:

- Logo toko di atas
- Active state (highlight menu aktif)
- Tombol Logout di bawah
- Responsive: drawer di mobile

**Logout Handler**:

```typescript
const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push("/admin/login");
};
```

---

## 📊 Phase 5.2: Dashboard Overview

**File**: `app/(admin)/admin/page.tsx`

**Widgets/Cards yang ditampilkan**:

| Widget          | Data               | Query                                                           |
| --------------- | ------------------ | --------------------------------------------------------------- |
| Total Produk    | Count produk aktif | `products.select("*", { count: "exact" }).eq("aktif", true)`    |
| Total Kategori  | Count kategori     | `categories.select("*", { count: "exact" })`                    |
| Produk Featured | Count featured     | `products.select("*", { count: "exact" }).eq("featured", true)` |
| Stok Menipis    | Count stok < 10    | `products.select("*", { count: "exact" }).lt("stok", 10)`       |

**Layout**:

```
┌──────────────────────────────────────────────────┐
│  Selamat Datang, Admin!                          │
│  Ringkasan data toko Anda                        │
├──────────┬──────────┬──────────┬─────────────────┤
│ Total    │ Total    │ Produk   │ Stok            │
│ Produk   │ Kategori │ Featured │ Menipis         │
│   25     │    6     │    4     │    3            │
└──────────┴──────────┴──────────┴─────────────────┘
│                                                   │
│  Quick Actions:                                   │
│  [+ Tambah Produk]  [+ Tambah Kategori]          │
└───────────────────────────────────────────────────┘
```

---

## 📂 Phase 5.3: CRUD Kategori

**File**: `app/(admin)/admin/kategori/page.tsx`

### Fitur Lengkap:

1. **Tabel Kategori** (urut berdasarkan `urutan`)
   - Kolom: Nama, Slug, Urutan, Status, Aksi
   - Status: Badge (Aktif/Nonaktif)
   - Aksi: Edit (inline/modal), Hapus

2. **Tambah Kategori**
   - Form di atas tabel atau modal
   - Auto-generate slug dari nama
   - Fields: nama, deskripsi, urutan, aktif

3. **Edit Kategori** (inline atau modal)
   - Update langsung di row
   - Atau buka modal edit

4. **Hapus Kategori**
   - Konfirmasi dialog
   - Cek apakah ada produk terkait
   - Soft delete (set aktif = false) atau hard delete

### Query Supabase:

```typescript
// Fetch semua kategori
const { data } = await supabase
  .from("categories")
  .select("*")
  .order("urutan", { ascending: true });

// Insert kategori baru
const { error } = await supabase
  .from("categories")
  .insert({ nama, slug, deskripsi, urutan, aktif: true });

// Update kategori
const { error } = await supabase
  .from("categories")
  .update({ nama, slug, deskripsi, urutan, aktif })
  .eq("id", id);

// Delete kategori
const { error } = await supabase.from("categories").delete().eq("id", id);
```

### Fungsi Generate Slug:

```typescript
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
```

---

## 📦 Phase 5.4: CRUD Produk

### 5.4.1 List Produk (`/admin/produk`)

**File**: `app/(admin)/admin/produk/page.tsx`

**Layout**:

```
┌────────────────────────────────────────────────────┐
│  Kelola Produk                    [+ Tambah Produk]│
├────────────────────────────────────────────────────┤
│  [Search...🔍]  [Filter Kategori ▼] [Filter Status]│
├────────────────────────────────────────────────────┤
│  ┌─────┬──────────┬────────┬────────┬──────┬─────┐ │
│  │Img  │ Nama     │Kategori│ Harga  │Status│Aksi │ │
│  ├─────┼──────────┼────────┼────────┼──────┼─────┤ │
│  │[img]│ Kaos A   │ Polos  │ 75.000 │ ✅   │ ✏️🗑️│ │
│  │[img]│ Kaos B   │ Sablon │ 95.000 │ ✅   │ ✏️🗑️│ │
│  └─────┴──────────┴────────┴────────┴──────┴─────┘ │
│                                                     │
│  Showing 1-10 of 25    [<] [1] [2] [3] [>]         │
└─────────────────────────────────────────────────────┘
```

**Fitur Tabel**:

- Thumbnail gambar pertama
- Nama produk (link ke edit)
- Kategori (dari join)
- Harga (format Rupiah)
- Status: Badge Aktif/Nonaktif + Featured
- Aksi: Edit (redirect), Hapus (confirm)

**Query dengan Join**:

```typescript
const { data } = await supabase
  .from("products")
  .select("*, categories(nama)")
  .order("created_at", { ascending: false });
```

---

### 5.4.2 Form Tambah Produk (`/admin/produk/tambah`)

**File**: `app/(admin)/admin/produk/tambah/page.tsx`

**Gunakan komponen**: `<ProductForm mode="create" />`

---

### 5.4.3 Form Edit Produk (`/admin/produk/[id]/edit`)

**File**: `app/(admin)/admin/produk/[id]/edit/page.tsx`

**Gunakan komponen**: `<ProductForm mode="edit" productId={id} />`

---

### 5.4.4 ProductForm Component

**File**: `components/admin/ProductForm.tsx`

**Props**:

```typescript
interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
}
```

**Fields Form**:

| Field         | Type                  | Validasi                |
| ------------- | --------------------- | ----------------------- |
| nama          | text input            | required, min 3 chars   |
| slug          | text input            | auto-generate, editable |
| harga         | number input          | required, min 0         |
| deskripsi     | textarea              | required                |
| kategori_id   | select dropdown       | required                |
| gambar        | image uploader        | min 1 gambar            |
| varian_ukuran | multi-select/checkbox | S, M, L, XL, XXL        |
| varian_warna  | multi-input/tags      | dynamic add             |
| stok          | number input          | default 0               |
| aktif         | toggle switch         | default true            |
| featured      | toggle switch         | default false           |

**Layout Form**:

```
┌─────────────────────────────────────────────────────┐
│  Tambah Produk / Edit Produk                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─── Informasi Dasar ──────────────────────────┐   │
│  │ Nama Produk    [________________________]    │   │
│  │ Slug           [________________________]    │   │
│  │ Kategori       [Select kategori... ▼    ]    │   │
│  │ Harga          [Rp ____________________ ]    │   │
│  │ Deskripsi      [________________________]    │   │
│  │                [________________________]    │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌─── Gambar ───────────────────────────────────┐   │
│  │ [📷] [📷] [📷] [+ Tambah]                    │   │
│  │ Drag & drop atau klik untuk upload           │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌─── Varian ───────────────────────────────────┐   │
│  │ Ukuran:  [✓]S [✓]M [✓]L [✓]XL [ ]XXL         │   │
│  │ Warna:   [Hitam ×] [Putih ×] [+ Tambah]      │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌─── Stok & Status ────────────────────────────┐   │
│  │ Stok         [_____]                         │   │
│  │ Aktif        [Toggle On/Off]                 │   │
│  │ Featured     [Toggle On/Off]                 │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  [Batal]                            [Simpan Produk] │
└─────────────────────────────────────────────────────┘
```

**Upload Gambar (MVP)**:

- Untuk MVP, gunakan URL gambar (input text)
- Placeholder: `https://picsum.photos/seed/{random}/600/600`
- Supabase Storage akan diimplementasi di Phase 6

---

## ⚙️ Phase 5.5: Pengaturan Toko

**File**: `app/(admin)/admin/pengaturan/page.tsx`

**Tabs/Sections**:

### Tab 1: Nomor WhatsApp

```typescript
// Key: "whatsapp_number"
{
  number: "6281234567890",  // Untuk wa.me link
  display: "0812-3456-7890" // Untuk display
}
```

### Tab 2: Informasi Toko

```typescript
// Key: "store_info"
{
  name: "Toko Baju Sablon",
  address: "Jl. Contoh No. 123",
  phone: "0812-3456-7890",
  email: "info@tokobajusablon.com",
  hours: "Senin - Sabtu: 09:00 - 17:00"
}
```

### Tab 3: Media Sosial

```typescript
// Key: "social_media"
{
  instagram: "https://instagram.com/...",
  facebook: "https://facebook.com/...",
  tiktok: "https://tiktok.com/..."
}
```

**Query Settings**:

```typescript
// Fetch by key
const { data } = await supabase
  .from("settings")
  .select("*")
  .eq("key", "whatsapp_number")
  .single();

// Update (upsert)
const { error } = await supabase.from("settings").upsert(
  {
    key: "whatsapp_number",
    value: { number, display },
  },
  { onConflict: "key" },
);
```

---

## 🎨 Design Guidelines (WAJIB DIIKUTI)

### Warna

- **Primary**: `blue-600` (hover: `blue-700`)
- **Success**: `green-600`
- **Danger**: `red-600`
- **Warning**: `yellow-600`
- **Background**: `gray-50` (main), `white` (cards)
- **Border**: `gray-200`

### Komponen

- **Card**: `bg-white rounded-xl border shadow-sm p-6`
- **Button Primary**: `bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg`
- **Button Secondary**: `border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg`
- **Button Danger**: `bg-red-600 hover:bg-red-700 text-white`
- **Input**: `border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500`
- **Table**: `border rounded-xl overflow-hidden`

### Icons

Gunakan **Lucide React** (sudah terinstall):

```tsx
import {
  Package,
  FolderOpen,
  Settings,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
```

---

## ⚠️ Aturan Penting (JANGAN DILANGGAR)

### ✅ LAKUKAN:

1. Gunakan TypeScript dengan types yang sudah ada di `types/index.ts`
2. Gunakan Supabase client dari `@/lib/supabase` (client) atau `@/lib/supabase-server` (server)
3. Ikuti color scheme yang sudah ditetapkan
4. Buat loading state untuk setiap fetch data
5. Buat error handling yang user-friendly
6. Pastikan responsive (mobile-friendly)
7. Gunakan `"use client"` untuk komponen interaktif

### ❌ JANGAN:

1. Edit file `middleware.ts` - auth sudah di-setup
2. Edit file `.env.local` - kredensial sensitif
3. Install package baru tanpa konfirmasi
4. Buat struktur folder baru di luar yang sudah direncanakan
5. Gunakan inline styles - gunakan Tailwind classes
6. Skip validasi form

---

## 🧪 Cara Verifikasi Setiap Phase

### Phase 5.1 (Login + Layout):

1. Buka `/admin/login`
2. Login dengan kredensial yang valid → harus redirect ke `/admin`
3. Sidebar harus muncul dan navigasi berfungsi
4. Logout harus kembali ke `/admin/login`

### Phase 5.2 (Dashboard):

1. Buka `/admin`
2. Statistik (Total Produk, dll) harus menampilkan data yang benar
3. Quick action buttons harus navigasi dengan benar

### Phase 5.3 (Kategori):

1. Buat kategori baru → harus muncul di tabel
2. Edit kategori → data harus terupdate
3. Hapus kategori → harus hilang dari tabel
4. Cek di halaman katalog public → kategori baru harus muncul di filter

### Phase 5.4 (Produk):

1. Buat produk baru dengan semua field → harus muncul di tabel
2. Edit produk → data harus terupdate
3. Hapus produk → harus hilang
4. Cek di halaman katalog public → produk harus muncul/hilang sesuai status

### Phase 5.5 (Pengaturan):

1. Update nomor WhatsApp
2. Cek di halaman checkout → nomor WA harus terupdate
3. Update info toko → cek di footer/halaman tentang

---

## 📝 Checklist Progress

```
Phase 5.1: Foundation
[ ] Login page dengan Supabase Auth
[ ] Admin layout dengan sidebar
[ ] AdminSidebar component
[ ] Logout functionality

Phase 5.2: Dashboard
[ ] Dashboard stats widgets
[ ] Quick action buttons
[ ] DashboardStats component

Phase 5.3: Kategori
[ ] CategoryTable component
[ ] CategoryForm component (inline/modal)
[ ] CRUD operations
[ ] Validasi dan error handling

Phase 5.4: Produk
[ ] ProductTable component
[ ] ProductForm component
[ ] Halaman tambah produk
[ ] Halaman edit produk
[ ] Filter dan search
[ ] Pagination

Phase 5.5: Pengaturan
[ ] Form nomor WhatsApp
[ ] Form info toko
[ ] Form social media
[ ] Upsert functionality
```

---

## 🔗 Resources & Patterns dari Phase 1-4 (WAJIB DIGUNAKAN)

> [!IMPORTANT]
> Komponen dan pola di bawah ini SUDAH ADA dari Phase 1-4.
> WAJIB digunakan untuk konsistensi. JANGAN membuat ulang!

### Komponen UI yang Sudah Ada

| Komponen      | Path                       | Kegunaan di Phase 5                |
| ------------- | -------------------------- | ---------------------------------- |
| **Modal**     | `components/ui/Modal.tsx`  | Konfirmasi hapus, form edit inline |
| **Button**    | `components/ui/button.tsx` | Semua button di admin              |
| **cn() util** | `lib/utils.ts`             | Merge Tailwind classes             |

### Pattern Modal (Phase 4)

```tsx
import Modal from "@/components/ui/Modal";

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Konfirmasi Hapus"
>
  <p>Apakah Anda yakin ingin menghapus kategori ini?</p>
  <div className="flex gap-3 mt-4">
    <button onClick={onClose}>Batal</button>
    <button onClick={handleDelete} className="bg-red-600 text-white">
      Hapus
    </button>
  </div>
</Modal>;
```

### Pattern Varian Selector (dari ProductActions.tsx)

Gunakan pattern ini untuk multi-select ukuran di ProductForm:

```tsx
<div className="flex flex-wrap gap-3">
  {options.map((opt) => (
    <button
      key={opt}
      onClick={() => toggleSelected(opt)}
      className={cn(
        "px-4 py-2 border rounded-lg text-sm font-medium transition-all",
        selected.includes(opt)
          ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
          : "border-gray-200 text-gray-700 hover:border-blue-600",
      )}
    >
      {opt}
    </button>
  ))}
</div>
```

### Pattern Navigation Active State (dari Header.tsx)

Gunakan untuk AdminSidebar:

```tsx
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const pathname = usePathname();

<Link
  href={link.href}
  className={cn(
    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
    pathname === link.href
      ? "bg-blue-50 text-blue-600 font-medium"
      : "text-gray-600 hover:bg-gray-50",
  )}
>
  <link.icon className="h-5 w-5" />
  <span>{link.name}</span>
</Link>;
```

### Pattern Error Message (dari ProductActions.tsx)

```tsx
{
  error && (
    <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in">
      <AlertCircle className="h-4 w-4 mr-2" />
      {error}
    </div>
  );
}
```

### Pattern Loading Button (dari Checkout)

```tsx
<button
  disabled={isSubmitting}
  className={cn(
    "w-full px-4 py-3 rounded-lg font-medium transition-all",
    isSubmitting
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-blue-600 text-white hover:bg-blue-700",
  )}
>
  {isSubmitting ? "Menyimpan..." : "Simpan"}
</button>
```

### Pattern Format Harga (dari Checkout)

```tsx
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};
```

---

### Resources Infrastruktur

| Resource        | Path                     | Status                     |
| --------------- | ------------------------ | -------------------------- |
| Types           | `types/index.ts`         | ✅ Product, Category, etc  |
| Supabase Client | `lib/supabase.ts`        | ✅ Untuk client components |
| Supabase Server | `lib/supabase-server.ts` | ✅ Untuk server components |
| Middleware      | `middleware.ts`          | ✅ Protecting admin routes |
| Cart Store      | `store/cartStore.ts`     | ✅ Contoh pattern Zustand  |

### Komponen Referensi dari Katalog

| File                  | Referensi Untuk                     |
| --------------------- | ----------------------------------- |
| `ProductActions.tsx`  | Pattern pilih varian (ukuran/warna) |
| `FilterSidebar.tsx`   | Pattern sidebar dengan filter       |
| `ProductCard.tsx`     | Pattern card dengan gambar          |
| `AddToCartButton.tsx` | Pattern button dengan loading state |
| `QuickAddModal.tsx`   | Pattern modal dengan form           |

---

**Dokumen ini adalah satu-satunya referensi untuk Phase 5.**
**Jangan menyimpang dari perencanaan ini.**
