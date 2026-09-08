"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

interface PropertyItem {
  id: string;
  title: string;
  specs: string;
  type: "apartemen" | "rumah";
  price: string;
  pricePeriod: string;
  daysRemaining: number;
  waContacts: number;
  imageUrl: string;
}

const DEFAULT_PROPERTIES: PropertyItem[] = [
  {
    id: "prop-1",
    title: "Apartemen Senopati Suites 2BR",
    specs: "Tower 1 • Lt. 18 • 105 m²",
    type: "apartemen",
    price: "Rp 18.500.000",
    pricePeriod: "/ bulan",
    daysRemaining: 24,
    waContacts: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prop-2",
    title: "Rumah Sudirman Park Modern",
    specs: "Minimalis • LT 180 / LB 220 m²",
    type: "rumah",
    price: "Rp 3.850.000.000",
    pricePeriod: "Jual Cepat",
    daysRemaining: 24,
    waContacts: 16,
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prop-3",
    title: "Studio Cozy BSD City Sky House",
    specs: "Tower Leonie • Full Furnished • 28 m²",
    type: "apartemen",
    price: "Rp 4.500.000",
    pricePeriod: "/ bulan",
    daysRemaining: 19,
    waContacts: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
  },
];

interface ActivePropertiesTableProps {
  initialProperties?: PropertyItem[];
}

export default function ActivePropertiesTable({ initialProperties }: ActivePropertiesTableProps) {
  const [activeFilter, setActiveFilter] = useState<"semua" | "apartemen" | "rumah">("semua");

  const propertiesList = initialProperties && initialProperties.length > 0 ? initialProperties : DEFAULT_PROPERTIES;

  const filteredProperties = propertiesList.filter((p) => {
    if (activeFilter === "semua") return true;
    return p.type === activeFilter;
  });

  return (
    <div
      id="properti"
      className="rounded-[18px] bg-white p-6 shadow-xs border border-slate-200/80 flex flex-col gap-4 scroll-mt-20"
    >
      {/* Table Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#111827]">Properti Sedang Tayang</h2>
          <p className="text-xs text-slate-500">
            Menampilkan {filteredProperties.length} dari 5 total kuota paket aktif
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveFilter("semua")}
            className={`px-3 py-1 rounded-[8px] transition-all cursor-pointer ${
              activeFilter === "semua"
                ? "bg-white text-[#3D77EE] shadow-2xs font-bold"
                : "text-slate-500 hover:text-[#111827]"
            }`}
          >
            Semua (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("apartemen")}
            className={`px-3 py-1 rounded-[8px] transition-all cursor-pointer ${
              activeFilter === "apartemen"
                ? "bg-white text-[#3D77EE] shadow-2xs font-bold"
                : "text-slate-500 hover:text-[#111827]"
            }`}
          >
            Apartemen (2)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("rumah")}
            className={`px-3 py-1 rounded-[8px] transition-all cursor-pointer ${
              activeFilter === "rumah"
                ? "bg-white text-[#3D77EE] shadow-2xs font-bold"
                : "text-slate-500 hover:text-[#111827]"
            }`}
          >
            Rumah (1)
          </button>
        </div>
      </div>

      {/* Property Fast Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3 rounded-l-[10px]">Unit Properti</th>
              <th className="py-3 px-3">Harga</th>
              <th className="py-3 px-3">Status / Sisa</th>
              <th className="py-3 px-3">Leads WA</th>
              <th className="py-3 px-3 text-right rounded-r-[10px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProperties.map((prop) => (
              <tr key={prop.id} className="group hover:bg-slate-50/70 transition-colors">
                {/* Unit info with thumbnail */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-16 h-12 object-cover rounded-[8px] shadow-2xs shrink-0 border border-slate-100"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-[#111827] truncate group-hover:text-[#3D77EE] transition-colors">
                        {prop.title}
                      </span>
                      <span className="text-[11px] text-slate-500">{prop.specs}</span>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <span className="font-bold text-[#111827] text-sm">{prop.price}</span>
                  <span className="text-[11px] text-slate-500 block">{prop.pricePeriod}</span>
                </td>

                {/* Status / Remaining days */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <div className="flex flex-col gap-0.5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-[#3D77EE] font-bold text-[10px] w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3D77EE]" />
                      Tayang Aktif
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {prop.daysRemaining} Hari lagi
                    </span>
                  </div>
                </td>

                {/* WhatsApp leads */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-blue-50 font-bold text-[#111827]">
                    <MessageCircle className="w-3.5 h-3.5 text-[#3D77EE]" />
                    <span>{prop.waContacts} Kontak</span>
                  </div>
                </td>

                {/* Action button */}
                <td className="py-3.5 px-3 text-right whitespace-nowrap">
                  <Link
                    href="/explore"
                    className="inline-block px-3.5 py-1.5 bg-slate-100 hover:bg-[#3D77EE] hover:text-white text-[#3D77EE] font-bold text-xs rounded-[8px] transition-all cursor-pointer"
                  >
                    Kelola
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <span className="text-slate-500">
          Menampilkan {filteredProperties.length} dari total 3 properti tayang
        </span>
        <Link
          href="/owner/properti"
          className="inline-flex items-center gap-1 font-bold text-[#3D77EE] hover:underline group"
        >
          <span>Lihat Semua di Halaman Properti Saya</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
