"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token || !email) {
      setError("Tautan reset kata sandi tidak valid atau parameter tidak lengkap.");
      return;
    }

    if (password.length < 8) {
      setError("Kata sandi baru minimal harus 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok dengan kata sandi baru.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mengatur ulang kata sandi.");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login?reset=success");
      }, 2000);
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan periksa koneksi Anda.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-6">
        <Link href="/" className="flex items-center gap-1 group">
          <span className="brand-wordmark text-2xl font-black tracking-tight text-[#111827]">
            Tapak<span className="text-[#3D77EE]">.</span>
          </span>
          <span className="ml-2 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-[#3D77EE] bg-blue-50 border border-blue-100 rounded-md">
            Reset Password
          </span>
        </Link>
        <Link
          href="/login"
          className="text-xs font-semibold text-[#687280] hover:text-[#3D77EE] transition-colors"
        >
          ← Kembali ke Login
        </Link>
      </div>

      {/* Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-[20px] sm:rounded-[24px] border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-[14px] bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3 text-[#3D77EE]">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            Buat Kata Sandi Baru
          </h1>
          <p className="text-xs text-[#687280] mt-1.5 leading-relaxed">
            Atur ulang kata sandi untuk akun <span className="font-semibold text-[#111827]">{email || "Anda"}</span>.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-[12px] bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">
              Kata Sandi Berhasil Diperbarui!
            </h3>
            <p className="text-xs text-[#687280]">
              Mengarahkan Anda kembali ke halaman login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter..."
                  required
                  minLength={8}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs sm:text-sm font-medium text-[#111827] focus:outline-none focus:bg-white focus:border-[#3D77EE] focus:ring-1 focus:ring-[#3D77EE] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5"
                  aria-label="Toggle Password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[#3D77EE]" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru..."
                  required
                  minLength={8}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs sm:text-sm font-medium text-[#111827] focus:outline-none focus:bg-white focus:border-[#3D77EE] focus:ring-1 focus:ring-[#3D77EE] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5"
                  aria-label="Toggle Confirm Password"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-[#3D77EE]" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-xs sm:text-sm rounded-[10px] shadow-sm shadow-blue-500/20 hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {isLoading ? (
                <span>Menyimpan Kata Sandi...</span>
              ) : (
                <>
                  <span>Simpan Kata Sandi Baru</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer Assurance */}
      <div className="max-w-md w-full mx-auto text-center pt-6">
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#687280]">
          <ShieldCheck className="w-4 h-4 text-[#3D77EE]" />
          <span>Keamanan Data & Privasi Terproteksi Enkripsi SSL 256-bit</span>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F3F6FB] flex items-center justify-center text-xs text-slate-400">
          Memuat halaman pemulihan kata sandi...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
