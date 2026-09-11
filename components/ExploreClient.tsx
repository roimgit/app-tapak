"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ListingItem } from "@/lib/types";
import ExploreFilterBar from "./explore/ExploreFilterBar";
import ExploreListPanel from "./explore/ExploreListPanel";
import ExploreDetailPanel from "./explore/ExploreDetailPanel";

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
  initialTransactionType?: string;
  initialSelectedSlug?: string;
  initialSelectedId?: string;
}

const DEFAULT_MAP_CENTER: [number, number] = [-6.2368, 106.8087];

export default function ExploreClient({
  initialListings,
  initialQuery = "",
  initialType = "",
  initialTier = "",
  initialTransactionType = "",
  initialSelectedSlug = "",
  initialSelectedId = "",
}: ExploreClientProps) {
  const router = useRouter();

  const initialMatchedListing = useMemo(() => {
    if (initialSelectedSlug) {
      return initialListings.find((l) => l.slug === initialSelectedSlug) || null;
    }
    if (initialSelectedId) {
      return initialListings.find((l) => l.id === initialSelectedId) || null;
    }
    return null;
  }, [initialListings, initialSelectedSlug, initialSelectedId]);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedTier, setSelectedTier] = useState<string>(initialTier);
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>(initialTransactionType);
  const [isListOpen, setIsListOpen] = useState(true);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    initialMatchedListing ? initialMatchedListing.id : null
  );
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [detailedListingId, setDetailedListingId] = useState<string | null>(
    initialMatchedListing ? initialMatchedListing.id : null
  );
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setSelectedType(initialType);
  }, [initialType]);

  useEffect(() => {
    setSelectedTier(initialTier);
  }, [initialTier]);

  useEffect(() => {
    setSelectedTransactionType(initialTransactionType);
  }, [initialTransactionType]);

  const filteredListings = useMemo(() => {
    return initialListings.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.district.toLowerCase().includes(q) ||
          (item.address && item.address.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (selectedTransactionType && selectedTransactionType !== "Semua") {
        if (item.transaction_type !== selectedTransactionType) return false;
      }
      if (selectedType && selectedType !== "Semua") {
        if (item.property_type.toLowerCase() !== selectedType.toLowerCase()) return false;
      }
      if (selectedTier && selectedTier !== "Semua") {
        if (item.verification_tier !== selectedTier) return false;
      }
      return true;
    });
  }, [initialListings, searchQuery, selectedTransactionType, selectedType, selectedTier]);

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setSelectedType("");
    setSelectedTier("");
    setSelectedTransactionType("");
    setSelectedListingId(null);
    setHoveredListingId(null);
    setDetailedListingId(null);
    router.replace("/explore", { scroll: false });
  }, [router]);

  const handleMapClick = useCallback(() => {
    setIsListOpen(false);
    setSelectedListingId(null);
    setHoveredListingId(null);
  }, []);

  const handleSelectListing = useCallback((id: string | null) => {
    setSelectedListingId(id);
    setHoveredListingId(null);
  }, []);

  const handleHoverListing = useCallback((id: string | null) => {
    setHoveredListingId(id);
  }, []);

  const handleViewDetail = useCallback(
    (id: string) => {
      setDetailedListingId(id);
      setSelectedListingId(id);
      setIsListOpen(true);
      setMobileView("list");
      const target = initialListings.find((item) => item.id === id);
      if (target?.slug && typeof window !== "undefined") {
        window.history.replaceState(null, "", `/explore?slug=${encodeURIComponent(target.slug)}`);
      }
    },
    [initialListings]
  );

  const handleOpenList = useCallback(() => {
    setIsListOpen(true);
    setDetailedListingId(null);
    setMobileView("list");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/explore");
    }
  }, []);

  const handleCloseList = useCallback(() => {
    setIsListOpen(false);
    setSelectedListingId(null);
  }, []);

  const handleBackToList = useCallback(() => {
    setDetailedListingId(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/explore");
    }
  }, []);

  const detailedListing = useMemo(() => {
    if (!detailedListingId) return null;
    return initialListings.find((item) => item.id === detailedListingId) || null;
  }, [detailedListingId, initialListings]);

  const hasActiveFilters = Boolean(
    searchQuery || selectedTransactionType || selectedType || selectedTier
  );

  const mapCenter = useMemo<[number, number]>(() => {
    if (detailedListing) {
      return [detailedListing.latitude, detailedListing.longitude];
    }
    if (initialMatchedListing) {
      return [initialMatchedListing.latitude, initialMatchedListing.longitude];
    }
    return DEFAULT_MAP_CENTER;
  }, [detailedListing, initialMatchedListing]);

  const mapZoom = detailedListing || initialMatchedListing ? 14 : 12;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-[#F3F6FB]">
      <ExploreFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTransactionType={selectedTransactionType}
        setSelectedTransactionType={setSelectedTransactionType}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedTier={selectedTier}
        setSelectedTier={setSelectedTier}
        mobileView={mobileView}
        setMobileView={setMobileView}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
        isDetailActive={Boolean(detailedListingId)}
        onBackToList={handleBackToList}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Property List or Detailed View */}
        {isListOpen && (
          <div
            className={`w-full lg:w-[400px] xl:w-[430px] h-full overflow-hidden transition-all duration-300 relative border-r border-[#E2E8F0] shrink-0 bg-white ${
              mobileView === "map" ? "hidden lg:block" : "block"
            }`}
          >
            {detailedListing ? (
              <ExploreDetailPanel
                listing={detailedListing}
                onBack={handleBackToList}
              />
            ) : (
              <ExploreListPanel
                listings={filteredListings}
                selectedListingId={selectedListingId}
                hoveredListingId={hoveredListingId}
                onSelectListing={handleSelectListing}
                onHoverListing={handleHoverListing}
                onViewDetail={handleViewDetail}
                onReset={handleReset}
                onClosePanel={handleCloseList}
                mobileView={mobileView}
              />
            )}
          </div>
        )}

        {/* Right Panel: Map */}
        <div
          className={`h-full p-2.5 sm:p-3.5 shrink-0 transition-all duration-300 relative ${
            isListOpen ? "w-full lg:flex-1" : "w-full"
          } ${mobileView === "list" ? (isListOpen ? "hidden lg:block" : "block") : "block"}`}
        >
          {/* Circular Arrow Right Button when list is hidden */}
          {!isListOpen && (
            <button
              type="button"
              onClick={handleOpenList}
              className="absolute top-7 left-7 z-[450] w-10 h-10 rounded-full bg-white hover:bg-slate-50 text-[#3D77EE] hover:text-[#2B55AB] border border-[#E2E8F0] shadow-md hover:shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              title="Tampilkan Daftar Properti"
              aria-label="Tampilkan Daftar Properti"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          <div className="w-full h-full">
            <InteractiveMap
              listings={filteredListings}
              selectedListingId={selectedListingId}
              hoveredListingId={hoveredListingId}
              onSelectListing={handleSelectListing}
              onViewDetail={handleViewDetail}
              onMapClick={handleMapClick}
              isListOpen={isListOpen}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
