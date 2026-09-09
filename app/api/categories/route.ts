import { NextResponse } from "next/server";
import { getCategoryCounts } from "@/lib/listings";

export async function GET() {
  try {
    const counts = await getCategoryCounts();
    return NextResponse.json({ success: true, counts });
  } catch (error) {
    console.error("Error fetching category counts:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kategori." },
      { status: 500 }
    );
  }
}
