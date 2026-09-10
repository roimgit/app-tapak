import { createClient, SupabaseClient } from "@supabase/supabase-js";

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

  if (!isSupabaseStorageConfigured) {
    console.warn(
      `[SUPABASE STORAGE] Kredensial belum diisi di .env (NEXT_PUBLIC_SUPABASE_ANON_KEY). Menggunakan URL pratinjau lokal.`
    );
    return {
      url: `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80#${key}`,
      key,
      isMock: true,
    };
  }

  const client = getSupabaseClient();

  const { error: uploadError } = await client.storage
    .from(bucketName)
    .upload(key, buffer, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    // Jika bucket belum ada dan menggunakan service_role, coba buat bucket secara otomatis
    if (uploadError.message?.toLowerCase().includes("bucket not found")) {
      const { error: createBucketError } = await client.storage.createBucket(
        bucketName,
        { public: true }
      );
      if (!createBucketError) {
        await client.storage
          .from(bucketName)
          .upload(key, buffer, { contentType, upsert: true });
      } else {
        throw new Error(
          `Bucket '${bucketName}' belum dibuat di Supabase Storage. Silakan buat bucket publik di dashboard Supabase.`
        );
      }
    } else {
      throw uploadError;
    }
  }

  const { data: publicData } = client.storage
    .from(bucketName)
    .getPublicUrl(key);

  return {
    url: publicData.publicUrl,
    key,
    isMock: false,
  };
}
