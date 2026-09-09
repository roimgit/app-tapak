import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE: Hapus listing dari database
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID listing tidak valid." },
        { status: 400 }
      );
    }

    // Periksa apakah listing ada di database
    const existing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true },
    });

    if (existing) {
      // Hapus fasilitas sekitar terkait jika ada
      try {
        await prisma.nearbyAmenity.deleteMany({
          where: { listing_id: id },
        });
      } catch (amenityErr) {
        console.warn("Notice: Kendala pembersihan fasilitas sekitar:", amenityErr);
      }

      // Hapus listing
      await prisma.listing.delete({
        where: { id },
      });
    }

    revalidatePath("/explore");
    revalidatePath("/");
    revalidatePath("/owner/properti");
    revalidatePath("/owner/dashboard");

    return NextResponse.json({
      success: true,
      message: "Listing berhasil dihapus.",
    });
  } catch (error: any) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menghapus listing." },
      { status: 500 }
    );
  }
}

// PATCH: Update status ketersediaan atau detail listing
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID listing tidak valid." },
        { status: 400 }
      );
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        ...(body.is_available !== undefined && { is_available: Boolean(body.is_available) }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.title !== undefined && { title: String(body.title) }),
      },
    });

    revalidatePath("/explore");
    revalidatePath("/");
    revalidatePath("/owner/properti");
    revalidatePath("/owner/dashboard");

    return NextResponse.json({
      success: true,
      message: "Status listing berhasil diperbarui.",
      data: updatedListing,
    });
  } catch (error: any) {
    console.error("Error updating listing:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memperbarui listing." },
      { status: 500 }
    );
  }
}
