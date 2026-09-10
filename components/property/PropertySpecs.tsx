import React from "react";
import { Bed, Bath, Maximize2, Car, Zap, Compass, Sofa, Droplets, Video, Play, Image as ImageIcon } from "lucide-react";
import { ListingItem } from "@/lib/types";
import { getUnitAmenityIcon } from "@/lib/amenity-icons";

interface PropertySpecsProps {
  listing: ListingItem;
}

const SPEC_ICONS: Record<string, React.ReactNode> = {
  garage: <Car className="w-4 h-4" />,
  carport: <Car className="w-4 h-4 opacity-60" />,
  electricity: <Zap className="w-4 h-4" />,
  facing: <Compass className="w-4 h-4" />,
  furnishing: <Sofa className="w-4 h-4" />,
  water_source: <Droplets className="w-4 h-4" />,
};

const SPEC_LABELS: Record<string, string> = {
  garage: "Garasi",
  carport: "Carport",
  electricity: "Daya Listrik",
  facing: "Arah Hadap",
  furnishing: "Furnitur",
  water_source: "Sumber Air",
};

function formatSpecValue(key: string, value: string | number): string {
  if (key === "garage" || key === "carport") return `${value} Slot`;
  return String(value);
}

export default function PropertySpecs({ listing }: PropertySpecsProps) {
  const { specs } = listing;
  const techSpecs = specs
    ? Object.entries(specs).filter(
        ([key, val]) => val !== undefined && !["virtual_tour_url", "youtube_url", "floor_plan_url"].includes(key)
      )
    : [];

  return (
    <div className="bg-white rounded-[10px] p-6 sm:p-7 border border-slate-200 shadow-xs">
      <h2 className="text-lg font-bold text-[#111827] mb-4">Spesifikasi Hunian</h2>

      {/* Kamar, Luas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-5 border-b border-slate-100">
        <div className="p-3.5 rounded-[8px] bg-[#F3F6FB] border border-slate-200/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-[6px] bg-blue-100 text-[#3D77EE] flex items-center justify-center shrink-0">
            <Bed className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#687280] block">Kamar Tidur</span>
            <span className="text-sm font-bold text-[#111827]">{listing.bedrooms} KT</span>
          </div>
        </div>

        <div className="p-3.5 rounded-[8px] bg-[#F3F6FB] border border-slate-200/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-[6px] bg-blue-100 text-[#3D77EE] flex items-center justify-center shrink-0">
            <Bath className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#687280] block">Kamar Mandi</span>
            <span className="text-sm font-bold text-[#111827]">{listing.bathrooms} KM</span>
          </div>
        </div>

        {/* LB */}
        <div className="p-3.5 rounded-[8px] bg-[#F3F6FB] border border-slate-200/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-[6px] bg-blue-100 text-[#3D77EE] flex items-center justify-center shrink-0">
            <Maximize2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#687280] block">Luas Bangunan</span>
            <span className="text-sm font-bold text-[#111827]">{listing.area_sqm} m²</span>
          </div>
        </div>

        {/* LT (jika ada) */}
        {listing.land_area_sqm && (
          <div className="p-3.5 rounded-[8px] bg-[#F3F6FB] border border-slate-200/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-[6px] bg-blue-100 text-[#3D77EE] flex items-center justify-center shrink-0">
              <Maximize2 className="w-4 h-4 opacity-60" />
            </div>
            <div>
              <span className="text-[11px] text-[#687280] block">Luas Tanah</span>
              <span className="text-sm font-bold text-[#111827]">{listing.land_area_sqm} m²</span>
            </div>
          </div>
        )}
      </div>

      {/* Spesifikasi Teknis */}
      {techSpecs.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-bold text-[#111827] mb-3">Spesifikasi Teknis</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {techSpecs.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-2.5 p-2.5 rounded-[8px] bg-slate-50 border border-slate-200/60"
              >
                <span className="text-[#3D77EE]">{SPEC_ICONS[key]}</span>
                <div>
                  <span className="text-[10px] text-[#687280] block">{SPEC_LABELS[key] ?? key}</span>
                  <span className="text-xs font-bold text-[#111827]">
                    {formatSpecValue(key, value as string | number)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deskripsi */}
      <div className="mt-5 pt-5 border-t border-slate-100">
        <h3 className="text-sm font-bold text-[#111827] mb-2">Tentang Properti Ini</h3>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
      </div>

      {/* Fasilitas */}
      <div className="mt-5 pt-5 border-t border-slate-100">
        <h3 className="text-sm font-bold text-[#111827] mb-3">Fasilitas Utama</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {listing.amenities.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 text-xs font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-[8px] border border-slate-200/60"
            >
              <span className="text-[#3D77EE] shrink-0">
                {getUnitAmenityIcon(item, "w-4 h-4")}
              </span>
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Media Tambahan */}
      {specs && (specs.virtual_tour_url || specs.youtube_url || specs.floor_plan_url) && (
        <div className="mt-5 pt-5 border-t border-slate-100">
          <h3 className="text-sm font-bold text-[#111827] mb-3">Media & Tur Virtual</h3>
          <div className="flex flex-wrap gap-2">
            {specs.virtual_tour_url && (
              <a
                href={specs.virtual_tour_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] bg-[#3D77EE] text-white text-xs font-bold hover:bg-[#2B55AB] transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                Virtual Tour 360°
              </a>
            )}
            {specs.youtube_url && (
              <a
                href={specs.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Video Walkthrough
              </a>
            )}
            {specs.floor_plan_url && (
              <a
                href={specs.floor_plan_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] bg-slate-700 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Denah Lantai
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


