"use client";

import React, { useState } from "react";
import { ChevronRight, HelpCircle } from "lucide-react";

interface SchoolItem {
  name: string;
  distance: string;
  type: string;
  level: "sd" | "smp" | "sma";
}

const DEFAULT_SCHOOLS: SchoolItem[] = [
  {
    name: "Sekolah Dasar Sangryul (SDN Rawajati 01)",
    distance: "647m ke sekolah",
    type: "Publik / Akreditasi A",
    level: "sd",
  },
  {
    name: "Sekolah Dasar Cheonil (SDN Pengadegan 03)",
    distance: "754 meter ke sekolah",
    type: "Publik / Teknik",
    level: "sd",
  },
  {
    name: "Sekolah Dasar Cheoncheon (SD Islam Al-Azhar)",
    distance: "963m ke sekolah",
    type: "Swasta / Terpadu",
    level: "sd",
  },
  {
    name: "SMP Negeri 182 Jakarta Selatan",
    distance: "659 meter ke sekolah",
    type: "Publik / Standar Nasional",
    level: "smp",
  },
  {
    name: "SMP Islam Terpadu Al-Ikhlas",
    distance: "1.1 km ke sekolah",
    type: "Swasta / Bilingual",
    level: "smp",
  },
  {
    name: "SMA Negeri 55 Jakarta",
    distance: "820 meter ke sekolah",
    type: "Publik / Unggulan",
    level: "sma",
  },
  {
    name: "SMA Labschool Kebayoran",
    distance: "1.8 km ke sekolah",
    type: "Swasta / Prestasi Nasional",
    level: "sma",
  },
];

export default function NearbySchoolDistrict() {
  const [level, setLevel] = useState<"sd" | "smp" | "sma">("sd");
  const [showAll, setShowAll] = useState(false);

  const filteredSchools = DEFAULT_SCHOOLS.filter((s) => s.level === level);
  const displayList = showAll ? filteredSchools : filteredSchools.slice(0, 3);

  return (
    <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 shadow-2xs flex flex-col gap-3.5">
      {/* Title & Info */}
      <div className="flex items-center gap-1.5 text-[#111827]">
        <h4 className="font-bold text-base tracking-tight">Informasi Distrik Sekolah™</h4>
        <button
          type="button"
          title="Sistem zonasi dan jarak radius sekolah terdekat dari properti ini"
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs: Sekolah Dasar, Sekolah Menengah, Sekolah Menengah Atas */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setLevel("sd")}
          className={`px-3.5 py-1.5 rounded-[8px] font-bold transition-all cursor-pointer whitespace-nowrap ${
            level === "sd"
              ? "bg-[#3D77EE] text-white shadow-xs"
              : "bg-slate-50 border border-[#E2E8F0] text-slate-700 hover:border-[#3D77EE] hover:text-[#3D77EE]"
          }`}
        >
          Sekolah Dasar (SD)
        </button>

        <button
          type="button"
          onClick={() => setLevel("smp")}
          className={`px-3.5 py-1.5 rounded-[8px] font-bold transition-all cursor-pointer whitespace-nowrap ${
            level === "smp"
              ? "bg-[#3D77EE] text-white shadow-xs"
              : "bg-slate-50 border border-[#E2E8F0] text-slate-700 hover:border-[#3D77EE] hover:text-[#3D77EE]"
          }`}
        >
          Sekolah Menengah (SMP)
        </button>

        <button
          type="button"
          onClick={() => setLevel("sma")}
          className={`px-3.5 py-1.5 rounded-[8px] font-bold transition-all cursor-pointer whitespace-nowrap ${
            level === "sma"
              ? "bg-[#3D77EE] text-white shadow-xs"
              : "bg-slate-50 border border-[#E2E8F0] text-slate-700 hover:border-[#3D77EE] hover:text-[#3D77EE]"
          }`}
        >
          Sekolah Menengah Atas (SMA)
        </button>
      </div>

      {/* Subtitle Notice */}
      <p className="text-xs text-slate-500 leading-snug">
        Sekolah-sekolah terverifikasi dalam zonasi radius terdekat hunian ini
      </p>

      {/* School List */}
      <div className="divide-y divide-[#E2E8F0] border-t border-[#E2E8F0]">
        {displayList.map((school) => (
          <div
            key={school.name}
            className="py-3 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-colors"
          >
            <div className="flex flex-col">
              <span className="font-bold text-xs sm:text-sm text-[#111827] group-hover:text-[#3D77EE] transition-colors">
                {school.name}
              </span>
              <div className="flex items-center gap-1 mt-0.5 text-xs">
                <strong className="text-[#111827] font-extrabold">{school.distance}</strong>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5">{school.type}</span>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#3D77EE] transition-colors shrink-0" />
          </div>
        ))}
      </div>

      {/* Bottom link: Lihat Selengkapnya */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-bold text-[#3D77EE] hover:text-[#2B55AB] transition-colors cursor-pointer"
        >
          {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Selengkapnya"}
        </button>
      </div>
    </div>
  );
}
