import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/mail";

// Penyimpanan token reset sementara di memori server (15 menit)
interface ResetTokenRecord {
  email: string;
  expiresAt: number;
}

// Global store to persist across requests in development
declare global {
  // eslint-disable-next-line no-var
  var __TAPAK_RESET_TOKENS__: Map<string, ResetTokenRecord> | undefined;
}

const resetTokens = global.__TAPAK_RESET_TOKENS__ || new Map<string, ResetTokenRecord>();
global.__TAPAK_RESET_TOKENS__ = resetTokens;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawEmail = typeof body?.email === "string" ? body.email.trim() : "";

    // 1. Validasi Format Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rawEmail || !emailRegex.test(rawEmail)) {
      return NextResponse.json(
        { error: "Format alamat email tidak valid. Silakan periksa kembali." },
        { status: 400 }
      );
    }

    const email = rawEmail.toLowerCase();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 2. Generate Token Reset Aman (Crypto UUID)
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 15 * 60 * 1000; // Berlaku 15 menit

    resetTokens.set(token, { email, expiresAt });

    const resetLink = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // 3. Kirim Email melalui Resend ke Email yang Diinput User Secara Dinamis
    const sendResult = await sendPasswordResetEmail({
      toEmail: email,
      resetLink,
    });

    console.log(`[AUTH-FORGOT-PASSWORD] Permintaan reset untuk ${email}:`);
    console.log(`  Reset Link: ${resetLink}`);
    console.log(`  Resend Status:`, sendResult);

    // Catatan untuk Akun Uji Coba Resend (Sandbox Mode):
    // Resend sandbox mengizinkan pengiriman langsung ke email akun terverifikasi (roim9229@gmail.com).
    // Jika user menginput email lain saat domain kustom belum diverifikasi di Resend,
    // kita tetap berikan resetLink di respons untuk kemudahan pengujian di localhost.
    let notice = undefined;
    if (!sendResult.success) {
      notice =
        "Akun Resend Sandbox saat ini dibatasi untuk mengirim email ke roim9229@gmail.com. Untuk email lain di localhost, Anda dapat menggunakan tautan reset langsung di bawah.";
    }

    return NextResponse.json(
      {
        success: true,
        message: `Instruksi pemulihan kata sandi telah diproses untuk ${email}.`,
        email,
        deliveredViaResend: sendResult.success,
        resetLink: process.env.NODE_ENV === "development" ? resetLink : undefined,
        notice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Terjadi kendala saat memproses permintaan reset kata sandi." },
      { status: 500 }
    );
  }
}
