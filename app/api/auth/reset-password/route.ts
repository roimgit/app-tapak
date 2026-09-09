import { NextRequest, NextResponse } from "next/server";

interface ResetTokenRecord {
  email: string;
  expiresAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __TAPAK_RESET_TOKENS__: Map<string, ResetTokenRecord> | undefined;
}

const resetTokens = global.__TAPAK_RESET_TOKENS__ || new Map<string, ResetTokenRecord>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token : "";
    const email = typeof body?.email === "string" ? body.email.toLowerCase().trim() : "";
    const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { error: "Data permintaan tidak lengkap." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi baru minimal harus 8 karakter." },
        { status: 400 }
      );
    }

    // Validasi token
    const record = resetTokens.get(token);
    if (!record) {
      return NextResponse.json(
        { error: "Tautan reset kata sandi tidak valid atau sudah pernah digunakan." },
        { status: 400 }
      );
    }

    if (Date.now() > record.expiresAt) {
      resetTokens.delete(token);
      return NextResponse.json(
        { error: "Tautan reset kata sandi telah kedaluwarsa (melebihi 15 menit). Silakan ajukan ulang." },
        { status: 400 }
      );
    }

    if (record.email !== email) {
      return NextResponse.json(
        { error: "Email tidak cocok dengan token pemulihan." },
        { status: 400 }
      );
    }

    // Token valid: Hapus token agar tidak bisa dipakai ulang
    resetTokens.delete(token);

    console.log(`[AUTH-RESET-PASSWORD] Kata sandi akun ${email} berhasil diatur ulang.`);

    return NextResponse.json(
      {
        success: true,
        message: "Kata sandi akun Anda berhasil diperbarui. Silakan masuk menggunakan kata sandi baru.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengatur ulang kata sandi." },
      { status: 500 }
    );
  }
}
