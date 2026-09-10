"use client";

import React from "react";
import Link from "next/link";
import { Search, MapPin, Building2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function HeroSearchSection() {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();

  const headline = settings?.hero?.headline || "Temukan Hunian Terverifikasi Tanpa Biaya Tersembunyi";
  const subheadline = settings?.hero?.subheadline || "Jelajahi ribuan pilihan apartemen, rumah, vila, dan ruko dengan transparansi biaya IPL, sertifikat resmi, dan jaminan lokasi akurat.";
  const searchPlaceholder = settings?.hero?.searchPlaceholder || t("search.placeholder", "Contoh: SCBD, Kebayoran, BSD City...");
  const stats = settings?.hero?.stats || [];

  return (
    <section className="relative pt-3 pb-8 sm:pt-4 sm:pb-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-72 bg-gradient-to-b from-blue-100/60 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 text-center">
        {/* Dynamic Headline & Subheadline managed via Super Admin Studio */}
        <div className="max-w-3xl mx-auto mb-4 sm:mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#111827] tracking-tight leading-tight">
            {headline}
          </h1>
          {subheadline && (
            <p className="mt-2 text-xs sm:text-sm md:text-base text-[#687280] font-medium leading-relaxed max-w-2xl mx-auto">
              {subheadline}
            </p>
          )}
        </div>

        <div className="max-w-4xl mx-auto bg-white p-3 sm:p-4 rounded-[18px] shadow-xl shadow-blue-500/10 border border-slate-200">
          <form action="/explore" method="GET" className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-5 flex items-center gap-3 px-3 py-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-[10px] border border-slate-200 transition-colors">
              <MapPin className="w-5 h-5 text-[#3D77EE] shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#687280]">
                  {t("search.location", "Lokasi / Area")}
                </label>
                <input
                  type="text"
                  name="q"
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-sm font-semibold text-[#111827] focus:outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="md:col-span-4 flex items-center gap-3 px-3 py-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-[10px] border border-slate-200 transition-colors">
              <Building2 className="w-5 h-5 text-[#3D77EE] shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#687280]">
                  {t("search.housing_type", "Tipe Hunian")}
                </label>
                <select
                  name="type"
                  defaultValue=""
                  className="w-full bg-transparent text-sm font-semibold text-[#111827] focus:outline-none cursor-pointer"
                >
                  <option value="">{t("search.all_categories", "Semua Kategori")}</option>
                  <option value="Apartemen">{t("search.apartment", "Apartemen")}</option>
                  <option value="Rumah">{t("search.house", "Rumah Tapak")}</option>
                  <option value="Kost">{t("search.kost", "Kost & Co-Living")}</option>
                  <option value="Vila">Vila</option>
                  <option value="Ruko">Ruko Komersial</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full h-full min-h-[50px] flex items-center justify-center gap-2 px-6 py-3 bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-sm rounded-[10px] shadow-md shadow-blue-500/25 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{t("search.button", "Cari Hunian")}</span>
              </button>
            </div>
          </form>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center flex-wrap gap-2 text-xs text-[#687280]">
            <span className="font-semibold text-slate-500">{t("search.popular", "Pencarian Populer:")}</span>
            <Link href="/explore?q=SCBD" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#3D77EE] transition-colors">
              SCBD Sudirman
            </Link>
            <Link href="/explore?q=Kebayoran+Baru" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#3D77EE] transition-colors">
              Kebayoran Baru
            </Link>
            <Link href="/explore?q=BSD+City" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#3D77EE] transition-colors">
              Navapark BSD
            </Link>
            <Link href="/explore?tier=GOLD" className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors font-medium">
              Verifikasi Gold Saja
            </Link>
          </div>

          {/* Stats Bar (Managed by Super Admin Studio) */}
          {stats.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              {stats.map((stat, idx) => (
                <div key={idx} className="px-2">
                  <div className="text-sm sm:text-base font-extrabold text-[#3D77EE]">{stat.value}</div>
                  <div className="text-[10px] sm:text-[11px] text-[#687280] font-medium leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
