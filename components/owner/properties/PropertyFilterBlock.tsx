"use client";

import React from "react";
import { Search, ChevronDown, ArrowUpDown, List, Grid } from "lucide-react";

export type StatusTab = "semua" | "aktif" | "review" | "tersewa" | "draft";

interface PropertyFilterBlockProps {
  activeTab: StatusTab;
  onTabChange: (tab: StatusTab) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
  schemaFilter: string;
  onSchemaFilterChange: (val: string) => void;
  tierFilter: string;
  onTierFilterChange: (val: string) => void;
  sortOrder: string;
  onSortOrderChange: (val: string) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  counts: {
    semua: number;
    aktif: number;
    review: number;
    tersewa: number;
    draft: number;
  };
}

export default function PropertyFilterBlock({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  schemaFilter,
  onSchemaFilterChange,
  tierFilter,
  onTierFilterChange,
  sortOrder,
  onSortOrderChange,
  viewMode,
  onViewModeChange,
  counts,
}: PropertyFilterBlockProps) {
  return (
    <div className="flex flex-col gap-4 bg-white p-5 lg:p-6 rounded-[18px] shadow-xs border border-slate-200/80">
      {/* Status Segment Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 text-xs font-semibold">
        <button
          type="button"
          onClick={() => onTabChange("semua")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "semua"
              ? "bg-[#3D77EE] text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>Semua</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[11px] ${
              activeTab === "semua" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {counts.semua}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("aktif")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "aktif"
              ? "bg-[#3D77EE] text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Aktif / Terbit</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[11px] ${
              activeTab === "aktif" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {counts.aktif}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("review")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "review"
              ? "bg-[#3D77EE] text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Menunggu Review</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[11px] ${
              activeTab === "review" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {counts.review}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("tersewa")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "tersewa"
              ? "bg-[#3D77EE] text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Terjual / Tersewa</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[11px] ${
              activeTab === "tersewa" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {counts.tersewa}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("draft")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "draft"
              ? "bg-[#3D77EE] text-white shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>Draft</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[11px] ${
              activeTab === "draft" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {counts.draft}
          </span>
        </button>
      </div>

      {/* Controls Row: Search, Selectors, View Switcher */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
        {/* Search Input (4 Cols) */}
        <div className="xl:col-span-4 relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari judul properti, kode listing (#TPK), atau lokasi..."
            className="w-full h-11 pl-10 pr-4 bg-[#F3F6FB] text-[#111827] rounded-xl text-xs placeholder:text-slate-400 border border-slate-200/80 focus:outline-none focus:border-[#3D77EE] focus:bg-white transition-all"
          />
        </div>

        {/* Filter Selectors (6 Cols) */}
        <div className="xl:col-span-6 flex flex-wrap items-center gap-2">
          {/* Tipe */}
          <div className="relative flex-1 min-w-[130px]">
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              className="w-full h-11 pl-3 pr-8 bg-[#F3F6FB] text-[#111827] rounded-xl text-xs font-semibold appearance-none border border-slate-200/80 focus:outline-none focus:border-[#3D77EE] cursor-pointer"
            >
              <option value="semua">Tipe: Semua</option>
              <option value="Rumah">Rumah</option>
              <option value="Apartemen">Apartemen</option>
              <option value="Ruko">Ruko &amp; Komersial</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-4 pointer-events-none text-slate-400" />
          </div>

          {/* Skema */}
          <div className="relative flex-1 min-w-[130px]">
            <select
              value={schemaFilter}
              onChange={(e) => onSchemaFilterChange(e.target.value)}
              className="w-full h-11 pl-3 pr-8 bg-[#F3F6FB] text-[#111827] rounded-xl text-xs font-semibold appearance-none border border-slate-200/80 focus:outline-none focus:border-[#3D77EE] cursor-pointer"
            >
              <option value="semua">Skema: Semua</option>
              <option value="Sewa Bulanan">Sewa Bulanan</option>
              <option value="Sewa Tahunan">Sewa Tahunan</option>
              <option value="Dijual">Dijual</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-4 pointer-events-none text-slate-400" />
          </div>

          {/* Tier */}
          <div className="relative flex-1 min-w-[120px]">
            <select
              value={tierFilter}
              onChange={(e) => onTierFilterChange(e.target.value)}
              className="w-full h-11 pl-3 pr-8 bg-[#F3F6FB] text-[#111827] rounded-xl text-xs font-semibold appearance-none border border-slate-200/80 focus:outline-none focus:border-[#3D77EE] cursor-pointer"
            >
              <option value="semua">Tier: Semua</option>
              <option value="GOLD">Gold Tier</option>
              <option value="SILVER">Silver Tier</option>
              <option value="BRONZE">Bronze Tier</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-4 pointer-events-none text-slate-400" />
          </div>

          {/* Urutkan */}
          <div className="relative flex-1 min-w-[130px]">
            <select
              value={sortOrder}
              onChange={(e) => onSortOrderChange(e.target.value)}
              className="w-full h-11 pl-3 pr-8 bg-[#F3F6FB] text-[#111827] rounded-xl text-xs font-semibold appearance-none border border-slate-200/80 focus:outline-none focus:border-[#3D77EE] cursor-pointer"
            >
              <option value="terbaru">Urutkan: Terbaru</option>
              <option value="harga_tertinggi">Harga: Tertinggi</option>
              <option value="harga_terendah">Harga: Terendah</option>
              <option value="terpopuler">Paling Banyak Dilihat</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute right-2.5 top-4 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* View Switcher (2 Cols) */}
        <div className="xl:col-span-2 flex items-center justify-end gap-1 bg-[#F3F6FB] p-1 rounded-xl w-fit xl:ml-auto border border-slate-200/80">
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-white text-[#3D77EE] shadow-2xs"
                : "text-slate-400 hover:text-[#111827]"
            }`}
            title="Tampilan Daftar"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-[#3D77EE] shadow-2xs"
                : "text-slate-400 hover:text-[#111827]"
            }`}
            title="Tampilan Kisi"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
