"use client";

import React from "react";
import Link from "next/link";
import { FileText, Plus, ExternalLink } from "lucide-react";

export default function AdminArtikelPage() {
  const ARTIKEL_LIST = [
    {
      id: "1",
      title: "Panduan Memeriksa Iuran Pengelolaan Lingkungan (IPL) Apartemen",
      category: "Panduan Sewa",
      author: "Tim Riset Tapak.",
      date: "8 September 2026",
      views: 1420,
      status: "Tayang",
    },
    {
      id: "2",
      title: "Perbedaan Sertifikat SHM, SHGB, dan Strata Title untuk Pembeli Pemula",
      category: "Legalitas",
      author: "Konsultan Hukum Properti",
      date: "5 September 2026",
      views: 2850,
      status: "Tayang",
    },
    {
      id: "3",
      title: "Tren Harga Sewa Rumah di Kawasan BSD City dan Bintaro Tahun 2026",
      category: "Wawasan Pasar",
      author: "Analisis Pasar",
      date: "1 September 2026",
      views: 980,
      status: "Tayang",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-[8px] bg-purple-50 text-purple-600">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Kelola Artikel &amp; Edukasi Properti
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#687280] mt-1">
            Publikasikan panduan hukum, ulasan wilayah, dan tips properti terverifikasi untuk pembaca Tapak.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/artikel"
            target="_blank"
            className="px-3.5 py-2 rounded-[10px] text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Halaman Artikel Publik</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </div>

      {/* Article Table Card */}
      <div className="bg-white rounded-[18px] border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm sm:text-base text-[#111827]">
              Daftar Artikel Terpublikasi
            </h2>
            <span className="text-xs text-slate-500">
              Total {ARTIKEL_LIST.length} artikel aktif
            </span>
          </div>

          <button
            type="button"
            onClick={() => alert("Fitur pembuatan editor artikel baru siap dikembangkan pada tahap lanjutan.")}
            className="px-3.5 py-2 rounded-[8px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Artikel Baru</span>
          </button>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {ARTIKEL_LIST.map((art) => (
            <div
              key={art.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-[4px] font-semibold bg-purple-50 text-purple-700 text-[10.5px]">
                    {art.category}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{art.date}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">oleh {art.author}</span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#111827]">
                  {art.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-semibold text-slate-600">
                  {art.views.toLocaleString("id-ID")} Pembaca
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {art.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
