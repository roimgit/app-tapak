"use client";

import React, { useEffect } from "react";
import { Building2, ChevronLeft } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { ListingItem } from "@/lib/types";

interface ExploreListPanelProps {
  listings: ListingItem[];
  selectedListingId: string | null;
  hoveredListingId?: string | null;
  onSelectListing: (id: string) => void;
  onHoverListing?: (id: string | null) => void;
  onViewDetail?: (id: string) => void;
  onReset: () => void;
  onClosePanel?: () => void;
  mobileView: "list" | "map";
}

export default function ExploreListPanel({
  listings,
  selectedListingId,
  hoveredListingId,
  onSelectListing,
  onHoverListing,
  onViewDetail,
  onReset,
  onClosePanel,
  mobileView,
}: ExploreListPanelProps) {
  const handleCardHover = (id: string | null) => {
    onHoverListing?.(id);
  };

  return (
    <div
      className={`w-full flex flex-col h-full overflow-y-auto p-4 sm:p-6 transition-all ${
        mobileView === "map" ? "hidden lg:flex" : "flex"
      }`}
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0] shrink-0">
        <div>
          <span className="text-xs font-semibold text-[#687280]">
            Menampilkan <span className="text-[#3D77EE] font-bold">{listings.length}</span> hunian terverifikasi
          </span>
          <p className="text-[11px] text-[#687280] hidden sm:block">
            Pilih kartu untuk menyorot lokasi di peta
          </p>
        </div>
        {onClosePanel && (
          <button
            type="button"
            onClick={onClosePanel}
            className="hidden lg:flex items-center gap-1 text-xs font-semibold text-[#687280] hover:text-[#111827] px-2.5 py-1.5 rounded-[8px] bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
            title="Tutup list properti"
          >
            <span>Tutup List</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {listings.length > 0 ? (
        <div className="space-y-4 pb-12">
          {listings.map((listing) => (
            <div key={listing.id} id={`property-card-${listing.id}`}>
              <PropertyCard
                listing={listing}
                layout="horizontal"
                isSelected={selectedListingId === listing.id || hoveredListingId === listing.id}
                onSelect={onSelectListing}
                onHover={handleCardHover}
                onViewDetail={onViewDetail}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white rounded-[18px] border border-[#E2E8F0]">
          <Building2 className="w-12 h-12 text-slate-300 mb-3" />
          <h4 className="font-bold text-base text-[#111827]">Tidak Ada Hunian yang Cocok</h4>
          <p className="text-xs text-[#687280] mt-1 max-w-xs">
            Coba sesuaikan kata kunci atau bersihkan filter untuk melihat properti lainnya.
          </p>
          <button
            onClick={onReset}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#3D77EE] hover:bg-[#2B55AB] rounded-[10px] transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}
