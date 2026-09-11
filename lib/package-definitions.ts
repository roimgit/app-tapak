export interface PackageDefinition {
  id: string;
  name: string;
  standardPrice: number;
  standardPeriod: string;
  standardDays: number;
  discountPrice: number;
  discountPeriod: string;
  discountDays: number;
  quotaListing: number;
  features: string[];
  recommended?: boolean;
  includeAdSlot?: boolean;
  adSlotType?: "BILLBOARD_HOME" | "PROMO_POPUP";
  adDurationDays?: number;
  isActive: boolean;
}

export const DEFAULT_PACKAGES: PackageDefinition[] = [
  {
    id: "single",
    name: "Single Lapak (Starter)",
    standardPrice: 75000,
    standardPeriod: "/ 30 Hari",
    standardDays: 30,
    discountPrice: 190000,
    discountPeriod: "/ 90 Hari",
    discountDays: 90,
    quotaListing: 1,
    features: [
      "1 Kuota Listing Aktif serentak",
      "Integrasi tombol WhatsApp langsung tanpa perantara",
      "Notifikasi pengingat perpanjangan otomatis",
      "Statistik klik, leads, & impresi prospek dasar",
    ],
    recommended: false,
    includeAdSlot: false,
    isActive: true,
  },
  {
    id: "multi",
    name: "Multi Lapak (Pro)",
    standardPrice: 199000,
    standardPeriod: "/ 60 Hari",
    standardDays: 60,
    discountPrice: 499000,
    discountPeriod: "/ 90 Hari",
    discountDays: 90,
    quotaListing: 5,
    features: [
      "5 Kuota Listing Aktif serentak",
      "Badge verifikasi eksklusif Owner Terverifikasi",
      "Prioritas ranking di hasil pencarian teratas regional",
      "Multi-foto tajam hingga 15 foto HD per properti",
      "Lead tracker & rekapan calon prospek via WhatsApp",
      "Bantuan kurasi judul & deskripsi AI otomatis Tapak",
    ],
    recommended: true,
    includeAdSlot: false,
    isActive: true,
  },
  {
    id: "juragan",
    name: "Juragan Properti (Enterprise)",
    standardPrice: 450000,
    standardPeriod: "/ 90 Hari",
    standardDays: 90,
    discountPrice: 1150000,
    discountPeriod: "/ 180 Hari",
    discountDays: 180,
    quotaListing: 15,
    features: [
      "15 Kuota Listing Aktif serentak",
      "GRATIS 1x Slot Iklan Billboard Beranda (30 Hari)",
      "Prioritas kurasi & moderasi kilat (< 2 jam kerja)",
      "Laporan performa mingguan & analitik leads mendalam",
      "Dedicated WhatsApp Account Manager personal",
      "Spotlight media sosial resmi Tapak.",
    ],
    recommended: false,
    includeAdSlot: true,
    adSlotType: "BILLBOARD_HOME",
    adDurationDays: 30,
    isActive: true,
  },
];
