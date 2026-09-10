import { NextRequest, NextResponse } from "next/server";
import { uploadToSupabaseStorage } from "@/lib/supabase-storage";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folderParam = formData.get("folder") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File gambar tidak ditemukan dalam permintaan." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Format file tidak didukung. Harap unggah file PNG, JPG, WebP, atau SVG.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Ukuran file melebihi batas maksimum 5MB.",
        },
        { status: 400 }
      );
    }

    const folder =
      folderParam === "branding" || folderParam === "ads"
        ? folderParam
        : "properties";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadToSupabaseStorage({
      buffer,
      fileName: file.name,
      contentType: file.type,
      folder,
    });

    return NextResponse.json({
      success: true,
      message: "Gambar berhasil diunggah ke Supabase Storage.",
      data: {
        url: result.url,
        key: result.key,
        fileName: file.name,
        sizeBytes: file.size,
        contentType: file.type,
        isMock: result.isMock,
      },
    });
  } catch (error: unknown) {
    console.error("[UPLOAD-R2] Gagal mengunggah file:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat mengunggah gambar ke cloud." },
      { status: 500 }
    );
  }
}
