import fs from "fs";
import path from "path";

export type AdSlotType = "BILLBOARD_HOME" | "PROMO_POPUP";

export interface DurationRate {
  days: number;
  label: string;
  priceRupiah: number;
}

export interface AdSlotDefinition {
  type: AdSlotType;
  name: string;
  description: string;
  dimensionLabel: string;
  maxRotationSlots: number;
  isOpen: boolean;
  rates: DurationRate[];
}

export interface AdBookingData {
  id: string;
  slotType: AdSlotType;
  ownerEmail: string;
  ownerName: string;
  title: string;
  tag?: string;
  subtitle?: string;
  imageUrl: string;
  targetUrl: string;
  ctaText: string;
  startDate: string;
  endDate: string;
  paymentSource: "PAID" | "PACKAGE_INCLUDED";
  amountPaid: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
  rejectionNote?: string | null;
  isActive: boolean;
  createdAt: string;
}

export const DEFAULT_AD_SLOTS: AdSlotDefinition[] = [
  {
    type: "BILLBOARD_HOME",
    name: "Billboard Banner Beranda",
    description:
      "Banner horizontal utama di halaman depan web Tapak. Menjangkau seluruh pencari properti dengan rasio visual lebar (16:9).",
    dimensionLabel: "Rasio 16:9 (Rekomendasi 1600 × 500 px)",
    maxRotationSlots: 5,
    isOpen: true,
    rates: [
      { days: 7, label: "7 Hari (1 Minggu)", priceRupiah: 250000 },
      { days: 14, label: "14 Hari (2 Minggu)", priceRupiah: 450000 },
      { days: 30, label: "30 Hari (1 Bulan Penuh)", priceRupiah: 800000 },
    ],
  },
  {
    type: "PROMO_POPUP",
    name: "Popup Modal Promosi Beranda",
    description:
      "Modal dialog interaktif yang otomatis muncul saat calon penyewa/pembeli membuka beranda. Tingkat konversi klik tertinggi.",
    dimensionLabel: "Rasio 16:10 / Poster Landscape (Rekomendasi 1200 × 700 px)",
    maxRotationSlots: 3,
    isOpen: true,
    rates: [
      { days: 7, label: "7 Hari (1 Minggu)", priceRupiah: 350000 },
      { days: 14, label: "14 Hari (2 Minggu)", priceRupiah: 650000 },
      { days: 30, label: "30 Hari (1 Bulan Penuh)", priceRupiah: 1200000 },
    ],
  },
];

export const INITIAL_AD_BOOKINGS: AdBookingData[] = [
  {
    id: "booking-navapark-bsd",
    slotType: "BILLBOARD_HOME",
    ownerEmail: "developer@navapark.com",
    ownerName: "Navapark BSD City",
    title: "Cluster Lancewood Navapark — Hunian Resort Botanikal Eksklusif",
    tag: "DEVELOPER RESMI",
    subtitle:
      "Bebas iuran pemeliharaan (IPL) 6 bulan pertama & voucher perabot untuk penyewa terverifikasi.",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    targetUrl: "/explore?q=Navapark",
    ctaText: "Lihat Unit Tersedia",
    startDate: "2026-09-01",
    endDate: "2026-10-01",
    paymentSource: "PACKAGE_INCLUDED",
    amountPaid: 0,
    status: "APPROVED",
    rejectionNote: null,
    isActive: true,
    createdAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "booking-dekoruma-living",
    slotType: "BILLBOARD_HOME",
    ownerEmail: "partner@dekoruma.com",
    ownerName: "Dekoruma Home Living",
    title: "Voucher Styling Interior & Furnitur Senilai Rp 5.000.000",
    tag: "PARTNER EKSKLUSIF",
    subtitle:
      "Khusus kontrak sewa minimum 1 tahun di apartemen dan rumah terverifikasi Gold & Silver.",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    targetUrl: "/paket-iklan",
    ctaText: "Klaim Voucher",
    startDate: "2026-09-05",
    endDate: "2026-10-05",
    paymentSource: "PAID",
    amountPaid: 800000,
    status: "APPROVED",
    rejectionNote: null,
    isActive: true,
    createdAt: "2026-09-05T08:00:00.000Z",
  },
  {
    id: "booking-district-scbd-popup",
    slotType: "PROMO_POPUP",
    ownerEmail: "leasing@district8.com",
    ownerName: "District 8 SCBD Suites",
    title: "District 8 SCBD Gratis Biaya IPL 3 Bulan",
    tag: "PREMIUM LIVING",
    subtitle:
      "Akses Mall & MRT Jakarta. Diskon sewa spesial high-floor penthouse dan studio eksekutif.",
    imageUrl: "/promos/promo-scbd.jpg",
    targetUrl: "/explore?slug=district-8-scbd-studio-suite-high-floor",
    ctaText: "Sewa Sekarang di Tapak.",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    paymentSource: "PAID",
    amountPaid: 1200000,
    status: "APPROVED",
    rejectionNote: null,
    isActive: true,
    createdAt: "2026-09-01T10:00:00.000Z",
  },
];

const DATA_DIR = path.join(process.cwd(), "data");
const SLOTS_FILE = path.join(DATA_DIR, "ad-slots.json");
const BOOKINGS_FILE = path.join(DATA_DIR, "ad-bookings.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getAdSlotsConfig(): AdSlotDefinition[] {
  try {
    ensureDir();
    if (fs.existsSync(SLOTS_FILE)) {
      const raw = fs.readFileSync(SLOTS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading ad-slots.json:", err);
  }
  return DEFAULT_AD_SLOTS;
}

export function saveAdSlotsConfig(slots: AdSlotDefinition[]): AdSlotDefinition[] {
  try {
    ensureDir();
    fs.writeFileSync(SLOTS_FILE, JSON.stringify(slots, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving ad-slots.json:", err);
  }
  return slots;
}

export function getAdBookings(): AdBookingData[] {
  try {
    ensureDir();
    if (fs.existsSync(BOOKINGS_FILE)) {
      const raw = fs.readFileSync(BOOKINGS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading ad-bookings.json:", err);
  }
  return INITIAL_AD_BOOKINGS;
}

export function saveAdBookings(bookings: AdBookingData[]): AdBookingData[] {
  try {
    ensureDir();
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving ad-bookings.json:", err);
  }
  return bookings;
}
