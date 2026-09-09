import { NextRequest, NextResponse } from "next/server";
import { sendAccountVerificationEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

interface VerificationTokenRecord {
  email: string;
  name: string;
  phone: string;
  userType: string;
  expiresAt: number;
  verified: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __TAPAK_VERIFICATION_TOKENS__: Map<string, VerificationTokenRecord> | undefined;
}

const verificationTokens =
  global.__TAPAK_VERIFICATION_TOKENS__ || new Map<string, VerificationTokenRecord>();
global.__TAPAK_VERIFICATION_TOKENS__ = verificationTokens;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const rawEmail = typeof body?.email === "string" ? body.email.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const userType = body?.userType === "owner" ? "owner" : "user";

    // 1. Validasi Input
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Nama lengkap wajib diisi minimal 2 karakter." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rawEmail || !emailRegex.test(rawEmail)) {
      return NextResponse.json(
        { error: "Format alamat email tidak valid. Silakan periksa kembali." },
        { status: 400 }
      );
    }

    if (!phone || phone.length < 9) {
      return NextResponse.json(
        { error: "Nomor telepon / WhatsApp wajib diisi minimal 9 digit." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi wajib diisi minimal 6 karakter." },
        { status: 400 }
      );
    }

    const email = rawEmail.toLowerCase();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 2. Buat Token Verifikasi (UUID) - Berlaku 24 jam
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    verificationTokens.set(token, {
      email,
      name,
      phone,
      userType,
      expiresAt,
      verified: false,
    });

    // Simpan data calon user ke database PostgreSQL
    try {
      await prisma.user.upsert({
        where: { email },
        update: {
          name,
          phone,
          role: userType === "owner" ? "OWNER" : "USER",
        },
        create: {
          email,
          name,
          phone,
          role: userType === "owner" ? "OWNER" : "USER",
          is_verified: false,
        },
      });
    } catch (dbErr) {
      console.error("[AUTH-REGISTER] Database upsert error:", dbErr);
    }

    const verificationLink = `${baseUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    // 3. Kirim Email Verifikasi melalui Resend
    const sendResult = await sendAccountVerificationEmail({
      toEmail: email,
      name,
      verificationLink,
    });

    console.log(`[AUTH-REGISTER] Akun baru didaftarkan: ${email} (${name})`);
    console.log(`  Link Verifikasi: ${verificationLink}`);
    console.log(`  Resend Status:`, sendResult);

    let notice = undefined;
    if (!sendResult.success) {
      notice =
        "Resend Sandbox dibatasi untuk email tujuan roim9229@gmail.com. Untuk pengujian di localhost, Anda dapat langsung mengklik tautan aktivasi di bawah.";
    }

    return NextResponse.json(
      {
        success: true,
        message: `Email verifikasi telah berhasil dikirim ke ${email}.`,
        email,
        name,
        deliveredViaResend: sendResult.success,
        verificationLink: process.env.NODE_ENV === "development" ? verificationLink : undefined,
        notice,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kendala saat memproses pendaftaran akun." },
      { status: 500 }
    );
  }
}
