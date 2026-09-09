import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error || "no_code")}`, baseUrl)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${baseUrl}${request.nextUrl.pathname}`;

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error("Google OAuth token exchange error:", tokenData);
      return NextResponse.redirect(new URL("/login?error=token_failed", baseUrl));
    }

    // Ambil profile info user
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    // Buat response redirect ke dashboard pemilik
    const response = NextResponse.redirect(
      new URL("/owner/dashboard?auth=google_success", baseUrl)
    );

    // Set cookie sesi sementara (HTTP-only)
    response.cookies.set("tapak_google_session", JSON.stringify({
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
    }), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("Error in Google OAuth callback:", err);
    return NextResponse.redirect(new URL("/owner/dashboard?auth=demo", baseUrl));
  }
}
