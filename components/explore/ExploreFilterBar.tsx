"use client";

import React from "react";
import { Search, RotateCcw, ListFilter, Map as MapIcon } from "lucide-react";

interface ExploreFilterBarProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedTransactionType: string;
  setSelectedTransactionType: (v: string) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
  selectedTier: string;
  setSelectedTier: (v: string) => void;
  mobileView: "list" | "map";
  setMobileView: (v: "list" | "map") => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  isDetailActive?: boolean;
  onBackToList?: () => void;
}

export default function ExploreFilterBar({
  searchQuery,
  setSearchQuery,
  selectedTransactionType,
  setSelectedTransactionType,
  selectedType,
  setSelectedType,
  selectedTier,
  setSelectedTier,
  mobileView,
  setMobileView,
  onReset,
  hasActiveFilters,
  isDetailActive,
  onBackToList,
}: ExploreFilterBarProps) {
  return (
    <div className="bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-2.5 shrink-0 z-20 w-full">
      <div className="w-full flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2.5 flex-1 min-w-[260px]">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lokasi, apartemen, kawasan..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E2E8F0] rounded-[10px] focus:outline-none focus:border-[#3D77EE] focus:ring-1 focus:ring-[#3D77EE]"
            />
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs">
          <select
            value={selectedTransactionType}
            onChange={(e) => setSelectedTransactionType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-[#E2E8F0] rounded-[10px] font-medium text-[#111827] focus:outline-none cursor-pointer"
          >
            <option value="">Semua Transaksi</option>
            <option value="DISEWAKAN">Disewakan</option>
            <option value="DIJUAL">Dijual</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-[#E2E8F0] rounded-[10px] font-medium text-[#111827] focus:outline-none cursor-pointer"
          >
            <option value="">Semua Tipe</option>
            <option value="Apartemen">Apartemen</option>
            <option value="Rumah">Rumah Tapak</option>
            <option value="Kost">Kost & Co-Living</option>
            <option value="Vila">Vila</option>
            <option value="Ruko">Ruko</option>
          </select>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-[#E2E8F0] rounded-[10px] font-medium text-[#111827] focus:outline-none cursor-pointer"
          >
            <option value="">Semua Tingkat Verifikasi</option>
            <option value="GOLD">Tier Gold</option>
            <option value="SILVER">Tier Silver</option>
            <option value="BRONZE">Tier Bronze</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#3D77EE] bg-blue-50 hover:bg-blue-100 rounded-[10px] border border-blue-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="lg:hidden flex items-center bg-slate-100 p-1 rounded-[10px] border border-[#E2E8F0]">
          <button
            onClick={() => setMobileView("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all ${
              mobileView === "list" ? "bg-white text-[#3D77EE] shadow-xs" : "text-slate-600"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Daftar</span>
          </button>
          <button
            onClick={() => setMobileView("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all ${
              mobileView === "map" ? "bg-white text-[#3D77EE] shadow-xs" : "text-slate-600"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Peta</span>
          </button>
        </div>
      </div>
    </div>
  );
}
