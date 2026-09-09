import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieSession = request.cookies.get("tapak_google_session")?.value;
  if (!cookieSession) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const parsed = JSON.parse(cookieSession);
    if (parsed && parsed.email) {
      return NextResponse.json({
        authenticated: true,
        user: {
          email: parsed.email,
          name: parsed.name || parsed.email.split("@")[0],
          picture: parsed.picture || null,
          role: parsed.email === "admin@admin.com" ? "SUPER_ADMIN" : "USER",
          type: "google",
        },
      });
    }
  } catch {
    // ignore
  }

  return NextResponse.json({ authenticated: false, user: null });
}
