"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Star,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Megaphone,
} from "lucide-react";
import ListingSubmissionModal, { PackageData } from "./ListingSubmissionModal";
import { DEFAULT_PACKAGES, PackageDefinition } from "@/lib/package-settings";
import { formatRupiah } from "@/lib/utils";

type BillingMode = "standard" | "hemat";

interface PricingCardProps {
  pkg: PackageDefinition;
  isHemat: boolean;
  billingMode: BillingMode;
  onSelectDraft: (pkg: PackageData) => void;
}

function PricingCard({
  pkg,
  isHemat,
  billingMode,
  onSelectDraft,
}: PricingCardProps) {
  const currentPrice = isHemat ? pkg.discountPrice : pkg.standardPrice;
  const currentPeriod = isHemat ? pkg.discountPeriod : pkg.standardPeriod;
  const formattedPrice = formatRupiah(currentPrice);

  const formattedPkgData: PackageData = {
    id: pkg.id,
    name: pkg.name,
    price: formattedPrice,
    period: currentPeriod,
    quota: `${pkg.quotaListing} Kuota Listing`,
    features: pkg.features,
  };

  const isFeatured = pkg.recommended;

  return (
    <div
      className={`relative flex flex-col justify-between bg-white rounded-[18px] p-6 lg:p-8 transition-all ${
        isFeatured
          ? "shadow-xl hover:shadow-2xl border-2 border-[#3D77EE] transform md:-translate-y-2"
          : "shadow-xs hover:shadow-md border border-slate-100"
      }`}
    >
      {isFeatured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#3D77EE] text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
          <Star className="w-3.5 h-3.5 fill-white" />
          <span>Paling Populer</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${
              isFeatured
                ? "bg-blue-100 text-[#3D77EE]"
                : pkg.includeAdSlot
                ? "bg-sky-50 text-[#0EA5E9]"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {isFeatured
              ? "Rekomendasi Pemilik Pro"
              : pkg.includeAdSlot
              ? "Agency & Investor"
              : "Direct Owner"}
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#111827]">{pkg.name}</h3>
        <p className="text-xs text-[#687280] mt-1 min-h-[36px]">
          {pkg.id === "single"
            ? "Cocok untuk pemilik perorangan yang ingin memasarkan 1 aset properti utama."
            : pkg.id === "multi"
            ? "Solusi ideal pemilik banyak aset, ruko, tanah & agen independen aktif."
            : "Untuk kantor agen, pengembang perumahan, dan portofolio komersial besar."}
        </p>

        {/* Price Box */}
        <div
          className={`mt-5 pb-4 rounded-[14px] p-4 border ${
            isFeatured
              ? "bg-blue-50/70 border-blue-100"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          <span
            className={`text-[11px] uppercase font-bold block mb-1 ${
              isFeatured ? "text-[#3D77EE]" : "text-slate-400"
            }`}
          >
            {isFeatured ? "Pilihan Terbaik" : "Mulai Dari"}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#111827]">
              {formattedPrice}
            </span>
            <span className="text-xs font-semibold text-[#687280]">
              {currentPeriod}
            </span>
          </div>
          <span
            className={`text-[11px] font-semibold block mt-1 ${
              isFeatured ? "text-[#3D77EE]" : "text-[#0EA5E9]"
            }`}
          >
            {isHemat
              ? `Hemat 15%! Kuota ${pkg.quotaListing} listing periode extended`
              : `Akses aktif instan ${pkg.quotaListing} listing siap tayang`}
          </span>
        </div>

        {/* Ad Slot Bonus Badge */}
        {pkg.includeAdSlot && (
          <div className="mt-3 flex items-center gap-2 p-2.5 rounded-[10px] bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs font-semibold">
            <Megaphone className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Termasuk <strong>1x Slot Iklan Billboard Beranda</strong> ({pkg.adDurationDays || 30} Hari)!
            </span>
          </div>
        )}

        {/* Action Button */}
        <Link
          href={`/pembayaran?plan=${pkg.id}&billing=${billingMode}`}
          className={`w-full mt-5 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-[10px] text-sm font-bold transition-all cursor-pointer ${
            isFeatured
              ? "bg-[#3D77EE] hover:bg-[#2B55AB] text-white shadow-md shadow-blue-500/25 transform hover:scale-[1.01] active:scale-[0.98]"
              : "bg-blue-50 text-[#3D77EE] hover:bg-[#3D77EE] hover:text-white"
          }`}
        >
          <span>Pilih Paket {pkg.name.split(" ")[0]}</span>
          {isFeatured && <ArrowRight className="w-4 h-4" />}
        </Link>
        <button
          type="button"
          onClick={() => onSelectDraft(formattedPkgData)}
          className="w-full text-center text-[11px] text-[#687280] hover:text-[#3D77EE] mt-2 font-medium cursor-pointer"
        >
          Atau isi formulir draft listing dulu
        </button>

        {/* Features List */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <span
            className={`text-[11px] font-bold tracking-wider uppercase block mb-3 ${
              isFeatured ? "text-[#3D77EE]" : "text-slate-400"
            }`}
          >
            Fitur Paket:
          </span>
          <ul className="space-y-3 text-xs text-[#111827]">
            {pkg.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#3D77EE] shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function PricingSection() {
  const [billingMode, setBillingMode] = useState<BillingMode>("standard");
  const [packages, setPackages] = useState<PackageDefinition[]>(DEFAULT_PACKAGES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<PackageData>({
    id: "multi",
    name: "Multi Lapak",
    price: "Rp 199.000",
    period: "/ 60 Hari",
    quota: "5 Kuota Listing",
    features: [],
  });

  useEffect(() => {
    fetch("/api/packages")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPackages(data.data.filter((p: PackageDefinition) => p.isActive));
        }
      })
      .catch((err) => console.error("Gagal sinkronisasi data paket:", err));
  }, []);

  const handleSelectPackage = (pkg: PackageData) => {
    setSelectedPkg(pkg);
    setModalOpen(true);
  };

  const isHemat = billingMode === "hemat";

  return (
    <>
      <section className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100/70 text-[#3D77EE] text-xs font-semibold tracking-wider uppercase mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#3D77EE]" />
          <span>Investasi Terbaik Properti Anda</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
          Pilih Paket Sewa Lapak Iklan
        </h1>

        <p className="text-base sm:text-lg text-[#687280] mt-3 leading-relaxed max-w-2xl">
          Pasang properti Anda dan jangkau ribuan calon pembeli langsung ke WhatsApp Anda tanpa perantara rumit.
        </p>

        {/* Billing Toggle */}
        <div className="mt-8 flex flex-col items-center">
          <div className="inline-flex items-center p-1.5 rounded-full bg-slate-200/60 shadow-xs border border-slate-200/80">
            <button
              type="button"
              onClick={() => setBillingMode("standard")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
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
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
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

      {/* Dynamic 3-Column Pricing Grid */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {packages.map((pkg) => (
          <PricingCard
            key={pkg.id}
            pkg={pkg}
            isHemat={isHemat}
            billingMode={billingMode}
            onSelectDraft={handleSelectPackage}
          />
        ))}
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

