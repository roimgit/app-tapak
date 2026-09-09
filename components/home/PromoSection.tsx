"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Megaphone, Tag, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PromoSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3D77EE]">
            <Sparkles className="w-4 h-4 text-[#3D77EE]" />
            <span>{t("promo.badge", "Penawaran Spesial & Mitra")}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] mt-1">
            {t("promo.title", "Promo Terbatas & Iklan Terverifikasi")}
          </h2>
        </div>
        <Link
          href="/explore"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#3D77EE] hover:text-[#2B55AB] transition-colors"
        >
          <span>{t("btn.see_all", "Lihat Semua Promo")}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Promo Cashback Sewa */}
        <div className="relative p-6 rounded-[18px] bg-gradient-to-br from-blue-50/80 via-white to-white border border-blue-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#3D77EE] text-white">
                <Sparkles className="w-3 h-3" />
                PROMO SEWA
              </span>
              <span className="text-[11px] font-medium text-[#687280]">
                s.d. 31 Maret
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#111827] leading-snug">
              Cashback Sewa s.d. Rp 2.500.000
            </h3>
            <p className="mt-2 text-xs text-[#687280] leading-relaxed">
              Dapatkan potongan langsung untuk sewa unit terverifikasi Gold & Silver. Bebas biaya admin platform.
            </p>

            <div className="mt-4 p-2.5 rounded-[10px] bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs">
              <span className="text-[#687280]">Kode Kupon:</span>
              <span className="font-mono font-bold text-[#3D77EE]">TAPAKHEMAT</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/explore?tier=GOLD"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 bg-[#3D77EE] hover:bg-[#2B55AB] text-white text-xs font-bold rounded-[10px] shadow-sm transition-colors"
            >
              <span>Gunakan Kupon Promo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Iklan Mitra Properti */}
        <div className="relative p-6 rounded-[18px] bg-gradient-to-br from-[#111827] via-[#1B315B] to-[#2B55AB] text-white border border-slate-800 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-xs border border-white/20">
                <Megaphone className="w-3 h-3 text-sky-300" />
                IKLAN MITRA
              </span>
              <span className="text-[11px] font-semibold text-sky-200">
                Inspeksi Gratis
              </span>
            </div>

            <h3 className="text-lg font-bold text-white leading-snug">
              Iklankan Properti Anda di Tapak.
            </h3>
            <p className="mt-2 text-xs text-slate-200 leading-relaxed">
              Jangkau puluhan ribu penyewa terverifikasi setiap bulan. Bebas biaya listing & verifikasi sertifikat fisik untuk mitra baru.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Foto fisik 360° & inspeksi legalitas gratis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Draft kontrak sewa standar hukum resmi</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              href="/paket-iklan"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-[#111827] text-xs font-bold rounded-[10px] shadow-sm transition-colors"
            >
              <span>Pasang Iklan Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: Promo Subsidi IPL */}
        <div className="relative p-6 rounded-[18px] bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/40 border border-emerald-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                <Tag className="w-3 h-3" />
                SUBSIDI IPL
              </span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                Hemat s.d. 100%
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#111827] leading-snug">
              Bebas Biaya IPL Selama 3 Bulan
            </h3>
            <p className="mt-2 text-xs text-[#687280] leading-relaxed">
              Nikmati hunian apartemen pilihan di SCBD, Setiabudi, dan Serpong tanpa pusing iuran pemeliharaan lingkungan gedung.
            </p>

            <div className="mt-4 p-2.5 rounded-[10px] bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-800">
              <span className="font-semibold">Keuntungan: </span>
              Penghematan rata-rata Rp 1,5 Juta - Rp 4 Juta per bulan.
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/explore?type=Apartemen"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[10px] shadow-sm transition-colors"
            >
              <span>Jelajahi Apartemen Promo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
