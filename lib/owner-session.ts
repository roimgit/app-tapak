import { cookies } from "next/headers";

/**
 * Mendapatkan email pemilik (owner) yang sedang aktif di Studio Owner.
 * Membaca dari cookie tapak_session_email atau tapak_google_session.
 * Fallback aman ke "admin@admin.com" jika belum terdeteksi.
 */
export async function getCurrentOwnerEmail(): Promise<string> {
  try {
    const cookieStore = await cookies();

    // 1. Cek cookie sesi login langsung (tapak_session_email)
    const sessionEmail = cookieStore.get("tapak_session_email")?.value;
    if (sessionEmail) {
      const decoded = decodeURIComponent(sessionEmail).toLowerCase().trim();
      if (decoded && decoded.includes("@")) {
        return decoded;
      }
    }

    // 2. Cek cookie sesi Google OAuth (tapak_google_session)
    const googleSession = cookieStore.get("tapak_google_session")?.value;
    if (googleSession) {
      try {
        const parsed = JSON.parse(googleSession);
        if (parsed?.email && typeof parsed.email === "string") {
          const clean = parsed.email.toLowerCase().trim();
          if (clean.includes("@")) return clean;
        }
      } catch {
        // ignore JSON parse error
      }
    }
  } catch {
    // ignore server environment error
  }

  return "admin@admin.com";
}
