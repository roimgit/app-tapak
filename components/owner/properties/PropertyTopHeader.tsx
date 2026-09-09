"use client";

import React from "react";
import Link from "next/link";
import { Download, Plus, ChevronRight } from "lucide-react";

export default function PropertyTopHeader() {
  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/owner/dashboard" className="hover:text-[#3D77EE] transition-colors">
          Portal Owner
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-[#111827]">Daftar Properti Saya</span>
      </div>

      {/* Main Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Daftar Properti Saya
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#3D77EE] border border-blue-100">
              Portofolio Pemilik
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
            Kelola portofolio unit, pantau status verifikasi kurator, performa tayangan, dan prospek masuk secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => alert("Mengekspor data 12 properti ke format .CSV...")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#111827] font-bold text-xs rounded-[10px] shadow-2xs border border-slate-200/80 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor Data (.CSV)</span>
          </button>

          <Link
            href="/owner/properties/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-xs rounded-[10px] shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Properti Baru</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
