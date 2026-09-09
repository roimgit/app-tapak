import React from "react";
import { Bed, Bath, Maximize2, Check } from "lucide-react";
import { ListingItem } from "@/lib/types";

interface PropertySpecsProps {
  listing: ListingItem;
}

export default function PropertySpecs({ listing }: PropertySpecsProps) {
  return (
    <div className="bg-white rounded-[18px] p-6 sm:p-7 border border-slate-200 shadow-xs">
      <h2 className="text-lg font-bold text-[#111827] mb-4">Spesifikasi Hunian</h2>

      <div className="grid grid-cols-3 gap-4 pb-6 border-b border-slate-100">
        <div className="p-4 rounded-[10px] bg-[#F3F6FB] border border-slate-200/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-blue-100 text-[#3D77EE] flex items-center justify-center">
            <Bed className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#687280] block">Kamar Tidur</span>
            <span className="text-base font-bold text-[#111827]">{listing.bedrooms} Kamar</span>
          </div>
        </div>

        <div className="p-4 rounded-[10px] bg-[#F3F6FB] border border-slate-200/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-blue-100 text-[#3D77EE] flex items-center justify-center">
            <Bath className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#687280] block">Kamar Mandi</span>
            <span className="text-base font-bold text-[#111827]">{listing.bathrooms} Ruang</span>
          </div>
        </div>

        <div className="p-4 rounded-[10px] bg-[#F3F6FB] border border-slate-200/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-blue-100 text-[#3D77EE] flex items-center justify-center">
            <Maximize2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#687280] block">Luas Total</span>
            <span className="text-base font-bold text-[#111827]">{listing.area_sqm} m²</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-bold text-[#111827] mb-2">Tentang Hunian Ini</h3>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {listing.description}
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100">
        <h3 className="text-sm font-bold text-[#111827] mb-3">Fasilitas Utama</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {listing.amenities.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-[8px] border border-slate-200/60"
            >
              <Check className="w-3.5 h-3.5 text-[#3D77EE]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
