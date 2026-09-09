"use client";

import React from "react";
import Link from "next/link";
import { Lock, X, ArrowRight, ShieldCheck, UserPlus, LogIn, MessageCircle } from "lucide-react";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName?: string;
  redirectUrl?: string;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  targetName = "Agen / Pemilik Properti",
  redirectUrl,
}: LoginRequiredModalProps) {
  if (!isOpen) return null;

  const currentPath = redirectUrl || (typeof window !== "undefined" ? window.location.pathname : "/");
  const loginHref = `/login?redirect=${encodeURIComponent(currentPath)}`;
  const registerHref = `/register?redirect=${encodeURIComponent(currentPath)}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[24px] border border-[#E2E8F0] shadow-2xl p-6 sm:p-7 relative animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-2 pb-4">
          <div className="w-14 h-14 rounded-[16px] bg-blue-50 border border-blue-200 text-[#3D77EE] flex items-center justify-center mx-auto mb-4 shadow-sm shadow-blue-500/10">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#3D77EE] text-[11px] font-bold uppercase tracking-wider mb-2 border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Validasi Keamanan Pengguna</span>
          </div>

          <h3 className="text-xl font-extrabold text-[#111827] tracking-tight">
            Masuk untuk Menghubungi {targetName}
          </h3>

          <p className="text-xs text-[#687280] mt-2 leading-relaxed max-w-sm mx-auto">
            Demi keamanan, pencegahan spam, dan kepastian rekam jejak sewa yang transparan, Anda diwajibkan <strong>masuk atau mendaftar akun</strong> terlebih dahulu sebelum dapat menghubungi nomor WhatsApp atau telepon agen.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href={loginHref}
            className="w-full py-3 px-4 bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-sm rounded-[12px] shadow-sm shadow-blue-500/20 hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk ke Akun Saya</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>

          <Link
            href={registerHref}
            className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#111827] font-bold text-sm rounded-[12px] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-slate-500" />
            <span>Daftar Akun Baru (Gratis)</span>
            <ArrowRight className="w-4 h-4 ml-auto text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors cursor-pointer"
          >
            Nanti saja, lanjutkan melihat detail
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <MessageCircle className="w-3.5 h-3.5 text-[#3D77EE]" />
          <span>Nomor WhatsApp agen akan langsung aktif setelah Anda masuk</span>
        </div>
      </div>
    </div>
  );
}
