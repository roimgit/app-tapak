import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/lib/listings";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BoundsFilter, ListingFilters, VerificationTier } from "@/lib/types";
import { AmenityCategory } from "@prisma/client";

// GET: Ambil daftar listing dengan filter & spatial bounds
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q") || undefined;
  const property_type = searchParams.get("type") || undefined;
  const city = searchParams.get("city") || undefined;
  const verification_tier = (searchParams.get("tier") as VerificationTier) || undefined;
  const max_price = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined;
  const min_price = searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined;

  let bounds: BoundsFilter | undefined = undefined;
  const minLat = searchParams.get("minLat");
  const minLng = searchParams.get("minLng");
  const maxLat = searchParams.get("maxLat");
  const maxLng = searchParams.get("maxLng");

  if (minLat && minLng && maxLat && maxLng) {
    bounds = {
      minLat: parseFloat(minLat),
      minLng: parseFloat(minLng),
      maxLat: parseFloat(maxLat),
      maxLng: parseFloat(maxLng),
    };
  }

  const filters: ListingFilters = {
    query,
    property_type,
    city,
    verification_tier,
    max_price,
    min_price,
  };

  const data = await getListings(filters, bounds);
  return NextResponse.json({ success: true, count: data.length, data });
}

// POST: Buat listing properti baru beserta fasilitas terdeteksi OSM
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      deposit,
      maintenance_fee,
      utility_estimate,
      verification_tier = "SILVER",
      property_type,
      bedrooms = 1,
      bathrooms = 1,
      area_sqm = 36,
      address,
      district,
      city,
      latitude,
      longitude,
      images = [],
      amenities = [],
      agent_name = "Mitra Pemilik Tapak",
      agent_phone = "6281234567890",
      nearby_amenities = [],
    } = body;

    // Validasi field utama
    if (
      !title ||
      !price ||
      !property_type ||
      !address ||
      !district ||
      !city ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return NextResponse.json(
        { success: false, error: "Mohon lengkapi seluruh field wajib." },
        { status: 400 }
      );
    }

    // Generate unique slug
    const cleanBase = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const slug = `${cleanBase || "properti"}-${randomSuffix}`;

    const numLat = Number(latitude);
    const numLng = Number(longitude);

    // Simpan listing ke database
    const newListing = await prisma.listing.create({
      data: {
        title: String(title).trim(),
        slug,
        description:
          description ||
          `Unit ${title} berlokasi strategis di kawasan ${district}, ${city}. Terawat dengan baik, berfasilitas lengkap, dan siap huni.`,
        price: Number(price),
        deposit: deposit ? Number(deposit) : null,
        maintenance_fee: maintenance_fee ? Number(maintenance_fee) : null,
        utility_estimate: utility_estimate ? Number(utility_estimate) : null,
        verification_tier: (verification_tier as VerificationTier) || "SILVER",
        property_type: String(property_type),
        bedrooms: Math.max(1, Number(bedrooms) || 1),
        bathrooms: Math.max(1, Number(bathrooms) || 1),
        area_sqm: Number(area_sqm) || 36,
        address: String(address).trim(),
        district: String(district).trim(),
        city: String(city).trim(),
        latitude: numLat,
        longitude: numLng,
        images: Array.isArray(images) && images.length > 0 ? images : [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80"
        ],
        amenities: Array.isArray(amenities) ? amenities : [],
        is_available: true,
        agent_name: String(agent_name).trim(),
        agent_phone: String(agent_phone).trim(),
      },
    });

    // Update PostGIS location geometry point
    try {
      await prisma.$executeRawUnsafe(
        `UPDATE listings SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3`,
        numLng,
        numLat,
        newListing.id
      );
    } catch (geomErr) {
      console.warn("PostGIS location update warning:", geomErr);
    }

    // Simpan fasilitas terdeteksi OSM yang dipilih
    if (Array.isArray(nearby_amenities) && nearby_amenities.length > 0) {
      try {
        const validCategories: Record<string, AmenityCategory> = {
          TRANSPORT: AmenityCategory.TRANSPORT,
          EDUCATION: AmenityCategory.EDUCATION,
          HEALTH: AmenityCategory.HEALTH,
          WORSHIP: AmenityCategory.WORSHIP,
          SHOPPING: AmenityCategory.SHOPPING,
        };

        const amenitiesData = nearby_amenities
          .filter((a) => a && a.name && a.category)
          .map((a) => ({
            listing_id: newListing.id,
            category: validCategories[a.category] || AmenityCategory.TRANSPORT,
            name: String(a.name),
            distance: String(a.distance || a.distanceFormatted || "500 m"),
            duration: String(a.duration || a.durationFormatted || "6 menit jalan kaki"),
            latitude: Number(a.latitude || numLat),
            longitude: Number(a.longitude || numLng),
          }));

        if (amenitiesData.length > 0) {
          await prisma.nearbyAmenity.createMany({
            data: amenitiesData,
          });
        }
      } catch (amenityErr) {
        console.error("Gagal menyimpan relasi nearby_amenities:", amenityErr);
      }
    }

    // Revalidasi cache halaman publik & owner
    try {
      revalidatePath("/explore");
      revalidatePath("/");
      revalidatePath("/owner/properti");
      revalidatePath("/owner/dashboard");
    } catch {
      // Revalidate safe ignore outside request context
    }

    return NextResponse.json({
      success: true,
      message: "Listing properti baru berhasil diterbitkan!",
      data: newListing,
    });
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menyimpan listing ke database." },
      { status: 500 }
    );
  }
}
