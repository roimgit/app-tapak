import { prisma } from "./prisma";
import { MOCK_LISTINGS } from "./mock-data";
import { ListingItem, ListingFilters, BoundsFilter } from "./types";

const MAX_LISTING_LIMIT = 50;

const SELECTIVE_LISTING_FIELDS = {
  id: true,
  title: true,
  slug: true,
  description: true,
  price: true,
  deposit: true,
  maintenance_fee: true,
  utility_estimate: true,
  verification_tier: true,
  property_type: true,
  bedrooms: true,
  bathrooms: true,
  area_sqm: true,
  address: true,
  district: true,
  city: true,
  latitude: true,
  longitude: true,
  images: true,
  amenities: true,
  is_available: true,
  agent_name: true,
  agent_phone: true,
  created_at: true,
  updated_at: true,
} as const;

export async function getListings(
  filters?: ListingFilters,
  bounds?: BoundsFilter
): Promise<ListingItem[]> {
  const isMockOnly =
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("mockpassword");

  if (!isMockOnly) {
    try {
      if (bounds) {
        const rawResults = await prisma.$queryRaw<ListingItem[]>`
          SELECT 
            id, title, slug, description, 
            price::float as price, 
            deposit::float as deposit, 
            maintenance_fee::float as maintenance_fee, 
            utility_estimate::float as utility_estimate,
            verification_tier, property_type, bedrooms, bathrooms, 
            area_sqm, address, district, city, 
            latitude, longitude, images, amenities, 
            is_available, agent_name, agent_phone, created_at, updated_at
          FROM listings
          WHERE is_available = true
            AND location IS NOT NULL
            AND ST_Contains(
              ST_MakeEnvelope(${bounds.minLng}, ${bounds.minLat}, ${bounds.maxLng}, ${bounds.maxLat}, 4326),
              location
            )
          LIMIT ${MAX_LISTING_LIMIT}
        `;

        if (rawResults?.length) return rawResults as ListingItem[];
      } else {
        const dbListings = await prisma.listing.findMany({
          where: {
            is_available: true,
            ...(filters?.city && { city: { contains: filters.city, mode: "insensitive" } }),
            ...(filters?.property_type && { property_type: filters.property_type }),
            ...(filters?.verification_tier && { verification_tier: filters.verification_tier }),
            ...(filters?.bedrooms && { bedrooms: { gte: filters.bedrooms } }),
            ...(filters?.max_price && { price: { lte: filters.max_price } }),
            ...(filters?.min_price && { price: { gte: filters.min_price } }),
          },
          select: SELECTIVE_LISTING_FIELDS,
          take: MAX_LISTING_LIMIT,
          orderBy: { created_at: "desc" },
        });

        if (dbListings?.length) {
          return dbListings.map((l) => ({
            ...l,
            price: Number(l.price),
            deposit: l.deposit ? Number(l.deposit) : 0,
            maintenance_fee: l.maintenance_fee ? Number(l.maintenance_fee) : 0,
            utility_estimate: l.utility_estimate ? Number(l.utility_estimate) : 0,
            property_type: l.property_type as ListingItem["property_type"],
            verification_tier: l.verification_tier as ListingItem["verification_tier"],
          }));
        }
      }
    } catch {
      // Graceful fallback to mock data when database is unavailable
    }
  }

  return filterMockListings(filters, bounds);
}

function filterMockListings(filters?: ListingFilters, bounds?: BoundsFilter): ListingItem[] {
  let results = [...MOCK_LISTINGS];

  if (filters?.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q)
    );
  }

  if (filters?.city) {
    results = results.filter((item) =>
      item.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  if (filters?.property_type && filters.property_type !== "Semua") {
    results = results.filter(
      (item) => item.property_type.toLowerCase() === filters.property_type!.toLowerCase()
    );
  }

  if (filters?.verification_tier) {
    results = results.filter((item) => item.verification_tier === filters.verification_tier);
  }

  if (filters?.bedrooms) {
    results = results.filter((item) => item.bedrooms >= filters.bedrooms!);
  }

  if (filters?.min_price) {
    results = results.filter((item) => item.price >= filters.min_price!);
  }

  if (filters?.max_price) {
    results = results.filter((item) => item.price <= filters.max_price!);
  }

  if (bounds) {
    results = results.filter(
      (item) =>
        item.latitude >= bounds.minLat &&
        item.latitude <= bounds.maxLat &&
        item.longitude >= bounds.minLng &&
        item.longitude <= bounds.maxLng
    );
  }

  return results.slice(0, MAX_LISTING_LIMIT);
}

export async function getListingBySlug(slug: string): Promise<ListingItem | null> {
  const isMockOnly =
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("mockpassword");

  if (!isMockOnly) {
    try {
      const item = await prisma.listing.findUnique({
        where: { slug },
        select: SELECTIVE_LISTING_FIELDS,
      });

      if (item) {
        return {
          ...item,
          price: Number(item.price),
          deposit: item.deposit ? Number(item.deposit) : 0,
          maintenance_fee: item.maintenance_fee ? Number(item.maintenance_fee) : 0,
          utility_estimate: item.utility_estimate ? Number(item.utility_estimate) : 0,
          property_type: item.property_type as ListingItem["property_type"],
          verification_tier: item.verification_tier as ListingItem["verification_tier"],
        };
      }
    } catch {
      // Graceful fallback to mock data
    }
  }

  return MOCK_LISTINGS.find((item) => item.slug === slug) ?? null;
}

/**
 * Mengambil jumlah unit riil per kategori hunian langsung dari database.
 * Jika database tidak tersedia atau dalam mode mock, dilakukan fallback ke MOCK_LISTINGS.
 */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const isMockOnly =
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("mockpassword");

  if (!isMockOnly) {
    try {
      const groups = await prisma.listing.groupBy({
        by: ["property_type"],
        _count: {
          id: true,
        },
        where: {
          is_available: true,
        },
      });

      if (groups && groups.length > 0) {
        const counts: Record<string, number> = {
          Apartemen: 0,
          Rumah: 0,
          Kost: 0,
          Vila: 0,
          Ruko: 0,
        };

        for (const g of groups) {
          if (g.property_type) {
            counts[g.property_type] = g._count.id;
          }
        }
        return counts;
      }
    } catch (err) {
      console.warn("Kueri jumlah kategori dari database gagal, menggunakan fallback:", err);
    }
  }

  // Fallback ke data mock
  const fallbackCounts: Record<string, number> = {
    Apartemen: 0,
    Rumah: 0,
    Kost: 0,
    Vila: 0,
    Ruko: 0,
  };
  for (const item of MOCK_LISTINGS) {
    if (item.property_type) {
      fallbackCounts[item.property_type] = (fallbackCounts[item.property_type] || 0) + 1;
    }
  }
  return fallbackCounts;
}

