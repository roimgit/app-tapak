import React from "react";
import { MessageCircle, Eye, Layers, TrendingUp, MapPin, ShieldCheck } from "lucide-react";

export default function KpiPerformanceRow() {
  const sparklineData = [
    { day: "Senin", height: 12, count: 3, isPeak: false },
    { day: "Selasa", height: 16, count: 4, isPeak: false },
    { day: "Rabu", height: 22, count: 6, isPeak: false },
    { day: "Kamis", height: 18, count: 5, isPeak: false },
    { day: "Jumat", height: 32, count: 9, isPeak: false },
    { day: "Sabtu", height: 40, count: 12, isPeak: true },
    { day: "Minggu", height: 28, count: 8, isPeak: false },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: WhatsApp Leads */}
      <div className="rounded-[18px] bg-white p-5 flex flex-col justify-between shadow-xs border border-slate-200/80">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-blue-50 flex items-center justify-center text-[#3D77EE]">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Klik WhatsApp Calon Pembeli
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#3D77EE] font-bold text-[10px]">
            <TrendingUp className="w-3 h-3" />
            +18%
          </span>
        </div>

        <div className="my-4 flex items-end justify-between">
          <div>
            <span className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight block">
              47
            </span>
            <span className="text-xs text-slate-500">Calon Pembeli Terhubung</span>
          </div>

          {/* Sparkline Bar Chart (7 Hari) */}
          <div className="flex items-end gap-1.5 h-10 pb-1">
            {sparklineData.map((bar) => (
              <div
                key={bar.day}
                className={`w-2 rounded-t transition-all ${
                  bar.isPeak ? "bg-[#3D77EE]" : "bg-blue-100 hover:bg-blue-200"
                }`}
                style={{ height: `${bar.height}px` }}
                title={`${bar.day}: ${bar.count} leads`}
              />
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-slate-500 text-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#3D77EE] shrink-0" />
          <span>Lonjakan tertinggi terjadi pada akhir pekan</span>
        </div>
      </div>

      {/* Card 2: Listing Views */}
      <div className="rounded-[18px] bg-white p-5 flex flex-col justify-between shadow-xs border border-slate-200/80">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-blue-50 flex items-center justify-center text-[#3D77EE]">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total Tayangan Listing
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">30 Hari Terakhir</span>
        </div>

        <div className="my-4 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
            1.890
          </span>
          <span className="text-xs text-slate-500">Kali Dilihat</span>
        </div>

        <div className="pt-2 border-t border-slate-100 text-slate-500 text-xs flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#3D77EE] shrink-0" />
          <span>Rata-rata 126 tayangan / hari di Jabodetabek</span>
        </div>
      </div>

      {/* Card 3: Listing Status Distribution */}
      <div className="rounded-[18px] bg-white p-5 flex flex-col justify-between shadow-xs border border-slate-200/80">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-blue-50 flex items-center justify-center text-[#3D77EE]">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Distribusi Status Iklan
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#3D77EE] bg-blue-50 px-2 py-0.5 rounded-full">
            Real-time
          </span>
        </div>

        <div className="my-4 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#111827] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#3D77EE]" />
            <span>3 Aktif</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>1 Review</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span>0 Kedaluwarsa</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-slate-500 text-xs flex items-center justify-between">
          <span>Semua listing memenuhi syarat verifikasi</span>
          <ShieldCheck className="w-4 h-4 text-[#3D77EE]" />
        </div>
      </div>
    </section>
  );
}
