import React from "react";
import { MessageCircle, RefreshCw, SearchCheck, BellRing } from "lucide-react";

export default function ComparisonDataSection() {
  const benefits = [
    {
      icon: MessageCircle,
      title: "WhatsApp Langsung",
      desc: "Setiap calon pembeli yang tertarik langsung dialihkan ke nomor WhatsApp Anda tanpa perantara admin atau potongan komisi agen.",
    },
    {
      icon: RefreshCw,
      title: "Fleksibilitas Penggantian",
      desc: "Unit Anda sudah laku sebelum masa paket selesai? Ganti seketika dengan unit properti lain tanpa perlu bayar ulang.",
    },
    {
      icon: SearchCheck,
      title: "Optimasi SEO & Lokal",
      desc: "Lapak listing Anda diindeks oleh Google dan memiliki peringkat prioritas pada pencarian spesifik area kota/kabupaten.",
    },
    {
      icon: BellRing,
      title: "Pengingat Tanpa Cemas",
      desc: "Sistem otomatis mengabari Anda menjelang masa tayang berakhir. Listing Anda tidak akan mati mendadak tanpa konfirmasi.",
    },
  ];

  return (
    <section className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Kolom Kiri: Visual metric chart */}
      <div className="lg:col-span-5 bg-white rounded-[18px] p-6 lg:p-8 shadow-xs border border-slate-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D77EE]">
              Statistik Dampak Iklan Tapak
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#687280] text-[11px] font-medium">
              Rata-rata 2024-2025
            </span>
          </div>
          <p className="text-sm text-[#111827] leading-relaxed mb-6">
            Dibandingkan pemasangan konvensional, properti dengan status{" "}
            <strong>Multi Lapak</strong> mencatatkan laju respon WhatsApp{" "}
            <strong className="text-[#3D77EE]">3.8x lebih cepat</strong>.
          </p>
        </div>

        {/* SVG Chart Visualization */}
        <div className="bg-slate-50 rounded-[14px] p-4 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs font-semibold text-[#687280] mb-3">
            <span>Kecepatan Konversi Prospek</span>
            <span className="text-[#3D77EE] font-bold">+280% Interaksi</span>
          </div>

          <svg className="w-full h-24 overflow-visible" fill="none" viewBox="0 0 320 90">
            {/* Grid lines */}
            <line
              className="text-slate-200"
              stroke="currentColor"
              strokeDasharray="4 4"
              x1="0"
              x2="320"
              y1="80"
              y2="80"
            />
            <line
              className="text-slate-200"
              stroke="currentColor"
              strokeDasharray="4 4"
              x1="0"
              x2="320"
              y1="40"
              y2="40"
            />

            {/* Standard Line */}
            <path
              className="text-slate-400"
              d="M10 75 Q 80 70, 160 65 T 310 50"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2.5"
            />

            {/* Tapak Multi Lapak Boost Line */}
            <path
              className="text-[#3D77EE]"
              d="M10 70 Q 90 55, 170 30 T 310 12"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="3.5"
            />

            {/* Dots */}
            <circle className="fill-[#3D77EE]" cx="310" cy="12" r="5" />
            <circle className="fill-slate-400" cx="310" cy="50" r="4" />
          </svg>

          <div className="flex items-center justify-between mt-3 pt-2 text-[11px] text-[#687280]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              Iklan Reguler
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3D77EE]"></span>
              Mitra Multi &amp; Juragan
            </span>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Kenapa Pemilik Memilih Lapak Tapak */}
      <div className="lg:col-span-7 bg-white rounded-[18px] p-6 lg:p-8 shadow-xs border border-slate-100">
        <h3 className="text-xl font-bold text-[#111827] mb-5">
          Kenapa Pemilik Properti Memilih Lapak Tapak?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="p-4 bg-slate-50/70 border border-slate-100 rounded-[14px]">
                <div className="w-9 h-9 rounded-[10px] bg-blue-50 text-[#3D77EE] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h5 className="text-sm font-bold text-[#111827] mb-1">{b.title}</h5>
                <p className="text-xs text-[#687280] leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
