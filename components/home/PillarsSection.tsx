"use client";

import React from "react";
import { ShieldCheck, CircleDollarSign, MapPin, FileCheck2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PillarsSection() {
  const { t } = useLanguage();

  const pillars = [
    {
      icon: ShieldCheck,
      color: "bg-blue-100 text-[#3D77EE]",
      title: t("pillar.1_title", "Verifikasi Berlapis 4-Tier"),
      desc: t(
        "pillar.1_desc",
        "Tiap listing diperiksa melalui tier Bronze, Silver, hingga Gold dengan inspeksi fisik dan legalitas kepemilikan."
      ),
    },
    {
      icon: CircleDollarSign,
      color: "bg-emerald-100 text-emerald-600",
      title: t("pillar.2_title", "Biaya IPL & Utilitas Transparan"),
      desc: t(
        "pillar.2_desc",
        "Tidak ada lagi tagihan mendadak di akhir bulan. Biaya IPL gedung dan estimasi utilitas dijabarkan gamblang."
      ),
    },
    {
      icon: MapPin,
      color: "bg-sky-100 text-[#0EA5E9]",
      title: t("pillar.3_title", "Titik Presisi Geospasial"),
      desc: t(
        "pillar.3_desc",
        "Koordinat nyata di peta dengan sistem query PostGIS terintegrasi untuk akurasi navigasi dan fasilitas sekitar."
      ),
    },
    {
      icon: FileCheck2,
      color: "bg-amber-100 text-amber-600",
      title: t("pillar.4_title", "Proteksi Hukum & Draft Kontrak"),
      desc: t(
        "pillar.4_desc",
        "Dukungan template surat perjanjian sewa menyewa yang melindungi hak penyewa serta kepastian uang jaminan kembali."
      ),
    },
  ];

  return (
    <section id="keunggulan" className="py-16 bg-white border-y border-slate-200/80">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            {t("pillar.title", "Mengapa Memilih Melalui Tapak.?")}
          </h2>
          <p className="text-sm text-[#687280] mt-2">
            {t(
              "pillar.subtitle",
              "Kami menghapus keraguan dalam menyewa properti di Indonesia dengan 4 pilar jaminan baku"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="p-6 rounded-[18px] bg-[#F3F6FB] border border-slate-200/70">
                <div className={`w-12 h-12 rounded-[10px] ${p.color} flex items-center justify-center font-bold mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#111827] mb-2">{p.title}</h3>
                <p className="text-xs text-[#687280] leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
