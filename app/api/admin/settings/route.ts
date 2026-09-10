import { NextResponse } from "next/server";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings-server";

export async function GET() {
  try {
    const settings = getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat pengaturan situs", settings: DEFAULT_SITE_SETTINGS },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updatedSettings = saveSiteSettings(body);
    return NextResponse.json({
      success: true,
      message: "Pengaturan situs berhasil diperbarui",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("POST /api/admin/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan pengaturan situs" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const reset = saveSiteSettings(DEFAULT_SITE_SETTINGS);
    return NextResponse.json({
      success: true,
      message: "Pengaturan berhasil dikembalikan ke standar awal",
      settings: reset,
    });
  } catch (error) {
    console.error("DELETE /api/admin/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mereset pengaturan" },
      { status: 500 }
    );
  }
}
