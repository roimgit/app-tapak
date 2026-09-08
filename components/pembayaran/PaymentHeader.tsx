"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Headphones, Lock } from "lucide-react";

export default function PaymentHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
      <div className="h-16 sm:h-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo & Security Pill */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="brand-wordmark text-2xl font-black text-[#111827]">
              Tapak<span className="text-[#3D77EE]">.</span>
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-[#3D77EE]" />
            <span className="text-[11px] uppercase text-[#687280] tracking-wider font-semibold">
              Pembayaran Aman &amp; Terenkripsi 256-bit SSL
            </span>
          </div>
        </div>

        {/* Stepper / Breadcrumbs & CS */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold">
            <Link
              href="/paket-iklan"
              className="text-[#687280] hover:text-[#111827] transition-colors"
            >
              Ringkasan
            </Link>
            <span className="text-[#3D77EE] font-bold pb-0.5 border-b-2 border-[#3D77EE]">
              Metode Pembayaran
            </span>
            <span className="text-slate-400">Konfirmasi</span>
          </nav>

          <div className="h-5 w-px bg-slate-200 hidden md:block" />

          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20Tapak,%20saya%20butuh%20bantuan%20terkait%20pembayaran%20sewa%20lapak."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#687280] hover:text-[#3D77EE] transition-colors"
          >
            <Headphones className="w-4 h-4 text-[#3D77EE]" />
            <span className="hidden lg:inline">Bantuan Transaksi / CS WhatsApp</span>
          </a>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[#111827] font-bold text-xs">
              O
            </div>
            <Lock className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </div>
        </div>
      </div>
    </header>
  );
}
