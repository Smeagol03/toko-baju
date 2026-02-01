# Rencana Proteksi Anti-Spam

Dokumentasi ini berisi analisis keamanan dan rekomendasi proteksi untuk mencegah spam yang dapat membebani server/database.

---

## Status Keamanan Saat Ini (Phase 1-4)

### ✅ Yang Sudah Aman

| Fitur | Status | Alasan |
|-------|--------|--------|
| Checkout Form | Aman | Tidak ada data masuk ke DB, hanya redirect ke WhatsApp |
| API Routes | Aman | Hanya placeholder GET, tidak ada operasi write |
| Admin Routes | Aman | Diproteksi middleware (memerlukan login) |
| Keranjang | Aman | Disimpan di local storage (Zustand persist) |

### ⚠️ Area yang Perlu Diperhatikan

Jika Phase 5+ menambahkan fitur berikut, proteksi anti-spam WAJIB diterapkan:

- Order tracking (menyimpan pesanan ke database)
- User reviews/testimonials
- Contact form
- Newsletter signup
- Komentar produk

---

## Rekomendasi Proteksi

### 1. Rate Limiting (Prioritas: TINGGI)

**Deskripsi**: Batasi jumlah request per IP dalam periode waktu tertentu.

**Implementasi**:
```typescript
// lib/rateLimit.ts
import { LRUCache } from 'lru-cache';

const rateLimiter = new LRUCache({
  max: 500,
  ttl: 60 * 1000, // 1 menit
});

export function rateLimit(ip: string, limit: number = 10): boolean {
  const tokenCount = (rateLimiter.get(ip) as number) || 0;
  if (tokenCount >= limit) return false;
  rateLimiter.set(ip, tokenCount + 1);
  return true;
}
```

**Kapan Digunakan**: Semua API routes yang menerima POST request.

---

### 2. Honeypot Field (Prioritas: SEDANG)

**Deskripsi**: Hidden field yang bot biasanya isi, tetapi manusia tidak melihat.

**Implementasi**:
```tsx
// Di form
<input 
  type="text" 
  name="website" 
  style={{ display: 'none' }} 
  tabIndex={-1} 
  autoComplete="off"
/>

// Di handler
if (formData.website) {
  // Bot detected, reject silently
  return { success: false };
}
```

**Kapan Digunakan**: Form kontak, form review, form newsletter.

---

### 3. reCAPTCHA / hCaptcha (Prioritas: SEDANG)

**Deskripsi**: Verifikasi manusia untuk form submission penting.

**Implementasi**:
- Install: `npm install @hcaptcha/react-hcaptcha`
- Tambahkan komponen di form checkout/kontak
- Verifikasi token di server

**Kapan Digunakan**: Form checkout (jika menyimpan ke DB), form kontak.

---

### 4. Server-side Validation (Prioritas: TINGGI)

**Deskripsi**: Sanitasi dan validasi data sebelum masuk database.

**Implementasi**:
```typescript
import { z } from 'zod';

const OrderSchema = z.object({
  nama: z.string().min(2).max(100).trim(),
  hp: z.string().regex(/^08[0-9]{9,11}$/),
  alamat: z.string().min(10).max(500).trim(),
  catatan: z.string().max(200).optional(),
});

// Validasi
const result = OrderSchema.safeParse(data);
if (!result.success) {
  return { error: result.error.issues };
}
```

**Kapan Digunakan**: Semua input yang masuk ke database.

---

### 5. Supabase Row Level Security (Prioritas: KRITIS)

**Deskripsi**: Batasi akses database di level Supabase.

**Implementasi di Supabase Dashboard**:
```sql
-- Contoh: User hanya bisa baca produk
CREATE POLICY "Public can read products"
ON products FOR SELECT
USING (true);

-- Contoh: Hanya admin yang bisa insert/update/delete
CREATE POLICY "Only admin can modify products"
ON products FOR ALL
USING (auth.role() = 'authenticated');
```

**Kapan Digunakan**: Semua tabel di Supabase.

---

## Prioritas Implementasi

| Urutan | Solusi | Kapan |
|--------|--------|-------|
| 1 | Supabase RLS | Segera (sebelum Phase 5) |
| 2 | Rate Limiting | Saat ada API POST |
| 3 | Server-side Validation | Saat ada form ke DB |
| 4 | Honeypot Field | Saat ada form publik |
| 5 | CAPTCHA | Jika spam tetap terjadi |

---

## Catatan

- Dokumen ini akan diupdate sesuai kebutuhan Phase 5+
- Implementasi aktual akan dilakukan saat fitur terkait dikembangkan
