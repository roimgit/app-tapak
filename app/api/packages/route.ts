import { NextRequest, NextResponse } from "next/server";
import { getPackagesConfig, savePackagesConfig, PackageDefinition } from "@/lib/package-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const packages = getPackagesConfig();
    return NextResponse.json({ success: true, data: packages });
  } catch (error: any) {
    console.error("[PACKAGES-GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar paket iklan." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packages } = body;

    if (!Array.isArray(packages)) {
      return NextResponse.json(
        { success: false, error: "Payload paket iklan harus berupa array." },
        { status: 400 }
      );
    }

    const saved = savePackagesConfig(packages as PackageDefinition[]);
    return NextResponse.json({
      success: true,
      message: "Konfigurasi tarif dan keuntungan paket iklan berhasil disimpan!",
      data: saved,
    });
  } catch (error: any) {
    console.error("[PACKAGES-POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan konfigurasi paket iklan." },
      { status: 500 }
    );
  }
}
