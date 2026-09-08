"use client";

import React, { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { ListingItem } from "@/lib/types";
import ExploreFilterBar from "./explore/ExploreFilterBar";
import ExploreListPanel from "./explore/ExploreListPanel";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] bg-slate-100 rounded-[18px] flex items-center justify-center text-slate-400 font-medium animate-pulse">
      Memuat Peta Tapak...
    </div>
  ),
});

interface ExploreClientProps {
  initialListings: ListingItem[];
  initialQuery?: string;
  initialType?: string;
  initialTier?: string;
}

export default function ExploreClient({
  initialListings,
  initialQuery = "",
  initialType = "",
  initialTier = "",
}: ExploreClientProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedTier, setSelectedTier] = useState<string>(initialTier);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    initialListings[0]?.id || null
  );
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  const filteredListings = useMemo(() => {
    return initialListings.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.district.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedType && selectedType !== "Semua") {
        if (item.property_type.toLowerCase() !== selectedType.toLowerCase()) return false;
      }
      if (selectedTier && selectedTier !== "Semua") {
        if (item.verification_tier !== selectedTier) return false;
      }
      return true;
    });
  }, [initialListings, searchQuery, selectedType, selectedTier]);

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setSelectedType("");
    setSelectedTier("");
  }, []);

  const handleSelectListing = useCallback((id: string) => {
    setSelectedListingId(id);
  }, []);

  const hasActiveFilters = Boolean(searchQuery || selectedType || selectedTier);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-[#F3F6FB]">
      <ExploreFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedTier={selectedTier}
        setSelectedTier={setSelectedTier}
        mobileView={mobileView}
        setMobileView={setMobileView}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="flex-1 flex overflow-hidden">
        <ExploreListPanel
          listings={filteredListings}
          selectedListingId={selectedListingId}
          onSelectListing={handleSelectListing}
          onReset={handleReset}
          mobileView={mobileView}
        />

        <div
          className={`w-full lg:w-[55%] h-full p-4 lg:pl-0 shrink-0 transition-all ${
            mobileView === "list" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="w-full h-full">
            <InteractiveMap
              listings={filteredListings}
              selectedListingId={selectedListingId}
              onSelectListing={handleSelectListing}
              center={[-6.2368, 106.8087]}
              zoom={12}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
