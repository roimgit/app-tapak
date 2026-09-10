import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const cookieSession = request.cookies.get("tapak_google_session")?.value;
  if (!cookieSession) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const parsed = JSON.parse(cookieSession);
    if (parsed && parsed.email) {
      const cleanEmail = typeof parsed.email === "string" ? parsed.email.toLowerCase().trim() : "";

      if (cleanEmail) {
        // Cari atau sinkronkan akun Google ke database PostgreSQL
        let dbUser = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });

        // Jika user Google belum tersimpan di DB, simpan otomatis
        if (!dbUser) {
          try {
            dbUser = await prisma.user.create({
              data: {
                email: cleanEmail,
                name: parsed.name || cleanEmail.split("@")[0],
                role: cleanEmail === "admin@admin.com" ? "SUPER_ADMIN" : "USER",
                is_verified: true,
              },
            });
          } catch (createErr) {
            console.error("[AUTH-ME] Gagal auto-create akun Google di DB:", createErr);
          }
        }

        const role = dbUser?.role || (cleanEmail === "admin@admin.com" ? "SUPER_ADMIN" : "USER");

        return NextResponse.json({
          authenticated: true,
          user: {
            id: dbUser?.id || undefined,
            email: cleanEmail,
            name: dbUser?.name || parsed.name || cleanEmail.split("@")[0],
            picture: parsed.picture || null,
            role,
            type: "google",
            verified: dbUser?.is_verified ?? true,
          },
        });
      }
    }
  } catch (err) {
    console.error("[AUTH-ME] Error processing session:", err);
  }

  return NextResponse.json({ authenticated: false, user: null });
}
