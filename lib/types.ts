export type VerificationTier = "NONE" | "BRONZE" | "SILVER" | "GOLD";

export type TransactionType = "DISEWAKAN" | "DIJUAL";

export type CertificateType =
  | "SHM"
  | "SHGB"
  | "HGB"
  | "STRATA_TITLE"
  | "GIRIK"
  | "BELUM_BERSERTIFIKAT";

export type PriceStatus = "NEGO" | "NETT";

export type PaymentMethod = "BISA_KPR" | "CASH_KERAS" | "CASH_BERTAHAP";

/** Kantong spesifikasi teknis fleksibel — disimpan sebagai JSON di database */
export interface ListingSpecs {
  garage?: number;
  carport?: number;
  electricity?: string;     // "900W" | "1300W" | "2200W" | "3500W" | "3500W+"
  facing?: string;          // arah hadap: "Utara", "Selatan", dll.
  furnishing?: string;      // "Unfurnished" | "Semi-Furnished" | "Full-Furnished"
  water_source?: string;    // "PAM" | "Sumur Bor" | "PAM & Sumur Bor"
  virtual_tour_url?: string;
  youtube_url?: string;
  floor_plan_url?: string;
}

export interface ListingItem {
  id: string;
  title: string;
  slug: string;
  description: string;

  // Keuangan — semantik berubah tergantung transaction_type
  price: number;             // Sewa/bln (DISEWAKAN) atau Harga Jual Total (DIJUAL)
  deposit: number;           // Deposit jaminan (DISEWAKAN) — 0 jika DIJUAL
  maintenance_fee: number;   // Biaya pemeliharaan / IPL (DISEWAKAN)
  utility_estimate: number;  // Estimasi utilitas (DISEWAKAN)

  verification_tier: VerificationTier;

  // Jenis Transaksi
  transaction_type: TransactionType;

  // Legalitas & opsi pembayaran (relevan saat DIJUAL)
  certificate_type?: CertificateType | null;
  price_status?: PriceStatus | null;
  payment_methods?: PaymentMethod[];

  property_type: "Apartemen" | "Rumah" | "Kost" | "Vila" | "Ruko";
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;          // Luas Bangunan (LB)
  land_area_sqm?: number | null;    // Luas Tanah (LT)
  address: string;
  district: string;
  city: string;

  // Spesifikasi teknis (garasi, listrik, arah hadap, dll.)
  specs?: ListingSpecs | null;

  // Privasi & co-broking
  is_private?: boolean;
  co_broking_enabled?: boolean;
  co_broking_commission?: number | null;

  latitude: number;
  longitude: number;

  images: string[];
  amenities: string[];
  is_available: boolean;
  approval_status?: "PENDING" | "APPROVED" | "REJECTED";
  rejection_reason?: string | null;
  owner_email?: string | null;

  agent_name: string;
  agent_phone: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ListingFilters {
  query?: string;
  property_type?: string;
  transaction_type?: TransactionType;
  city?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  verification_tier?: VerificationTier;
}

export interface BoundsFilter {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}
