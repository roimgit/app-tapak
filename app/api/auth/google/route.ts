import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/google/callback`;

  // Cek apakah clientId sudah dikonfigurasi dengan kredensial Google asli
  const isConfigured =
    clientId &&
    !clientId.includes("your_google_client_id_here") &&
    clientId.includes(".apps.googleusercontent.com");

  if (!isConfigured) {
    return NextResponse.json(
      {
        status: "ready_awaiting_credentials",
        message:
          "Ekosistem Google OAuth telah siap. Masukkan GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET di file .env Anda.",
        redirectUri,
        googleConsoleUrl: "https://console.cloud.google.com/apis/credentials",
      },
      { status: 200 }
    );
  }

  const scope = encodeURIComponent("openid email profile");
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
