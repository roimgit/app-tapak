import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/lib/listings";
import { BoundsFilter, ListingFilters, VerificationTier } from "@/lib/types";

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
