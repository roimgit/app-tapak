import { NextRequest, NextResponse } from "next/server";
import { getAdSlotsConfig, saveAdSlotsConfig, AdSlotDefinition } from "@/lib/ad-slots";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slots = getAdSlotsConfig();
    return NextResponse.json({ success: true, data: slots });
  } catch (error: any) {
    console.error("[ADS-SLOTS-GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat konfigurasi slot iklan." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slots } = body;

    if (!Array.isArray(slots)) {
      return NextResponse.json(
        { success: false, error: "Format payload slots tidak valid." },
        { status: 400 }
      );
    }

    const saved = saveAdSlotsConfig(slots as AdSlotDefinition[]);
    return NextResponse.json({
      success: true,
      message: "Tarif dan konfigurasi slot iklan berhasil diperbarui oleh Admin.",
      data: saved,
    });
  } catch (error: any) {
    console.error("[ADS-SLOTS-POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan konfigurasi slot iklan." },
      { status: 500 }
    );
  }
}
