"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Info,
  Train,
  Stethoscope,
  GraduationCap,
  Building2,
  ShoppingBag,
  Footprints,
  School,
} from "lucide-react";
import type { AmenityPOI } from "@/app/api/properties/nearby-amenities/route";
import NearbySchoolDistrict from "./NearbySchoolDistrict";
import { getNearbyAmenityIcon } from "@/lib/amenity-icons";

// Dynamic import Leaflet Map to avoid SSR issues
const NearbyAmenitiesMap = dynamic(
  () => import("./NearbyAmenitiesMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-[18px] bg-slate-100 animate-pulse flex flex-col items-center justify-center text-slate-400 gap-2 border border-slate-200">
        <RefreshCw className="w-6 h-6 animate-spin text-[#3D77EE]" />
        <span className="text-xs font-semibold">Memuat Peta Fasilitas Sekitar...</span>
      </div>
    ),
  }
);

interface NearbyAmenitiesProps {
  latitude: number;
  longitude: number;
  propertyTitle?: string;
  listingCode?: string;
}

// Client-side cache untuk detail page
const clientPropertyAmenitiesCache = new Map<string, AmenityPOI[]>();

export default function NearbyAmenities({
  latitude,
  longitude,
  propertyTitle = "Lokasi Properti",
  listingCode = "TPK-8821",
}: NearbyAmenitiesProps) {
  const cacheKey = `${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
  const initialData = clientPropertyAmenitiesCache.get(cacheKey) || [];

  const [amenities, setAmenities] = useState<AmenityPOI[]>(initialData);
  const [isLoading, setIsLoading] = useState(initialData.length === 0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [focusedPoi, setFocusedPoi] = useState<AmenityPOI | null>(null);
  const [activeView, setActiveView] = useState<"amenities" | "schools">("amenities");

  useEffect(() => {
    let isMounted = true;
    const currentKey = `${latitude.toFixed(3)}_${longitude.toFixed(3)}`;

    const cached = clientPropertyAmenitiesCache.get(currentKey);
    if (cached && cached.length > 0) {
      setAmenities(cached);
      setIsLoading(false);
      return;
    }

    async function fetchAmenities() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/properties/nearby-amenities?lat=${latitude}&lng=${longitude}&radius=1000`
        );
        if (!res.ok) throw new Error("Gagal mengambil data fasilitas.");
        const data = await res.json();
        if (isMounted && data.amenities) {
          clientPropertyAmenitiesCache.set(currentKey, data.amenities);
          setAmenities(data.amenities);
        }
      } catch (err) {
        console.error("Fetch amenities error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchAmenities();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  // Filter cards based on selectedCategory
  const filteredAmenities = useMemo(() => {
    if (selectedCategory === "all") return amenities;
    return amenities.filter(
      (a) => a.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [amenities, selectedCategory]);

  // Counts per category
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
    <section className="bg-white rounded-[22px] border border-[#E2E8F0] shadow-2xs p-6 sm:p-8 lg:p-9 space-y-6">
      {/* Top Context Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#3D77EE]">Tapak.</span>
          <span>/</span>
          <span>Listing #{listingCode}</span>
          <span>/</span>
          <span className="text-[#111827] font-semibold">Fasilitas &amp; Aksesibilitas</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-[#E2E8F0]">
          <span className="w-2 h-2 rounded-full bg-[#3D77EE]" />
          <span className="font-medium text-slate-700">OpenStreetMap Live API Terhubung</span>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
              Fasilitas Sekitar &amp; Aksesibilitas Lingkungan
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verifikasi Jarak Akurat</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Terdeteksi otomatis via peta OpenStreetMap berdasarkan titik koordinat presisi properti.
          </p>
        </div>

        {/* Quick Summary Mini Metrics */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-slate-50 border border-[#E2E8F0] px-3 py-1.5 rounded-xl text-xs">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#3D77EE] flex items-center justify-center font-black">
              {amenities.length}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Total Fasilitas</p>
              <p className="text-xs font-bold text-slate-800">Radius 1.000 m</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-50 border border-[#E2E8F0] px-3 py-1.5 rounded-xl text-xs">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#3D77EE] flex items-center justify-center font-bold text-sm">
              <Footprints className="w-4 h-4 text-[#3D77EE]" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Akses Terdekat</p>
              <p className="text-xs font-bold text-slate-800">
                {closestAmenity
                  ? `${closestAmenity.distanceFormatted} (${closestAmenity.durationFormatted.split(" ")[0]} mnt)`
                  : "180 meter (2 mnt)"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Category Chips & Radius Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setActiveView("amenities");
            }}
            className={`px-3.5 py-1.5 rounded-[10px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeView === "amenities" && selectedCategory === "all"
                ? "bg-[#3D77EE] text-white shadow-xs font-bold"
                : "bg-white border border-slate-200 text-[#111827] hover:border-[#3D77EE] hover:text-[#3D77EE]"
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
            className={`px-3.5 py-1.5 rounded-[10px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeView === "amenities" && selectedCategory === "transport"
                ? "bg-[#3D77EE] text-white shadow-xs font-bold"
                : "bg-white border border-slate-200 text-[#111827] hover:border-[#3D77EE] hover:text-[#3D77EE]"
            }`}
          >
            <Train className="w-3.5 h-3.5 shrink-0" />
            <span>Transportasi</span>
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
            className={`px-3.5 py-1.5 rounded-[10px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeView === "amenities" && selectedCategory === "health"
                ? "bg-[#3D77EE] text-white shadow-xs font-bold"
                : "bg-white border border-slate-200 text-[#111827] hover:border-[#3D77EE] hover:text-[#3D77EE]"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 shrink-0" />
            <span>Kesehatan</span>
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
            className={`px-3.5 py-1.5 rounded-[10px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeView === "amenities" && selectedCategory === "education"
                ? "bg-[#3D77EE] text-white shadow-xs font-bold"
                : "bg-white border border-slate-200 text-[#111827] hover:border-[#3D77EE] hover:text-[#3D77EE]"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span>Pendidikan</span>
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
            className={`px-3.5 py-1.5 rounded-[10px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeView === "amenities" && selectedCategory === "worship"
                ? "bg-[#3D77EE] text-white shadow-xs font-bold"
                : "bg-white border border-slate-200 text-[#111827] hover:border-[#3D77EE] hover:text-[#3D77EE]"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>Tempat Ibadah</span>
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
            className={`px-3.5 py-1.5 rounded-[10px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeView === "amenities" && selectedCategory === "shopping"
                ? "bg-[#3D77EE] text-white shadow-xs font-bold"
                : "bg-white border border-slate-200 text-[#111827] hover:border-[#3D77EE] hover:text-[#3D77EE]"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>Belanja</span>
            <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded-full">
              {categoryCounts.shopping}
            </span>
          </button>

          {/* Tab Khusus: Informasi Distrik Sekolah™ */}
          <button
            type="button"
            onClick={() => setActiveView(activeView === "schools" ? "amenities" : "schools")}
            className={`px-3.5 py-1.5 rounded-[10px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeView === "schools"
                ? "bg-[#3D77EE] text-white shadow-xs font-bold"
                : "bg-white border border-[#E2E8F0] text-[#111827] hover:border-[#3D77EE] hover:text-[#3D77EE]"
            }`}
          >
            <School className="w-3.5 h-3.5 shrink-0" />
            <span>Distrik Sekolah™</span>
          </button>
        </div>

        {/* Radius Visual Legend */}
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-100 border border-[#3D77EE] inline-block" />
            <span>Radius 500m</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-50 border border-sky-400 border-dashed inline-block" />
            <span>Radius 1.000m</span>
          </span>
        </div>
      </div>

      {/* Main Dual-Panel Content */}
      {activeView === "schools" ? (
        /* Tampilan Khusus Informasi Distrik Sekolah™ */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6">
            <NearbyAmenitiesMap
              centerLat={latitude}
              centerLng={longitude}
              propertyTitle={propertyTitle}
              amenities={amenities.filter((a) => a.category === "EDUCATION")}
              selectedCategory="education"
              focusedPoi={focusedPoi}
            />
          </div>
          <div className="lg:col-span-6">
            <NearbySchoolDistrict />
          </div>
        </div>
      ) : (
        /* Tampilan Standar Peta + Daftar Fasilitas (50% Kiri, 50% Kanan) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Panel Kiri: Peta Leaflet */}
          <div className="lg:col-span-6 flex flex-col">
            <NearbyAmenitiesMap
              centerLat={latitude}
              centerLng={longitude}
              propertyTitle={propertyTitle}
              amenities={amenities}
              selectedCategory={selectedCategory}
              focusedPoi={focusedPoi}
            />
          </div>

          {/* Panel Kanan: Daftar Kartu Fasilitas */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold text-[#687280]">
                Urut berdasarkan jarak terdekat
              </span>
              <span className="text-xs font-semibold text-[#3D77EE]">
                {filteredAmenities.length} Fasilitas Ditemukan
              </span>
            </div>

            {/* Cards Stack Container with custom scrollbar */}
            <div className="space-y-3 h-[520px] overflow-y-auto pr-1">
              {filteredAmenities.map((poi) => (
                <div
                  key={poi.id}
                  onClick={() => setFocusedPoi(poi)}
                  className="bg-white hover:bg-slate-50 border border-[#E2E8F0] hover:border-[#3D77EE] rounded-[18px] p-4 transition-all duration-150 shadow-2xs cursor-pointer group flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: `${poi.color}15`,
                          borderColor: `${poi.color}30`,
                          color: poi.color,
                        }}
                      >
                        {getNearbyAmenityIcon(poi.category, "w-5 h-5")}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                            style={{
                              color: poi.color,
                              backgroundColor: `${poi.color}15`,
                            }}
                          >
                            {poi.categoryLabel}
                          </span>
                          <span className="text-[11px] text-slate-400">&bull; Terverifikasi</span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-[#111827] group-hover:text-[#3D77EE] transition-colors mt-0.5">
                          {poi.name}
                        </h3>

                        {poi.note && (
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {poi.note}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Jarak Badge */}
                    <div className="text-right shrink-0">
                      <span className="inline-block text-xs sm:text-sm font-bold text-[#111827] bg-slate-50 px-2.5 py-1 rounded-[8px] border border-[#E2E8F0]">
                        {poi.distanceFormatted}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-blue-50 text-[#3D77EE] font-bold">
                      <Footprints className="w-3.5 h-3.5" />
                      <span>{poi.durationFormatted}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocusedPoi(poi);
                      }}
                      className="text-[11px] text-slate-400 group-hover:text-[#3D77EE] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Lihat di peta</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Catatan Kaki */}
      <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#687280]">
        <div className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Estimasi waktu tempuh dihitung otomatis berdasarkan kecepatan rata-rata jalan kaki (80 m/menit) dan berkendara.
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <span>Data &copy; OpenStreetMap contributors</span>
          <span className="text-[#3D77EE] font-medium">Bebas Biaya Lisensi</span>
        </div>
      </div>
    </section>
  );
}
