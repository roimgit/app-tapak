"use client";

import React, { useState } from "react";
import {
  Star,
  CheckCircle2,
  Lock,
  Bolt,
  ShieldCheck,
  Landmark,
  RotateCcw,
  HelpCircle,
  Info,
} from "lucide-react";
import PaymentSuccessModal from "./PaymentSuccessModal";

export interface PlanPricing {
  id: string;
  name: string;
  quotaText: string;
  durationText: string;
  description: string;
  basePrice: number;
  tax: number;
  total: number;
  badge?: string;
  perks: string[];
}

interface PaymentOrderSummaryProps {
  planId?: string;
  billingMode?: string;
  onTotalCalculated?: (total: number) => void;
}

export default function PaymentOrderSummary({
  planId = "multi",
  billingMode = "standard",
}: PaymentOrderSummaryProps) {
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const getPlanDetails = (): PlanPricing => {
    const isHemat = billingMode === "hemat";

    if (planId === "single") {
      const basePrice = isHemat ? 190000 : 75000;
      const tax = Math.round(basePrice * 0.11);
      return {
        id: "single",
        name: "Paket Single Lapak (1 Kuota)",
        quotaText: "1 Slot Kuota Listing",
        durationText: isHemat ? "90 Hari" : "30 Hari",
        description: "Cocok untuk pemilik perorangan yang ingin memasarkan 1 aset properti utama.",
        basePrice,
        tax,
        total: basePrice + tax,
        badge: "Direct Owner",
        perks: [
          "1 Slot Kuota Listing Properti Aktif",
          "Masa Tayang Penuh Tanpa Jeda",
          "Integrasi Langsung ke WhatsApp Pemilik",
          "Notifikasi Pengingat Masa Tayang H-7",
        ],
      };
    }

    if (planId === "juragan") {
      const basePrice = isHemat ? 1150000 : 450000;
      const tax = Math.round(basePrice * 0.11);
      return {
        id: "juragan",
        name: "Paket Juragan Properti (15 Kuota)",
        quotaText: "15 Slot Kuota Listing",
        durationText: isHemat ? "180 Hari" : "90 Hari",
        description: "Untuk kantor agen, pengembang perumahan, dan portofolio komersial besar.",
        basePrice,
        tax,
        total: basePrice + tax,
        badge: "Agency & Investor",
        perks: [
          "15 Slot Kuota Listing Properti Aktif",
          "3x Slot Booster / Featured Beranda Utama",
          "Dukungan Prioritas Tim Verifikasi (< 2 Jam)",
          "Dedicated WhatsApp Account Manager Personal",
        ],
      };
    }

    // Default: Multi Lapak (sesuai spesifikasi dan harga pada mockup pengguna)
    const basePrice = isHemat ? 499000 : 199000;
    const tax = isHemat ? Math.round(basePrice * 0.11) : 21890;
    return {
      id: "multi",
      name: "Paket Multi Lapak (5 Kuota Properti)",
      quotaText: "5 Slot Kuota Listing",
      durationText: isHemat ? "90 Hari" : "60 Hari",
      description: "Solusi optimal pemilik aset rumah, ruko, dan apartemen sewa/jual di Indonesia.",
      basePrice,
      tax,
      total: isHemat ? basePrice + tax : 220890,
      badge: "Paket Terpopuler",
      perks: [
        "5 Slot Kuota Listing Properti Aktif",
        "Prioritas Pencarian Teratas di Hasil Filter",
        "Lencana Verifikasi Resmi: Owner Terpercaya",
        "Pelacak Kunjungan & Leads WhatsApp Langsung",
      ],
    };
  };

  const plan = getPlanDetails();

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <>
      <div className="lg:sticky lg:top-28 flex flex-col gap-6">
        {/* Card Faktur Pembelian */}
        <div className="bg-white rounded-[18px] border border-slate-200/80 shadow-md p-6 flex flex-col gap-5">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-1">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Faktur Pembelian
              </span>
              <h2 className="text-lg font-bold text-[#111827]">Ringkasan Pesanan</h2>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-50 text-[#3D77EE] px-2.5 py-1 rounded-[8px] border border-blue-100">
              #TPK-SUB-9942
            </span>
          </div>

          {/* Subscription Item Box */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-[14px] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 bg-[#3D77EE] text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                <Star className="w-3 h-3 fill-white" />
                <span>{plan.badge}</span>
              </span>
              <span className="text-xs text-[#687280]">
                Durasi Tayang: <strong className="text-[#111827]">{plan.durationText}</strong>
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#111827]">{plan.name}</h3>
              <p className="text-xs text-[#687280] mt-0.5">{plan.description}</p>
            </div>

            {/* Perk highlights */}
            <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-2 text-[#111827]">
              {plan.perks.map((perk, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#3D77EE] shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Detailed Breakdown */}
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between text-[#687280]">
              <span>Harga Paket ({plan.quotaText} / {plan.durationText})</span>
              <span className="font-semibold text-[#111827]">
                {formatRupiah(plan.basePrice)}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#687280]">
              <span className="flex items-center gap-1">
                PPN 11% (UU HPP No. 7/2021)
                <span title="Pajak Pertambahan Nilai resmi Republik Indonesia">
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                </span>
              </span>
              <span className="font-semibold text-[#111827]">
                {formatRupiah(plan.tax)}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#687280]">
              <span>Kode Unik Transaksi Verifikasi</span>
              <span className="font-bold text-emerald-600">Rp 0 (Bebas Biaya)</span>
            </div>

            <div className="flex items-center justify-between text-[#687280]">
              <span>Biaya Pemeliharaan Platform</span>
              <span className="font-bold text-emerald-600">Rp 0 (Gratis)</span>
            </div>
          </div>

          {/* Separator Line */}
          <div className="w-full h-px bg-slate-200 my-1" />

          {/* Grand Total Row */}
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#111827]">Total Pembayaran</span>
              <span className="text-[11px] text-[#687280]">Termasuk faktur pajak elektronik</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#3D77EE] tracking-tight">
              {formatRupiah(plan.total)}
            </div>
          </div>

          {/* Instant Automation Reassurance */}
          <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-[12px] flex items-start gap-2.5">
            <Bolt className="w-5 h-5 text-[#3D77EE] shrink-0 mt-0.5" />
            <p className="text-xs text-[#111827] leading-relaxed">
              Setelah pembayaran selesai diverifikasi, <strong>{plan.quotaText}</strong> akan langsung otomatis aktif di dashboard akun Tapak Anda tanpa perlu verifikasi manual.
            </p>
          </div>

          {/* CTA Primary Button */}
          <button
            type="button"
            onClick={() => setSuccessModalOpen(true)}
            className="w-full py-3.5 px-6 bg-[#3D77EE] hover:bg-[#2B55AB] active:scale-[0.98] text-white font-bold text-sm rounded-[10px] shadow-md shadow-blue-500/20 hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Konfirmasi &amp; Bayar Sekarang</span>
          </button>

          {/* Escrow & Security Trust Badges */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 text-[#687280] text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>256-bit SSL Bank Grade Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#3D77EE] shrink-0" />
              <span>Bekerja sama dengan Payment Gateway Berizin BI &amp; OJK</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Garansi 100% Pengembalian Dana jika Kuota Gagal Terbit</span>
            </div>
          </div>
        </div>

        {/* Mini Help Card */}
        <div className="bg-white p-4 rounded-[14px] border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-[#3D77EE] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#111827]">Mengalami Kendala Pembayaran?</p>
              <p className="text-[11px] text-[#687280]">Hubungi Customer Experience Tapak 24/7</p>
            </div>
          </div>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20Tapak,%20saya%20mengalami%20kendala%20saat%20melakukan%20pembayaran."
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100/70 text-[#3D77EE] text-xs font-bold rounded-[8px] transition-colors shrink-0"
          >
            WhatsApp CS
          </a>
        </div>
      </div>

      {/* Modal Sukses & Verifikasi Transaksi */}
      <PaymentSuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        plan={plan}
      />
    </>
  );
}
