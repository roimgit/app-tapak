"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  RefreshCw,
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
  Info,
  Navigation,
} from "lucide-react";
import type { AmenityPOI } from "@/app/api/properties/nearby-amenities/route";
import NearbySchoolDistrict from "@/components/property/NearbySchoolDistrict";

// Dynamic import Leaflet Map to avoid SSR issues
const NearbyAmenitiesMap = dynamic(
  () => import("@/components/property/NearbyAmenitiesMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[240px] rounded-[14px] bg-slate-100 animate-pulse flex flex-col items-center justify-center text-slate-400 gap-2 border border-slate-200">
        <RefreshCw className="w-5 h-5 animate-spin text-[#3D77EE]" />
        <span className="text-xs font-semibold">Memuat Peta Radius...</span>
      </div>
    ),
  }
);

interface ExploreNearbyAmenitiesProps {
  latitude: number;
  longitude: number;
  propertyTitle?: string;
  listingId?: string;
}

// Client-side cache agar saat navigasi antar properti loading-nya INSTAN (0ms)
const clientAmenitiesCache = new Map<string, AmenityPOI[]>();

export default function ExploreNearbyAmenities({
  latitude,
  longitude,
  propertyTitle = "Lokasi Properti",
  listingId,
}: ExploreNearbyAmenitiesProps) {
  const cacheKey = `${latitude.toFixed(3)}_${longitude.toFixed(3)}_${listingId || ""}`;
  const initialData = clientAmenitiesCache.get(cacheKey) || [];

  const [amenities, setAmenities] = useState<AmenityPOI[]>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(initialData.length === 0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [focusedPoi, setFocusedPoi] = useState<AmenityPOI | null>(null);
  const [activeView, setActiveView] = useState<"amenities" | "schools">("amenities");
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const currentKey = `${latitude.toFixed(3)}_${longitude.toFixed(3)}_${listingId || ""}`;

    // Jika sudah ada di cache klien, langsung tampilkan tanpa loading spinner
    const cached = clientAmenitiesCache.get(currentKey);
    if (cached && cached.length > 0) {
      setAmenities(cached);
      setIsLoading(false);
      return;
    }

    async function fetchAmenities() {
      try {
        setIsLoading(true);
        const url = `/api/properties/nearby-amenities?lat=${latitude}&lng=${longitude}&radius=1000${
          listingId ? `&listing_id=${encodeURIComponent(listingId)}` : ""
        }`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Gagal mengambil data fasilitas.");
        const data = await res.json();
        if (isMounted && data.amenities) {
          clientAmenitiesCache.set(currentKey, data.amenities);
          setAmenities(data.amenities);
        }
      } catch (err) {
        console.error("Fetch explore nearby amenities error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchAmenities();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude, listingId]);

  // Filter amenities by category
  const filteredAmenities = useMemo(() => {
    if (selectedCategory === "all") return amenities;
    return amenities.filter(
      (a) => a.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [amenities, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: amenities.length,
      transport: amenities.filter((a) => a.category === "TRANSPORT").length,
      health: amenities.filter((a) => a.category === "HEALTH").length,
      education: amenities.filter((a) => a.category === "EDUCATION").length,
      worship: amenities.filter((a) => a.category === "WORSHIP").length,
      shopping: amenities.filter((a) => a.category === "SHOPPING").length,
    };
  }, [amenities]);

  const closestAmenity = amenities[0];

  return (
    <div className="bg-white rounded-[18px] p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs mb-5 space-y-4">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm sm:text-base text-[#111827] flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-[#3D77EE]" />
              <span>Fasilitas Sekitar &amp; Aksesibilitas</span>
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-[#687280] mt-0.5">
            Radius 1.000 m terdeteksi otomatis via OpenStreetMap
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#3D77EE] border border-blue-200">
            {amenities.length} Lokasi
          </span>
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-[8px] bg-slate-50 hover:bg-slate-100 text-slate-700 border border-[#E2E8F0] transition cursor-pointer"
            title={showMap ? "Sembunyikan Peta" : "Tampilkan Peta"}
          >
            <MapIcon className="w-3.5 h-3.5 text-[#3D77EE]" />
            <span>{showMap ? "Tutup Peta" : "Buka Peta"}</span>
            {showMap ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Banner */}
      {closestAmenity && (
        <div className="flex items-center justify-between px-3 py-2 rounded-[10px] bg-blue-50/50 border border-blue-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3D77EE] shrink-0" />
            <span className="text-slate-700 font-medium">
              Akses Terdekat: <strong className="text-[#111827]">{closestAmenity.name}</strong>
            </span>
          </div>
          <span className="text-[#3D77EE] font-bold text-[11px] shrink-0">
            🚶 {closestAmenity.distanceFormatted} ({closestAmenity.durationFormatted.split(" ")[0]} mnt)
          </span>
        </div>
      )}

      {/* Filter Category Chips (Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setSelectedCategory("all");
            setActiveView("amenities");
          }}
          className={`px-3 py-1.5 rounded-[8px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 text-[11px] ${
            activeView === "amenities" && selectedCategory === "all"
              ? "bg-[#3D77EE] text-white shadow-xs font-bold"
              : "bg-white border border-[#E2E8F0] text-[#111827] hover:border-[#3D77EE]"
          }`}
        >
          <span>Semua</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeView === "amenities" && selectedCategory === "all"
                ? "bg-white/20 text-white font-bold"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {categoryCounts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedCategory("transport");
            setActiveView("amenities");
          }}
          className={`px-3 py-1.5 rounded-[8px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 text-[11px] ${
            activeView === "amenities" && selectedCategory === "transport"
              ? "bg-[#3D77EE] text-white shadow-xs font-bold"
              : "bg-white border border-[#E2E8F0] text-[#111827] hover:border-[#3D77EE]"
          }`}
        >
          <span>🚆 Transport</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded-full">
            {categoryCounts.transport}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedCategory("health");
            setActiveView("amenities");
          }}
          className={`px-3 py-1.5 rounded-[8px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 text-[11px] ${
            activeView === "amenities" && selectedCategory === "health"
              ? "bg-[#3D77EE] text-white shadow-xs font-bold"
              : "bg-white border border-[#E2E8F0] text-[#111827] hover:border-[#3D77EE]"
          }`}
        >
          <span>🏥 Kesehatan</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded-full">
            {categoryCounts.health}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedCategory("education");
            setActiveView("amenities");
          }}
          className={`px-3 py-1.5 rounded-[8px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 text-[11px] ${
            activeView === "amenities" && selectedCategory === "education"
              ? "bg-[#3D77EE] text-white shadow-xs font-bold"
              : "bg-white border border-[#E2E8F0] text-[#111827] hover:border-[#3D77EE]"
          }`}
        >
          <span>🎓 Pendidikan</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded-full">
            {categoryCounts.education}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedCategory("worship");
            setActiveView("amenities");
          }}
          className={`px-3 py-1.5 rounded-[8px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 text-[11px] ${
            activeView === "amenities" && selectedCategory === "worship"
              ? "bg-[#3D77EE] text-white shadow-xs font-bold"
              : "bg-white border border-[#E2E8F0] text-[#111827] hover:border-[#3D77EE]"
          }`}
        >
          <span>🕌 Ibadah</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded-full">
            {categoryCounts.worship}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedCategory("shopping");
            setActiveView("amenities");
          }}
          className={`px-3 py-1.5 rounded-[8px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 text-[11px] ${
            activeView === "amenities" && selectedCategory === "shopping"
              ? "bg-[#3D77EE] text-white shadow-xs font-bold"
              : "bg-white border border-[#E2E8F0] text-[#111827] hover:border-[#3D77EE]"
          }`}
        >
          <span>🛍️ Belanja</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded-full">
            {categoryCounts.shopping}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView(activeView === "schools" ? "amenities" : "schools")}
          className={`px-3 py-1.5 rounded-[8px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 text-[11px] ${
            activeView === "schools"
              ? "bg-[#3D77EE] text-white shadow-xs font-bold"
              : "bg-white border border-[#E2E8F0] text-[#111827] hover:border-[#3D77EE] hover:text-[#3D77EE]"
          }`}
        >
          <span>🏫 Distrik Sekolah™</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeView === "schools" ? (
        <NearbySchoolDistrict />
      ) : (
        <div className="space-y-3">
          {/* Mini Interactive Radius Map */}
          {showMap && (
            <div className="rounded-[14px] overflow-hidden border border-[#E2E8F0]">
              <NearbyAmenitiesMap
                centerLat={latitude}
                centerLng={longitude}
                propertyTitle={propertyTitle}
                amenities={amenities}
                selectedCategory={selectedCategory}
                focusedPoi={focusedPoi}
                heightClass="h-[240px] sm:h-[260px]"
              />
            </div>
          )}

          {/* POI Cards List */}
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="space-y-2 py-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-3 rounded-[12px] bg-white border border-[#E2E8F0] animate-pulse flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100" />
                      <div className="space-y-1">
                        <div className="w-24 h-3 bg-slate-100 rounded" />
                        <div className="w-36 h-3.5 bg-slate-100 rounded" />
                      </div>
                    </div>
                    <div className="w-14 h-5 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredAmenities.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-[12px] border border-[#E2E8F0]">
                Tidak ada fasilitas ditemukan pada kategori ini di radius 1.000 m.
              </div>
            ) : (
              filteredAmenities.map((poi) => {
                const isSelected = focusedPoi?.id === poi.id;
                return (
                  <div
                    key={poi.id}
                    onClick={() => setFocusedPoi(poi)}
                    className={`p-3 rounded-[12px] border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-blue-50/50 border-[#3D77EE] shadow-2xs"
                        : "bg-white hover:bg-slate-50 border-[#E2E8F0]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border"
                        style={{
                          backgroundColor: `${poi.color}15`,
                          borderColor: `${poi.color}30`,
                        }}
                      >
                        {poi.icon}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded"
                            style={{
                              color: poi.color,
                              backgroundColor: `${poi.color}15`,
                            }}
                          >
                            {poi.categoryLabel}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#111827] truncate mt-0.5">
                          {poi.name}
                        </h4>
                        {poi.note && (
                          <p className="text-[10px] text-[#687280] truncate">{poi.note}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-[#111827] bg-slate-50 px-2 py-0.5 rounded-[6px] border border-[#E2E8F0]">
                        {poi.distanceFormatted}
                      </span>
                      <span className="text-[10px] font-semibold text-[#3D77EE]">
                        🚶 {poi.durationFormatted.split(" ")[0]} mnt
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#687280]">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Waktu jalan kaki dihitung kecepatan 80 m/menit</span>
        </span>
        <span>&copy; OpenStreetMap</span>
      </div>
    </div>
  );
}
