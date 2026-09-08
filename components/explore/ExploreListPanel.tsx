"use client";

import React from "react";
import { Building2 } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { ListingItem } from "@/lib/types";

interface ExploreListPanelProps {
  listings: ListingItem[];
  selectedListingId: string | null;
  onSelectListing: (id: string) => void;
  onReset: () => void;
  mobileView: "list" | "map";
}

export default function ExploreListPanel({
  listings,
  selectedListingId,
  onSelectListing,
  onReset,
  mobileView,
}: ExploreListPanelProps) {
  return (
    <div
      className={`w-full lg:w-[45%] flex flex-col h-full overflow-y-auto p-4 sm:p-6 transition-all ${
        mobileView === "map" ? "hidden lg:flex" : "flex"
      }`}
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 shrink-0">
        <span className="text-xs font-bold uppercase tracking-wider text-[#687280]">
          Menampilkan <span className="text-[#3D77EE]">{listings.length}</span> Hunian Terverifikasi
        </span>
        <span className="text-xs text-[#687280]">Pilih kartu untuk menyorot lokasi di peta</span>
      </div>

      {listings.length > 0 ? (
        <div className="space-y-4 pb-12">
          {listings.map((listing) => (
            <PropertyCard
              key={listing.id}
              listing={listing}
              layout="horizontal"
              isSelected={selectedListingId === listing.id}
              onSelect={onSelectListing}
            />
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white rounded-[18px] border border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mb-3" />
          <h4 className="font-bold text-base text-[#111827]">Tidak Ada Hunian yang Cocok</h4>
          <p className="text-xs text-[#687280] mt-1 max-w-xs">
            Coba sesuaikan kata kunci atau bersihkan filter untuk melihat properti lainnya.
          </p>
          <button
            onClick={onReset}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#3D77EE] rounded-[10px]"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}
