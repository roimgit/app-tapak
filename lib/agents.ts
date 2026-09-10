import { getListings } from "@/lib/listings";
import { ListingItem } from "@/lib/types";

export interface AgentProfile {
  name: string;
  slug: string;
  phone: string;
  agency: string;
  title: string;
  avatar: string;
  bio: string;
  rating: number;
  review_count: number;
  experience_years: number;
  active_listings_count: number;
  sold_listings_count: number;
  verification_tier: "GOLD" | "SILVER" | "BRONZE";
  coverage_areas: string[];
  specialties: string[];
}

export function slugifyAgent(name: string): string {
  if (!name) return "agen-tapak";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const KNOWN_AGENT_METADATA: Record<string, Partial<AgentProfile>> = {
  "bambang-sudibyo": {
    agency: "Tapak Premier Partner",
    title: "Senior Luxury Property Consultant",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    bio: "Spesialis hunian mewah di Jakarta Selatan & Pusat dengan pengalaman lebih dari 8 tahun dalam transaksi residensial premium, apartemen penthouse, dan investasi properti bernilai tinggi.",
    rating: 4.9,
    review_count: 142,
    experience_years: 8,
    sold_listings_count: 54,
    verification_tier: "GOLD",
    coverage_areas: ["Senopati", "SCBD", "Kebayoran Baru", "Mega Kuningan", "Pondok Indah"],
    specialties: ["Luxury Residence", "Penthouse Suite", "Investasi Residensial", "Sertifikasi Legalitas"],
  },
  "ni-putu-dewi": {
    agency: "Bali Villa & Resort Realty",
    title: "Vila & Tropical Sanctuary Specialist",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Konsultan properti tersertifikasi di Denpasar & Badung Bali. Membantu ekspatriat dan investor lokal menemukan hunian vila tropis terbaik dengan legalitas aman dan ROI tinggi.",
    rating: 4.9,
    review_count: 98,
    experience_years: 6,
    sold_listings_count: 38,
    verification_tier: "GOLD",
    coverage_areas: ["Sanur", "Seminyak", "Canggu", "Uluwatu", "Denpasar"],
    specialties: ["Tropical Villa", "Holiday Rental", "SHGB & Freehold Bali", "Hospitality Asset"],
  },
  "arya-wibawa": {
    agency: "CBD Capital Properties",
    title: "CBD Commercial & High-End Suite Advisor",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    bio: "Konsultan khusus apartemen dan kondominium di koridor finansial Sudirman, Thamrin, dan Kuningan. Memberikan analisis pasar komprehensif bagi eksekutif korporat.",
    rating: 4.8,
    review_count: 110,
    experience_years: 7,
    sold_listings_count: 46,
    verification_tier: "SILVER",
    coverage_areas: ["SCBD", "Sudirman", "Thamrin", "Kuningan", "Senayan"],
    specialties: ["High Floor Suite", "Corporate Lease", "Strata Title Legal Check", "Furnished Interior"],
  },
  "clara-tanuwidjaja": {
    agency: "West Java & BSD Living",
    title: "Modern Township Specialist",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    bio: "Berfokus pada klaster hunian terpadu dan township modern di BSD City, Gading Serpong, dan Alam Sutera. Melayani pendampingan KPR dan negosiasi transaksi terpercaya.",
    rating: 4.9,
    review_count: 126,
    experience_years: 5,
    sold_listings_count: 42,
    verification_tier: "GOLD",
    coverage_areas: ["Navapark BSD", "Gading Serpong", "Alam Sutera", "Tangerang Selatan"],
    specialties: ["Township Living", "Family Cluster", "KPR Assistance", "Resale & Primary"],
  },
  "irwan-santosa": {
    agency: "Tapak Elite Estate Agency",
    title: "Principal High-Value Broker",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Broker berlisensi AREBI spesialis aset bernilai di atas Rp 20 Miliar. Berpengalaman menangani sertifikat SHM, restrukturisasi aset properti, dan transaksi rahasia berstatus privat.",
    rating: 5.0,
    review_count: 85,
    experience_years: 12,
    sold_listings_count: 73,
    verification_tier: "GOLD",
    coverage_areas: ["Pondok Indah", "Menteng", "Kebayoran Baru", "Permata Hijau"],
    specialties: ["High-Net-Worth Estate", "SHM Legal Audit", "Private Listing", "Co-Broking Elite"],
  },
  "stevanus-halim": {
    agency: "Commercial Hub Partners",
    title: "Commercial & Shophouse Specialist",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Pakar properti komersial: ruko, ruang usaha, dan gedung perkantoran skala menengah di Tangerang & Jakarta Barat dengan visibilitas bisnis dan perizinan usaha lengkap.",
    rating: 4.8,
    review_count: 64,
    experience_years: 9,
    sold_listings_count: 31,
    verification_tier: "SILVER",
    coverage_areas: ["BSD City", "Gading Serpong", "Karawaci", "Jakarta Barat"],
    specialties: ["Ruko Komersial", "Ruang Usaha", "Perizinan IMB Komersial", "High Traffic Assets"],
  },
  "reza-rahardian": {
    agency: "Urban Loft & Living",
    title: "Young Urban Property Advisor",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    bio: "Spesialis apartemen industrial & mezzanine modern di Jakarta Pusat dan Selatan. Membantu milenial & Gen Z menemukan hunian impian dengan skema biaya transparan.",
    rating: 4.8,
    review_count: 76,
    experience_years: 4,
    sold_listings_count: 27,
    verification_tier: "BRONZE",
    coverage_areas: ["Setiabudi", "Kuningan", "Tebet", "Menteng"],
    specialties: ["Industrial Loft", "Starter Home", "IPL Transparency", "Co-living"],
  },
  "dina-mariana": {
    agency: "Exclusive Co-Living & Kost",
    title: "Hospitality & Co-Living Manager",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    bio: "Pengelola dan konsultan hunian kost eksklusif serta co-living terstandarisasi hotel butik di Jakarta Selatan.",
    rating: 4.9,
    review_count: 53,
    experience_years: 4,
    sold_listings_count: 19,
    verification_tier: "SILVER",
    coverage_areas: ["Senopati", "Gunawarman", "Blok M", "Kemang"],
    specialties: ["Boutique Kost", "Co-Living", "Weekly Housekeeping", "Digital Access"],
  },
};

export async function getAgentBySlug(slug: string): Promise<{
  agent: AgentProfile;
  listings: ListingItem[];
} | null> {
  const allListings = await getListings();
  const normalizedSlug = slug.toLowerCase().trim();

  // Cari listing yang agennya cocok dengan slug
  const agentListings = allListings.filter((l) => slugifyAgent(l.agent_name) === normalizedSlug);

  if (agentListings.length === 0 && !KNOWN_AGENT_METADATA[normalizedSlug]) {
    return null;
  }

  const firstListing = agentListings[0];
  const agentName = firstListing ? firstListing.agent_name : "Konsultan Properti Tapak";
  const agentPhone = firstListing ? firstListing.agent_phone : "6281288991122";
  const knownMeta = KNOWN_AGENT_METADATA[normalizedSlug] || {};

  const cities = Array.from(new Set(agentListings.map((l) => l.city).filter(Boolean)));
  const districts = Array.from(new Set(agentListings.map((l) => l.district).filter(Boolean)));
  const dynamicAreas = [...districts, ...cities].slice(0, 5);

  const profile: AgentProfile = {
    name: agentName,
    slug: normalizedSlug,
    phone: agentPhone,
    agency: knownMeta.agency || "Mitra Agen Bersertifikat Tapak.",
    title: knownMeta.title || "Konsultan Properti Resmi Tapak.",
    avatar:
      knownMeta.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(agentName)}&background=3D77EE&color=fff&size=256&bold=true`,
    bio:
      knownMeta.bio ||
      `Konsultan properti terpercaya yang melayani konsultasi, negosiasi, dan verifikasi fisik hunian dengan standar mutu Tapak.id.`,
    rating: knownMeta.rating || 4.9,
    review_count: knownMeta.review_count || 48 + agentListings.length * 4,
    experience_years: knownMeta.experience_years || 5,
    active_listings_count: agentListings.length,
    sold_listings_count: knownMeta.sold_listings_count || 24,
    verification_tier: knownMeta.verification_tier || "GOLD",
    coverage_areas: knownMeta.coverage_areas || (dynamicAreas.length > 0 ? dynamicAreas : ["Jabodetabek"]),
    specialties:
      knownMeta.specialties || [
        "Residensial Premium",
        "Pemeriksaan Legalitas Dokumen",
        "Konsultasi Biaya Transparan",
        "Survey Lokasi Cepat",
      ],
  };

  return {
    agent: profile,
    listings: agentListings,
  };
}

export async function getAllAgents(): Promise<AgentProfile[]> {
  const allListings = await getListings();
  const agentMap = new Map<string, ListingItem[]>();

  allListings.forEach((l) => {
    const slug = slugifyAgent(l.agent_name);
    if (!agentMap.has(slug)) {
      agentMap.set(slug, []);
    }
    agentMap.get(slug)!.push(l);
  });

  const profiles: AgentProfile[] = [];

  for (const [slug, listings] of agentMap.entries()) {
    const res = await getAgentBySlug(slug);
    if (res) {
      profiles.push(res.agent);
    }
  }

  return profiles;
}
