import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "ALL"; // ALL, PENDING, APPROVED, REJECTED
    const query = searchParams.get("q") || "";

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

    const listings = await prisma.listing.findMany({
      where: whereClause,
      orderBy: { created_at: "desc" },
      take: 100,
    });

    const pendingCount = await prisma.listing.count({
      where: { approval_status: "PENDING" },
    });
    const approvedCount = await prisma.listing.count({
      where: { approval_status: "APPROVED" },
    });
    const rejectedCount = await prisma.listing.count({
      where: { approval_status: "REJECTED" },
    });

    return NextResponse.json({
      success: true,
      data: listings,
      counts: {
        all: pendingCount + approvedCount + rejectedCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
    });
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
