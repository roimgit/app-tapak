---
trigger: always_on
---

# TAPAK. PROJECT RULES & SYSTEM DIRECTIVES

## 1. Identitas Brand & Design System
- Nama Brand: "Tapak." (sentence case dengan tanda titik di akhir).
- Palet Warna Baku:
  * Primary / CTA: #3D77EE (tombol utama, aksen aktif, pin terpilih)
  * Primary Dark: #2B55AB (hover tombol primer, elemen gelap)
  * Secondary / Sky: #0EA5E9 (badge terverifikasi sekunder)
  * Light Accent: #93C5FD (dilarang untuk teks di atas latar putih)
  * Netral: Background #F3F6FB, Card #FFFFFF, Teks Utama #111827, Teks Sekunder #687280
- Tipografi:
  * Wordmark Logo: Arial / Helvetica Neue Bold khusus logo statis.
  * Antarmuka (UI Headings & Body): Wajib menggunakan font Inter atau Poppins. Dilarang font serif.
- Border Radius: 10px (tombol/input), 18px (kartu properti), 24px (modal pop-up/drawer).
- Peta: Pin cluster wajib berbentuk tetes air biru (#3D77EE) dengan angka putih di tengah (bukan lingkaran oranye).

## 2. Arsitektur Backend & Database (Prisma + PostGIS)
- Model `Listing` wajib memuat:
  * `verification_tier`: Enum `VerificationTier` (`NONE`, `BRONZE`, `SILVER`, `GOLD`)
  * `maintenance_fee`: Decimal? (biaya pemeliharaan / IPL)
  * `utility_estimate`: Decimal? (estimasi utilitas)
  * `location`: Unsupported("geometry(Point, 4326)")?
- Kueri Spasial: Wajib menggunakan `prisma.$queryRaw` dengan fungsi PostGIS `ST_MakeEnvelope` dan `ST_Contains`. Dilarang filter koordinat flat biasa.
- Media: Semua upload gambar dioptimalkan ke WebP (maks 5MB) dan menggunakan `next/image`.

## 3. Standar Bahasa & Komponen
- Seluruh teks antarmuka, label input, tombol, pesan validasi form, dan error handling wajib menggunakan Bahasa Indonesia baku.

## 4. Standar Clean Code & Anti-Bloat (Ketat)
- **Zero Dead Code**: Dilarang meninggalkan variabel yang tidak terpakai, impor usang (*unused imports*), fungsi uji coba sementara, atau blok kode yang di-comment out.
- **Prinsip DRY (Don't Repeat Yourself)**: Dilarang membuat fungsi utilitas baru jika fungsionalitas tersebut sudah ada di pustaka bawaan Next.js/JavaScript atau sudah ada di modul utilitas proyek (`lib/utils.ts`).
- **Single Responsibility & Batas Baris**: Satu fungsi/komponen maksimal 40–60 baris. Jika fungsi terlalu panjang atau memiliki banyak tanggung jawab, pecah menjadi sub-komponen atau custom hook terpisah.
- **Kerapian Modul**: Pisahkan dengan tegas antara:
  * Komponen UI murni (`components/ui/`)
  * Logika bisnis dan kueri data (`modules/[domain]/`)
  * Tipe data TypeScript (`packages/shared-types/` atau `types/`)

## 5. Efisiensi Performa & Optimasi Frontend / Backend
- **Server Components (RSC) First**:
  * Default setiap komponen adalah React Server Component.
  * Gunakan direktif `"use client"` HANYA pada komponen ujung (*leaf components*) yang benar-benar membutuhkan interaktivitas pengguna (seperti tombol aksi, input formulir, atau interaksi peta). Dilarang memasang `"use client"` di level halaman (*page-level*).
- **Dynamic Import untuk Library Berat**:
  * Pustaka peta (Leaflet / Mapbox) dan pustaka grafik WAJIB diimpor secara dinamis menggunakan `next/dynamic` dengan opsi `{ ssr: false }` untuk mencegah *bundle bloat* saat pertama kali halaman dimuat.
- **Anti-Spam Kueri Peta (Debouncing)**:
  * Event perubahan area peta (`onPan`, `onZoom`, `onBoundsChange`) WAJIB menggunakan teknik *debounce* minimal 300–400ms sebelum memanggil API pencarian ke database.
- **No "SELECT *" / Over-fetching pada Database**:
  * Pada kueri daftar properti atau pin peta, hanya ambil field yang dibutuhkan (`id`, `title`, `price`, `verification_tier`, `lat`, `lng`, `thumbnail`). Jangan mengambil kolom deskripsi panjang, histori log, atau relasi yang tidak ditampilkan pada kartu properti.
  * Setiap kueri daftar wajib memiliki limit data maksimum (`take` / `LIMIT`) agar database tidak kelebihan beban.
- **Optimasi Re-render**:
  * Gunakan `useMemo` dan `useCallback` secara tepat pada komputasi filter kartu properti dan fungsi handler yang diteruskan ke komponen peta agar tidak memicu re-render massal.