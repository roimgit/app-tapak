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
  // Auto-scroll selected card into view in the list
  useEffect(() => {
    if (selectedListingId) {
      const el = document.getElementById(`property-card-${selectedListingId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedListingId]);

  return (
    <div
      className={`w-full flex flex-col h-full overflow-y-auto bg-white transition-all ${
        mobileView === "map" ? "hidden lg:flex" : "flex"
      }`}
    >
      <div className="sticky top-0 z-20 bg-white px-3.5 sm:px-4 py-2.5 border-b border-[#E2E8F0] flex items-center justify-between shrink-0 shadow-2xs">
        <div>
          <h2 className="text-xs sm:text-[13px] font-bold text-[#111827]">
            Daftar <span className="text-[#3D77EE]">{listings.length}</span> hunian
          </h2>
          <p className="text-[10.5px] text-[#687280]">
            Klik item untuk meninjau lokasi di peta
          </p>
        </div>
        {onClosePanel && (
          <button
            type="button"
            onClick={onClosePanel}
            className="hidden lg:flex items-center gap-1 text-[11px] font-semibold text-[#687280] hover:text-[#111827] px-2 py-1 rounded-[6px] bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
            title="Tutup list properti"
          >
            <span>Tutup List</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {listings.length > 0 ? (
        <div className="pb-10">
          {listings.map((listing) => (
            <div key={listing.id} id={`property-card-${listing.id}`}>
              <PropertyCard
                listing={listing}
                layout="horizontal"
                isSelected={selectedListingId === listing.id || hoveredListingId === listing.id}
                onSelect={onSelectListing}
                onHover={onHoverListing}
                onViewDetail={onViewDetail}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="m-4 h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-[12px] border border-[#E2E8F0]">
          <Building2 className="w-12 h-12 text-slate-300 mb-3" />
          <h4 className="font-bold text-base text-[#111827]">Tidak Ada Hunian yang Cocok</h4>
          <p className="text-xs text-[#687280] mt-1 max-w-xs">
            Coba sesuaikan kata kunci atau bersihkan filter untuk melihat properti lainnya.
          </p>
          <button
            onClick={onReset}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#3D77EE] hover:bg-[#2B55AB] rounded-[8px] transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}


