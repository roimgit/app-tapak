import React from "react";
import Link from "next/link";
import { RotateCw, PlusSquare, CalendarCheck } from "lucide-react";

interface QuotaStatusHeroCardProps {
  packageName?: string;
  quotaTotal?: number;
  quotaUsed?: number;
  remainingDays?: number;
  endDateFormatted?: string;
}

export default function QuotaStatusHeroCard({
  packageName = "Paket Multi Lapak",
  quotaTotal = 5,
  quotaUsed = 3,
  remainingDays = 24,
  endDateFormatted = "2 Oktober 2026",
}: QuotaStatusHeroCardProps) {
  const quotaAvailable = Math.max(0, quotaTotal - quotaUsed);
  const percentage = Math.min(100, Math.round((quotaUsed / quotaTotal) * 100));

  return (
    <section className="rounded-[18px] bg-gradient-to-br from-white via-white to-blue-50/40 p-6 sm:p-7 shadow-xs border border-slate-200/80 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Kolom 1: Visualisasi Kuota Lapak (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-slate-100 pb-5 lg:pb-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#3D77EE] font-bold text-[11px] uppercase tracking-wider border border-blue-100">
              {packageName}
            </span>
            <span className="text-[11px] text-slate-500 font-bold uppercase">
              {quotaTotal} TOTAL SLOT
            </span>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight leading-none">
              {quotaUsed}{" "}
              <span className="text-lg sm:text-xl text-slate-500 font-normal">
                dari {quotaTotal} Slot Terpakai
              </span>
            </span>
          </div>

          {/* Progress Bar Persentase Kuota */}
          <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#3D77EE] to-sky-400 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-0.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3D77EE]" />
              <span className="font-semibold text-[#111827]">
                {quotaUsed} Listing Tayang Aktif
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="font-medium text-slate-500">
                {quotaAvailable} Slot Siap Pakai
              </span>
            </div>
          </div>
        </div>

        {/* Kolom 2: Masa Berlaku Sewa Lapak (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-2 px-0 lg:px-4 border-b lg:border-b-0 lg:border-r border-slate-100 pb-5 lg:pb-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Status: Normal &amp; Aktif
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
              Sisa {remainingDays} Hari
            </span>
            <span className="text-xs text-slate-400">lagi</span>
          </div>

          <div className="flex items-start gap-2 text-slate-500 text-xs">
            <CalendarCheck className="w-4 h-4 text-[#3D77EE] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Masa sewa berakhir pada <strong className="text-[#111827] font-semibold">{endDateFormatted}</strong>. Pembaruan otomatis saat ini tidak aktif.
            </p>
          </div>
        </div>

        {/* Kolom 3: Aksi Cepat (3 cols) */}
        <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center">
          <Link
            href="/paket-iklan"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-xs rounded-[10px] shadow-sm transition-all active:scale-[0.98]"
          >
            <RotateCw className="w-4 h-4" />
            <span>Perpanjang Masa Sewa</span>
          </Link>
          <Link
            href="/paket-iklan"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-[#3D77EE] border border-slate-200 font-bold text-xs rounded-[10px] shadow-2xs transition-all active:scale-[0.98]"
          >
            <PlusSquare className="w-4 h-4" />
            <span>Tambah Slot Kuota</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
