import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!rawEmail || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Akun Super Admin Utama (admin@admin.com)
    if (rawEmail === "admin@admin.com") {
      if (password !== "An1357@$") {
        return NextResponse.json(
          { success: false, error: "Kata sandi Super Admin tidak valid." },
          { status: 401 }
        );
      }

      // Pastikan data tersinkron di PostgreSQL
      let dbAdmin = null;
      try {
        dbAdmin = await prisma.user.upsert({
          where: { email: "admin@admin.com" },
          update: { role: "SUPER_ADMIN", is_verified: true },
          create: {
            email: "admin@admin.com",
            name: "Super Admin",
            phone: "081234567890",
            role: "SUPER_ADMIN",
            is_verified: true,
          },
        });
      } catch (dbErr) {
        console.error("[AUTH-LOGIN] Database upsert admin error:", dbErr);
      }

      return NextResponse.json({
        success: true,
        user: {
          id: dbAdmin?.id || "admin_primary",
          email: "admin@admin.com",
          name: dbAdmin?.name || "Super Admin",
          role: "SUPER_ADMIN",
          type: "admin",
          verified: true,
          loggedInAt: Date.now(),
        },
      });
    }

    // 2. Akun Pengguna / Mitra Lainnya
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Kata sandi minimal 6 karakter." },
        { status: 400 }
      );
    }

    // Cari user di database PostgreSQL
    let dbUser = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: rawEmail },
      });

      // Jika belum ada di DB (misalnya pendaftaran cepat / testing), otomatis simpan ke DB
      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email: rawEmail,
            name: rawEmail.split("@")[0],
            role: "USER",
            is_verified: true,
          },
        });
      }
    } catch (dbErr) {
      console.error("[AUTH-LOGIN] Database lookup/create error:", dbErr);
    }

    const role = dbUser?.role || "USER";

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser?.id || undefined,
        email: rawEmail,
        name: dbUser?.name || rawEmail.split("@")[0],
        role,
        phone: dbUser?.phone || null,
        type: "email",
        verified: dbUser?.is_verified ?? true,
        loggedInAt: Date.now(),
      },
    });
  } catch (error) {
    console.error("[AUTH-LOGIN] Internal server error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat memproses login." },
      { status: 500 }
    );
  }
}
