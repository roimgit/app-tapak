"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Star,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Image as ImageIcon,
  BarChart3,
  Sparkles,
  Award,
  Clock,
  Headphones,
} from "lucide-react";
import ListingSubmissionModal, { PackageData } from "./ListingSubmissionModal";

type BillingMode = "standard" | "hemat";

export default function PricingSection() {
  const [billingMode, setBillingMode] = useState<BillingMode>("standard");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<PackageData>({
    id: "multi",
    name: "Multi Lapak",
    price: "Rp 199.000",
    period: "/ 60 Hari",
    quota: "5 Kuota Listing",
    features: [],
  });

  const handleSelectPackage = (pkg: PackageData) => {
    setSelectedPkg(pkg);
    setModalOpen(true);
  };

  const isHemat = billingMode === "hemat";

  const card1: PackageData = {
    id: "single",
    name: "Single Lapak",
    price: isHemat ? "Rp 190.000" : "Rp 75.000",
    period: isHemat ? "/ 90 Hari" : "/ 30 Hari",
    quota: "1 Kuota Listing",
    features: [
      "1 Kuota Listing Aktif serentak",
      isHemat ? "Masa tayang 90 hari nonstop" : "Masa tayang 30 hari penuh",
      "Integrasi tombol WhatsApp langsung tanpa perantara",
      "Notifikasi pengingat perpanjangan H-7 otomatis",
      "Statistik klik, leads, & impresi prospek dasar",
    ],
  };

  const card2: PackageData = {
    id: "multi",
    name: "Multi Lapak",
    price: isHemat ? "Rp 499.000" : "Rp 199.000",
    period: isHemat ? "/ 90 Hari" : "/ 60 Hari",
    quota: "5 Kuota Listing",
    features: [
      "5 Kuota Listing Aktif serentak",
      isHemat ? "Masa tayang 90 hari berturut-turut" : "Masa tayang 60 hari berturut-turut",
      "Badge verifikasi eksklusif Owner Terverifikasi",
      "Prioritas ranking di hasil pencarian teratas regional",
      "Multi-foto tajam hingga 15 foto HD per properti",
      "Lead tracker & rekapan calon prospek harian via WhatsApp",
      "Bantuan kurasi judul & deskripsi AI otomatis Tapak",
    ],
  };

  const card3: PackageData = {
    id: "juragan",
    name: "Juragan Properti",
    price: isHemat ? "Rp 1.150.000" : "Rp 450.000",
    period: isHemat ? "/ 180 Hari" : "/ 90 Hari",
    quota: "15 Kuota Listing",
    features: [
      "15 Kuota Listing Aktif serentak",
      isHemat ? "Masa tayang 180 hari (6 bulan penuh)" : "Masa tayang 90 hari (3 bulan penuh)",
      "3x Slot Booster / Featured di Beranda Utama Tapak",
      "Dukungan prioritas tim verifikasi (< 2 jam kerja)",
      "Laporan performa mingguan & analitik leads mendalam",
      "Dedicated WhatsApp Account Manager personal",
    ],
  };

  return (
    <>
      <section className="text-center max-w-3xl mx-auto flex flex-col items-center">
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100/70 text-[#3D77EE] text-xs font-semibold tracking-wider uppercase mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#3D77EE]" />
          <span>Investasi Terbaik Properti Anda</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
          Pilih Paket Sewa Lapak Iklan
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-[#687280] mt-3 leading-relaxed max-w-2xl">
          Pasang properti Anda dan jangkau ribuan calon pembeli langsung ke WhatsApp Anda tanpa perantara rumit.
        </p>

        {/* Billing Toggle */}
        <div className="mt-8 flex flex-col items-center">
          <div className="inline-flex items-center p-1.5 rounded-full bg-slate-200/60 shadow-xs border border-slate-200/80">
            <button
              type="button"
              onClick={() => setBillingMode("standard")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                !isHemat
                  ? "bg-white text-[#111827] shadow-sm font-bold"
                  : "text-[#687280] hover:text-[#111827]"
              }`}
            >
              Tagihan Standar
            </button>
            <button
              type="button"
              onClick={() => setBillingMode("hemat")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                isHemat
                  ? "bg-white text-[#111827] shadow-sm font-bold"
                  : "text-[#687280] hover:text-[#111827]"
              }`}
            >
              <span>Paket Hemat 3 Bulan</span>
              <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-[#3D77EE] text-[11px] font-bold">
                Diskon 15%
              </span>
            </button>
          </div>

          <p className="text-xs text-[#687280] mt-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bebas upgrade atau batalkan paket kapan saja tanpa biaya tersembunyi.</span>
          </p>
        </div>
      </section>

      {/* 3-Column Pricing Grid */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* KARTU 1: Single Lapak */}
        <div className="relative flex flex-col justify-between bg-white rounded-[18px] p-6 lg:p-8 shadow-xs hover:shadow-md border border-slate-100 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 tracking-wider uppercase">
                Direct Owner
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#111827]">{card1.name}</h3>
            <p className="text-xs text-[#687280] mt-1 min-h-[36px]">
              Cocok untuk pemilik perorangan yang ingin memasarkan 1 aset properti utama.
            </p>

            {/* Price */}
            <div className="mt-5 pb-4 bg-slate-50 rounded-[14px] p-4 border border-slate-100">
              <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
                Mulai Dari
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#111827]">
                  {card1.price}
                </span>
                <span className="text-xs font-semibold text-[#687280]">
                  {card1.period}
                </span>
              </div>
              <span className="text-[11px] text-[#0EA5E9] font-medium block mt-1">
                {isHemat ? "Hemat 15% dibanding langganan bulanan" : "Biaya terjangkau untuk konversi kilat"}
              </span>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={() => handleSelectPackage(card1)}
              className="w-full mt-5 inline-flex items-center justify-center px-4 py-3 rounded-[10px] bg-blue-50 text-[#3D77EE] hover:bg-[#3D77EE] hover:text-white text-sm font-bold transition-all"
            >
              Pilih Paket Single
            </button>

            {/* Features */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block mb-3">
                Fitur Termasuk:
              </span>
              <ul className="space-y-3 text-xs text-[#111827]">
                {card1.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3D77EE] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* KARTU 2: Multi Lapak (FEATURED / TERPOPULER) */}
        <div className="relative flex flex-col justify-between bg-white rounded-[18px] p-6 lg:p-8 shadow-xl hover:shadow-2xl border-2 border-[#3D77EE] transition-all transform md:-translate-y-2">
          {/* Top Floating Ribbon */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#3D77EE] text-white text-xs font-bold uppercase tracking-wider shadow-md">
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>Paling Populer</span>
          </div>

          <div>
            <div className="flex items-center justify-between mt-1 mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 text-[11px] font-bold text-[#3D77EE] tracking-wider uppercase">
                Rekomendasi Pemilik Pro
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#111827]">{card2.name}</h3>
            <p className="text-xs text-[#687280] mt-1 min-h-[36px]">
              Solusi ideal pemilik banyak aset, ruko, tanah & agen independen aktif.
            </p>

            {/* Price */}
            <div className="mt-5 pb-4 bg-blue-50/70 rounded-[14px] p-4 border border-blue-100">
              <span className="text-[11px] uppercase font-bold text-[#3D77EE] block mb-1">
                Pilihan Terbaik
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#111827]">
                  {card2.price}
                </span>
                <span className="text-xs font-semibold text-[#687280]">
                  {card2.period}
                </span>
              </div>
              <span className="text-[11px] text-[#3D77EE] font-semibold block mt-1">
                {isHemat
                  ? "Super Hemat! Kuota 5 listing selama 3 bulan"
                  : "Hemat Rp 50.000 (Setara Rp 3.300/hari)"}
              </span>
            </div>

            {/* Primary Action CTA */}
            <button
              type="button"
              onClick={() => handleSelectPackage(card2)}
              className="w-full mt-5 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-[10px] bg-[#3D77EE] hover:bg-[#2B55AB] text-white text-sm font-bold shadow-md shadow-blue-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.98]"
            >
              <span>Sewa Lapak Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Features */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[11px] font-bold text-[#3D77EE] tracking-wider uppercase block mb-3">
                Semua Fitur Single, Plus:
              </span>
              <ul className="space-y-3 text-xs text-[#111827]">
                {card2.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3D77EE] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* KARTU 3: Juragan Properti */}
        <div className="relative flex flex-col justify-between bg-white rounded-[18px] p-6 lg:p-8 shadow-xs hover:shadow-md border border-slate-100 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-sky-50 text-[11px] font-bold text-[#0EA5E9] tracking-wider uppercase">
                Agency & Investor
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#111827]">{card3.name}</h3>
            <p className="text-xs text-[#687280] mt-1 min-h-[36px]">
              Untuk kantor agen, pengembang perumahan, dan pemilik portofolio komersial besar.
            </p>

            {/* Price */}
            <div className="mt-5 pb-4 bg-slate-50 rounded-[14px] p-4 border border-slate-100">
              <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
                Skala Besar
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#111827]">
                  {card3.price}
                </span>
                <span className="text-xs font-semibold text-[#687280]">
                  {card3.period}
                </span>
              </div>
              <span className="text-[11px] text-[#0EA5E9] font-medium block mt-1">
                {isHemat
                  ? "Spesial 6 Bulan komitmen agen & pengembang"
                  : "Eksposur maksimal untuk portofolio luas"}
              </span>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={() => handleSelectPackage(card3)}
              className="w-full mt-5 inline-flex items-center justify-center px-4 py-3 rounded-[10px] bg-blue-50 text-[#3D77EE] hover:bg-[#3D77EE] hover:text-white text-sm font-bold transition-all"
            >
              Pilih Paket Juragan
            </button>

            {/* Features */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block mb-3">
                Fitur Kelas Perusahaan:
              </span>
              <ul className="space-y-3 text-xs text-[#111827]">
                {card3.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3D77EE] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Listing Form Modal */}
      <ListingSubmissionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPackage={selectedPkg}
      />
    </>
  );
}
