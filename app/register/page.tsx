"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  UserCheck,
  Building2,
} from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";

function RegisterFormContent() {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"renter" | "owner">("renter");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success State (Email Sent via Resend)
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [devVerificationLink, setDevVerificationLink] = useState<string | null>(null);
  const [sandboxNotice, setSandboxNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validasi Client-side
    if (!name.trim()) {
      setErrorMessage("Nama lengkap wajib diisi.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Format email tidak valid.");
      return;
    }

    if (!phone.trim() || phone.length < 9) {
      setErrorMessage("Nomor WhatsApp/HP minimal 9 digit.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok dengan kata sandi.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Anda harus menyetujui Ketentuan Layanan & Kebijakan Privasi.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          userType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Gagal melakukan pendaftaran.");
        setIsLoading(false);
        return;
      }

      setRegisteredEmail(data.email || email);
      if (data.verificationLink) {
        setDevVerificationLink(data.verificationLink);
      }
      if (data.notice) {
        setSandboxNotice(data.notice);
      }

      setRegisteredSuccess(true);
      setIsLoading(false);
    } catch {
      setErrorMessage("Terjadi gangguan koneksi internet. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  const loginHref = redirectParam
    ? `/login?redirect=${encodeURIComponent(redirectParam)}`
    : "/login";

  return (
    <div className="min-h-screen bg-[#F3F6FB] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-6">
        <Link href="/" className="flex items-center gap-1 group">
          <span className="brand-wordmark text-2xl font-black tracking-tight text-[#111827]">
            Tapak<span className="text-[#3D77EE]">.</span>
          </span>
          <span className="ml-2 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-[#3D77EE] bg-blue-50 border border-blue-100 rounded-md">
            Daftar Akun
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href="/"
            className="text-xs font-semibold text-[#687280] hover:text-[#3D77EE] transition-colors"
          >
            ← Beranda
          </Link>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-[20px] sm:rounded-[24px] border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
        {registeredSuccess ? (
          /* Tampilan Berhasil Kirim Verifikasi Email */
          <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-[20px] bg-blue-50 border border-blue-200 text-[#3D77EE] flex items-center justify-center mx-auto shadow-sm shadow-blue-500/10">
              <Mail className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Email Verifikasi Terkirim</span>
            </div>

            <h2 className="text-xl font-extrabold text-[#111827]">
              Cek Kotak Masuk Email Anda!
            </h2>

            <p className="text-xs text-[#687280] leading-relaxed">
              Kami telah mengirimkan tautan verifikasi akun ke alamat:
              <br />
              <strong className="text-[#111827] text-sm">{registeredEmail}</strong>
            </p>

            <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200 text-left text-xs text-[#4B5563] space-y-1.5">
              <p className="font-semibold text-[#111827]">Langkah Selanjutnya:</p>
              <ol className="list-decimal list-inside space-y-1 text-[11px]">
                <li>Buka aplikasi email Anda (Gmail/Outlook/Yahoo).</li>
                <li>Klik tombol <strong>&quot;Verifikasi Email Saya&quot;</strong> di dalam email dari Tapak.</li>
                <li>Setelah terverifikasi, Anda dapat langsung menghubungi agen dan menyewa hunian.</li>
              </ol>
            </div>

            {sandboxNotice && (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-[10px] border border-amber-200 text-left">
                ℹ️ {sandboxNotice}
              </p>
            )}

            {/* Quick Test link in Localhost Dev */}
            {devVerificationLink && (
              <div className="p-3.5 rounded-[12px] bg-blue-50 border border-blue-200 text-left">
                <span className="text-[11px] font-bold text-[#3D77EE] block mb-1">
                  🔗 Tautan Verifikasi Cepat (Pengujian Dev):
                </span>
                <a
                  href={devVerificationLink}
                  className="text-xs text-[#1E3A8A] font-bold underline hover:text-[#3D77EE] flex items-center gap-1.5 break-all"
                >
                  <span>Klik untuk Verifikasi Akun Sekarang</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            )}

            <div className="pt-3">
              <Link
                href={loginHref}
                className="w-full py-3 px-4 bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-xs sm:text-sm rounded-[10px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Masuk ke Akun Saya</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Form Pendaftaran */
          <>
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
                Buat Akun Tapak.
              </h1>
              <p className="text-xs text-[#687280] mt-1.5 leading-relaxed">
                Daftar sekarang untuk menghubungi agen, menjadwalkan survey, dan menikmati sewa hunian transparan.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-[12px] bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Role Selection Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-[12px] mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setUserType("renter")}
                className={`py-2 px-3 rounded-[9px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  userType === "renter"
                    ? "bg-white text-[#3D77EE] shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Pencari Hunian</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType("owner")}
                className={`py-2 px-3 rounded-[9px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  userType === "owner"
                    ? "bg-white text-[#3D77EE] shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Pemilik / Agen</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs sm:text-sm font-medium text-[#111827] focus:outline-none focus:bg-white focus:border-[#3D77EE] focus:ring-1 focus:ring-[#3D77EE] transition-all"
                  />
                </div>
              </div>

              {/* Alamat Email */}
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Alamat Email (Untuk Verifikasi)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="roim9229@gmail.com"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs sm:text-sm font-medium text-[#111827] focus:outline-none focus:bg-white focus:border-[#3D77EE] focus:ring-1 focus:ring-[#3D77EE] transition-all"
                  />
                </div>
              </div>

              {/* Nomor WhatsApp / Telepon */}
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Nomor WhatsApp / HP
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs sm:text-sm font-medium text-[#111827] focus:outline-none focus:bg-white focus:border-[#3D77EE] focus:ring-1 focus:ring-[#3D77EE] transition-all"
                  />
                </div>
              </div>

              {/* Kata Sandi */}
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Kata Sandi (Min. 6 Karakter)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter..."
                    required
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs sm:text-sm font-medium text-[#111827] focus:outline-none focus:bg-white focus:border-[#3D77EE] focus:ring-1 focus:ring-[#3D77EE] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-md cursor-pointer"
                    aria-label="Toggle password"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-[#3D77EE]" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Sandi */}
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi..."
                    required
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs sm:text-sm font-medium text-[#111827] focus:outline-none focus:bg-white focus:border-[#3D77EE] focus:ring-1 focus:ring-[#3D77EE] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-md cursor-pointer"
                    aria-label="Toggle confirm password"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-[#3D77EE]" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Checkbox Syarat & Ketentuan */}
              <div className="flex items-start pt-1">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#3D77EE] border-[#E2E8F0] focus:ring-[#3D77EE] mt-0.5 cursor-pointer"
                />
                <label
                  htmlFor="agree-terms"
                  className="ml-2 text-xs text-[#687280] leading-relaxed cursor-pointer"
                >
                  Saya menyetujui{" "}
                  <span className="text-[#3D77EE] font-semibold">Ketentuan Layanan</span> &{" "}
                  <span className="text-[#3D77EE] font-semibold">Kebijakan Privasi</span> Tapak.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-xs sm:text-sm rounded-[10px] shadow-sm shadow-blue-500/20 hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Mengirim Email Verifikasi...</span>
                ) : (
                  <>
                    <span>Daftar & Kirim Email Verifikasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-[#687280]">
                Sudah memiliki akun?{" "}
                <Link
                  href={loginHref}
                  className="font-bold text-[#3D77EE] hover:text-[#2B55AB]"
                >
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer Assurance */}
      <div className="max-w-md w-full mx-auto text-center pt-6">
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#687280]">
          <ShieldCheck className="w-4 h-4 text-[#3D77EE]" />
          <span>Verifikasi Identitas & Transparansi Properti Terjamin</span>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F3F6FB] flex items-center justify-center text-xs text-slate-400">
          Memuat halaman pendaftaran...
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
