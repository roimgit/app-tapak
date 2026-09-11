import { createClient, SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://hrsqlysprutfgjxdfimb.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "tapak-media";

export const isSupabaseStorageConfigured = Boolean(supabaseUrl && supabaseKey);

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseKey);
  }
  return cachedClient;
}

export interface UploadResult {
  url: string;
  key: string;
  isMock?: boolean;
}

/**
 * Menyimpan file secara lokal di direktori public/uploads/
 * Memastikan gambar yang diunggah pengguna (logo, favicon, banner, listing)
 * benar-benar tersimpan dan disajikan secara nyata tanpa placeholder dummy.
 */
function saveFileLocally(buffer: Buffer, key: string): UploadResult {
  const normalizedKey = key.replace(/\\/g, "/");
  const targetDir = path.join(process.cwd(), "public", "uploads", path.dirname(normalizedKey));

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(process.cwd(), "public", "uploads", normalizedKey);
  fs.writeFileSync(filePath, buffer);

  return {
    url: `/uploads/${normalizedKey}`,
    key: normalizedKey,
    isMock: false,
  };
}

export async function uploadToSupabaseStorage({
  buffer,
  fileName,
  contentType,
  folder,
}: {
  buffer: Buffer;
  fileName: string;
  contentType: string;
  folder: "branding" | "properties" | "ads";
}): Promise<UploadResult> {
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uniqueId = Math.random().toString(36).substring(2, 9);
  const key = `${folder}/${Date.now()}_${uniqueId}_${sanitizedName}`;

  // Jika kredensial Supabase Storage belum diset di .env, simpan file asli langsung ke public/uploads/
  if (!isSupabaseStorageConfigured) {
    return saveFileLocally(buffer, key);
  }

  try {
    const client = getSupabaseClient();

    const { error: uploadError } = await client.storage
      .from(bucketName)
      .upload(key, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      // Jika bucket belum ada di Supabase, coba buat bucket publik
      if (uploadError.message?.toLowerCase().includes("bucket not found")) {
        const { error: createBucketError } = await client.storage.createBucket(
          bucketName,
          { public: true }
        );
        if (!createBucketError) {
          const { error: retryError } = await client.storage
            .from(bucketName)
            .upload(key, buffer, { contentType, upsert: true });

          if (!retryError) {
            const { data: publicData } = client.storage.from(bucketName).getPublicUrl(key);
            return { url: publicData.publicUrl, key, isMock: false };
          }
        }
      }

      // Jika gagal di Supabase, fallback simpan file fisik lokal asli
      console.warn(`[STORAGE] Gagal upload ke Supabase (${uploadError.message}), menyimpan file secara lokal.`);
      return saveFileLocally(buffer, key);
    }

    const { data: publicData } = client.storage.from(bucketName).getPublicUrl(key);

    return {
      url: publicData.publicUrl,
      key,
      isMock: false,
    };
  } catch (err) {
    console.warn("[STORAGE] Terjadi kesalahan saat upload ke Supabase, menyimpan file secara lokal:", err);
    return saveFileLocally(buffer, key);
  }
}
