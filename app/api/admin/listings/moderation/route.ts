import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const MODERATION_SELECT_FIELDS = {
  id: true,
  title: true,
  slug: true,
  price: true,
  property_type: true,
  district: true,
  city: true,
  area_sqm: true,
  images: true,
  verification_tier: true,
  approval_status: true,
  rejection_reason: true,
  is_available: true,
  owner_email: true,
  created_at: true,
  updated_at: true,
} as const;

// In-memory cache untuk respon GET moderasi (TTL 30 detik)
const moderationCache = new Map<string, { body: any; expiresAt: number }>();
const CACHE_TTL_MS = 30_000;

function invalidateModerationCache() {
  moderationCache.clear();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "ALL"; // ALL, PENDING, APPROVED, REJECTED
    const query = searchParams.get("q") || "";
    const cacheKey = `${status}:${query}`;

    const cached = moderationCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return NextResponse.json(cached.body);
    }

    const whereClause: any = {};
    if (status !== "ALL") {
      whereClause.approval_status = status;
    }

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { city: { contains: query, mode: "insensitive" } },
        { district: { contains: query, mode: "insensitive" } },
        { address: { contains: query, mode: "insensitive" } },
      ];
    }

    // Jalankan seluruh query secara paralel via Promise.all (bukan sekuensial)
    const [listings, pendingCount, approvedCount, rejectedCount] = await Promise.all([
      prisma.listing.findMany({
        where: whereClause,
        orderBy: { created_at: "desc" },
        take: 100,
        select: MODERATION_SELECT_FIELDS,
      }),
      prisma.listing.count({
        where: { approval_status: "PENDING" },
      }),
      prisma.listing.count({
        where: { approval_status: "APPROVED" },
      }),
      prisma.listing.count({
        where: { approval_status: "REJECTED" },
      }),
    ]);

    const responseBody = {
      success: true,
      data: listings,
      counts: {
        all: pendingCount + approvedCount + rejectedCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
    };

    moderationCache.set(cacheKey, {
      body: responseBody,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json(responseBody);
  } catch (error: any) {
    console.error("[MODERATION-GET] Error fetching listings for moderation:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat antrean moderasi properti." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, rejection_reason } = body;

    if (!id || !action || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "ID listing dan aksi (APPROVE / REJECT) wajib disertakan." },
        { status: 400 }
      );
    }

    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Listing properti tidak ditemukan." },
        { status: 404 }
      );
    }

    let updatedListing;
    if (action === "APPROVE") {
      updatedListing = await prisma.listing.update({
        where: { id },
        data: {
          approval_status: "APPROVED",
          is_available: true,
          rejection_reason: null,
        },
      });
    } else {
      updatedListing = await prisma.listing.update({
        where: { id },
        data: {
          approval_status: "REJECTED",
          is_available: false,
          rejection_reason: rejection_reason || "Informasi properti belum memenuhi standar Tapak.",
        },
      });
    }

    // Revalidasi cache
    try {
      invalidateModerationCache();
      revalidatePath("/explore");
      revalidatePath("/");
      revalidatePath("/admin/properti");
      revalidatePath("/owner/properti");
    } catch {
      // safe
    }

    return NextResponse.json({
      success: true,
      message:
        action === "APPROVE"
          ? `Listing "${updatedListing.title}" berhasil disetujui dan kini tayang di publik!`
          : `Listing "${updatedListing.title}" ditolak dengan catatan revisi.`,
      data: updatedListing,
    });
  } catch (error: any) {
    console.error("[MODERATION-PATCH] Error moderating listing:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status moderasi properti." },
      { status: 500 }
    );
  }
}
