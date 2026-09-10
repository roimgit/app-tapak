import { NextRequest, NextResponse } from "next/server";
import { getAdBookings, saveAdBookings, AdBookingData, AdSlotType } from "@/lib/ad-slots";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerEmail = searchParams.get("ownerEmail");
    const slotType = searchParams.get("slotType") as AdSlotType | null;
    const status = searchParams.get("status"); // ALL, PENDING, APPROVED, REJECTED, ACTIVE_TODAY

    let bookings = getAdBookings();

    if (ownerEmail) {
      bookings = bookings.filter(
        (b) => b.ownerEmail.toLowerCase() === ownerEmail.toLowerCase()
      );
    }

    if (slotType) {
      bookings = bookings.filter((b) => b.slotType === slotType);
    }

    if (status && status !== "ALL") {
      if (status === "ACTIVE_TODAY") {
        const todayStr = new Date().toISOString().split("T")[0];
        bookings = bookings.filter(
          (b) =>
            b.status === "APPROVED" &&
            b.isActive &&
            b.startDate <= todayStr &&
            b.endDate >= todayStr
        );
      } else {
        bookings = bookings.filter((b) => b.status === status);
      }
    }

    // Urutkan dari yang paling baru diajukan
    bookings.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const allBookings = getAdBookings();
    const counts = {
      all: allBookings.length,
      pending: allBookings.filter((b) => b.status === "PENDING").length,
      approved: allBookings.filter((b) => b.status === "APPROVED").length,
      rejected: allBookings.filter((b) => b.status === "REJECTED").length,
    };

    return NextResponse.json({ success: true, data: bookings, counts });
  } catch (error: any) {
    console.error("[ADS-BOOKINGS-GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data booking iklan." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slotType,
      ownerEmail,
      ownerName,
      title,
      tag,
      subtitle,
      imageUrl,
      targetUrl,
      ctaText = "Lihat Unit",
      startDate,
      endDate,
      paymentSource = "PAID",
      amountPaid = 0,
    } = body;

    if (!slotType || !ownerEmail || !title || !imageUrl || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Mohon lengkapi seluruh data wajib (tipe slot, email, judul, gambar, jadwal tayang).",
        },
        { status: 400 }
      );
    }

    const currentBookings = getAdBookings();

    const newBooking: AdBookingData = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      slotType: slotType as AdSlotType,
      ownerEmail: ownerEmail.trim().toLowerCase(),
      ownerName: ownerName || ownerEmail.split("@")[0],
      title: title.trim(),
      tag: tag ? tag.trim() : slotType === "BILLBOARD_HOME" ? "DEVELOPER RESMI" : "PROMO KHUSUS",
      subtitle: subtitle ? subtitle.trim() : "",
      imageUrl: imageUrl.trim(),
      targetUrl: targetUrl ? targetUrl.trim() : "/explore",
      ctaText: ctaText.trim(),
      startDate: String(startDate).split("T")[0],
      endDate: String(endDate).split("T")[0],
      paymentSource: paymentSource === "PACKAGE_INCLUDED" ? "PACKAGE_INCLUDED" : "PAID",
      amountPaid: Number(amountPaid) || 0,
      status: "PENDING", // Wajib melalui tahap persetujuan Admin
      rejectionNote: null,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...currentBookings];
    saveAdBookings(updated);

    return NextResponse.json({
      success: true,
      message:
        "Pengajuan slot iklan berhasil dikirim! Materi iklan Anda saat ini berstatus 'Menunggu Kurasi' oleh Tim Administrator.",
      data: newBooking,
    });
  } catch (error: any) {
    console.error("[ADS-BOOKINGS-POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan pengajuan slot iklan." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, rejectionNote } = body;

    if (!id || !action || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "ID booking dan aksi (APPROVE / REJECT) wajib disertakan." },
        { status: 400 }
      );
    }

    const currentBookings = getAdBookings();
    const index = currentBookings.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Data booking iklan tidak ditemukan." },
        { status: 404 }
      );
    }

    const target = currentBookings[index];
    if (action === "APPROVE") {
      target.status = "APPROVED";
      target.rejectionNote = null;
      target.isActive = true;
    } else {
      target.status = "REJECTED";
      target.rejectionNote =
        rejectionNote || "Materi iklan belum memenuhi standar resolusi atau kelayakan konten Tapak.";
      target.isActive = false;
    }

    currentBookings[index] = target;
    saveAdBookings(currentBookings);

    try {
      revalidatePath("/");
      revalidatePath("/admin/beranda");
    } catch {
      // safe
    }

    return NextResponse.json({
      success: true,
      message:
        action === "APPROVE"
          ? `Materi iklan "${target.title}" berhasil disetujui dan dijadwalkan tayang!`
          : `Materi iklan "${target.title}" ditolak dengan catatan revisi untuk owner.`,
      data: target,
    });
  } catch (error: any) {
    console.error("[ADS-BOOKINGS-PATCH] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status moderasi booking iklan." },
      { status: 500 }
    );
  }
}
