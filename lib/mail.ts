import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

interface SendPasswordResetEmailParams {
  toEmail: string;
  resetLink: string;
}

export async function sendPasswordResetEmail({
  toEmail,
  resetLink,
}: SendPasswordResetEmailParams) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F6FB; margin: 0; padding: 32px 16px; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 18px; border: 1px solid #E2E8F0; padding: 36px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
          .brand { font-size: 26px; font-weight: 900; color: #111827; letter-spacing: -0.5px; margin-bottom: 24px; }
          .brand span { color: #3D77EE; }
          .title { font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 12px; }
          .text { font-size: 14px; color: #4B5563; line-height: 1.6; margin-bottom: 24px; }
          .button-wrapper { text-align: center; margin: 32px 0; }
          .button { display: inline-block; background-color: #3D77EE; color: #ffffff !important; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 2px 8px rgba(61,119,238,0.25); }
          .expiry { font-size: 12px; color: #9CA3AF; background: #F9FAFB; padding: 12px; border-radius: 8px; border: 1px solid #E5E7EB; margin-top: 24px; }
          .footer { font-size: 11px; color: #9CA3AF; text-align: center; margin-top: 28px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">Tapak<span>.</span></div>
          <div class="title">Atur Ulang Kata Sandi Akun Anda</div>
          <p class="text">
            Halo Mitra Tapak,<br><br>
            Kami menerima permintaan untuk mengatur ulang kata sandi akun Tapak. yang terhubung dengan alamat email <strong>${toEmail}</strong>.
          </p>
          <div class="button-wrapper">
            <a href="${resetLink}" class="button" target="_blank">Reset Kata Sandi Sekarang</a>
          </div>
          <p class="text" style="font-size: 12px; word-break: break-all;">
            Jika tombol di atas tidak berfungsi, salin dan tempel tautan berikut di peramban Anda:<br>
            <a href="${resetLink}" style="color: #3D77EE;">${resetLink}</a>
          </p>
          <div class="expiry">
            ⏱️ Tautan ini aman dan hanya berlaku selama <strong>15 menit</strong>. Jika Anda tidak merasa meminta reset kata sandi, Anda dapat mengabaikan email ini dengan aman.
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Tapak. Platform Properti Terverifikasi & Transparan.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: "Tapak. <onboarding@resend.dev>",
      to: toEmail,
      subject: "Atur Ulang Kata Sandi Akun Tapak.",
      html: htmlContent,
    });

    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Resend delivery error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal mengirim email",
    };
  }
}

interface SendAccountVerificationEmailParams {
  toEmail: string;
  name?: string;
  verificationLink: string;
}

export async function sendAccountVerificationEmail({
  toEmail,
  name,
  verificationLink,
}: SendAccountVerificationEmailParams) {
  const greetingName = name ? name : "Pengguna Tapak";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F6FB; margin: 0; padding: 32px 16px; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 18px; border: 1px solid #E2E8F0; padding: 36px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
          .brand { font-size: 26px; font-weight: 900; color: #111827; letter-spacing: -0.5px; margin-bottom: 24px; }
          .brand span { color: #3D77EE; }
          .title { font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 12px; }
          .text { font-size: 14px; color: #4B5563; line-height: 1.6; margin-bottom: 24px; }
          .button-wrapper { text-align: center; margin: 32px 0; }
          .button { display: inline-block; background-color: #3D77EE; color: #ffffff !important; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 2px 8px rgba(61,119,238,0.25); }
          .feature-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin: 20px 0; }
          .feature-item { font-size: 13px; color: #334155; margin-bottom: 8px; }
          .expiry { font-size: 12px; color: #9CA3AF; background: #F9FAFB; padding: 12px; border-radius: 8px; border: 1px solid #E5E7EB; margin-top: 24px; }
          .footer { font-size: 11px; color: #9CA3AF; text-align: center; margin-top: 28px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">Tapak<span>.</span></div>
          <div class="title">Verifikasi Akun Tapak. Anda</div>
          <p class="text">
            Halo <strong>${greetingName}</strong>,<br><br>
            Terima kasih telah mendaftar di <strong>Tapak.</strong> Platform pencarian dan sewa hunian terverifikasi dengan transparansi biaya tanpa kompromi.<br><br>
            Untuk mengaktifkan akun Anda dan mulai menghubungi agen/pemilik properti atau memasang listing sewa, silakan klik tombol verifikasi di bawah ini:
          </p>
          <div class="button-wrapper">
            <a href="${verificationLink}" class="button" target="_blank">Verifikasi Email Saya</a>
          </div>
          <div class="feature-box">
            <div class="feature-item">✓ <strong>Akses Langsung Kontak Agen:</strong> Chat WhatsApp & hubungi agen terlisensi tanpa batas.</div>
            <div class="feature-item">✓ <strong>Transparansi IPL & Utilitas:</strong> Informasi sewa terverifikasi tanpa biaya tersembunyi.</div>
            <div class="feature-item">✓ <strong>Simpan Favorit:</strong> Pantau hunian impian Anda di berbagai kota.</div>
          </div>
          <p class="text" style="font-size: 12px; word-break: break-all;">
            Atau salin tautan verifikasi ini di peramban Anda:<br>
            <a href="${verificationLink}" style="color: #3D77EE;">${verificationLink}</a>
          </p>
          <div class="expiry">
            ⏱️ Tautan verifikasi ini berlaku selama <strong>24 jam</strong>. Jika Anda tidak pernah mendaftarkan akun di Tapak., abaikan email ini.
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Tapak. Platform Properti Terverifikasi & Transparan.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: "Tapak. <onboarding@resend.dev>",
      to: toEmail,
      subject: "Verifikasi Alamat Email Akun Tapak. Anda",
      html: htmlContent,
    });

    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Resend account verification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal mengirim email verifikasi",
    };
  }
}
