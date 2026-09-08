export type VerificationTier = "NONE" | "BRONZE" | "SILVER" | "GOLD";

export interface ListingItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number; // Sewa per bulan
  deposit: number; // Deposit jaminan
  maintenance_fee: number; // Biaya pemeliharaan / IPL
  utility_estimate: number; // Estimasi utilitas (listrik/air/internet)
  verification_tier: VerificationTier;

  property_type: "Apartemen" | "Rumah" | "Kost" | "Vila" | "Ruko";
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  address: string;
  district: string;
  city: string;

  latitude: number;
  longitude: number;

  images: string[];
  amenities: string[];
  is_available: boolean;

  agent_name: string;
  agent_phone: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface ListingFilters {
  query?: string;
  property_type?: string;
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
