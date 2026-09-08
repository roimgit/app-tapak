import React from "react";
import { Building2, CheckCircle2, Clock, Lock } from "lucide-react";

interface PropertyMetricsRibbonProps {
  totalCount?: number;
  activeCount?: number;
  reviewCount?: number;
  rentedCount?: number;
}

export default function PropertyMetricsRibbon({
  totalCount = 12,
  activeCount = 8,
  reviewCount = 2,
  rentedCount = 2,
}: PropertyMetricsRibbonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* 1. Total Portofolio */}
      <div className="bg-white p-5 rounded-[18px] shadow-xs border border-slate-200/80 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
            Total Portofolio
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#111827] mt-0.5">
            {totalCount}{" "}
            <span className="text-xs font-normal text-slate-500">Unit</span>
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#3D77EE]">
          <Building2 className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Terbit & Aktif */}
      <div className="bg-white p-5 rounded-[18px] shadow-xs border border-slate-200/80 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
            Terbit &amp; Aktif
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-2xl sm:text-3xl font-black text-[#111827]">
              {activeCount}{" "}
              <span className="text-xs font-normal text-slate-500">Unit</span>
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Menunggu Review */}
      <div className="bg-white p-5 rounded-[18px] shadow-xs border border-slate-200/80 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
            Menunggu Review
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-2xl sm:text-3xl font-black text-[#111827]">
              {reviewCount}{" "}
              <span className="text-xs font-normal text-slate-500">Unit</span>
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* 4. Terjual / Tersewa */}
      <div className="bg-white p-5 rounded-[18px] shadow-xs border border-slate-200/80 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
            Terjual / Tersewa
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-2xl sm:text-3xl font-black text-[#111827]">
              {rentedCount}{" "}
              <span className="text-xs font-normal text-slate-500">Unit</span>
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
