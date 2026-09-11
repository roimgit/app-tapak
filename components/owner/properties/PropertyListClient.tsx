"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import PropertyFilterBlock, { StatusTab } from "./PropertyFilterBlock";
import PropertyCardRow, { PropertyData } from "./PropertyCardRow";
import PropertyMetricsRibbon from "./PropertyMetricsRibbon";
import PropertyPagination from "./PropertyPagination";
import Link from "next/link";
import { Building2, Plus } from "lucide-react";

const ITEMS_PER_PAGE = 4;

interface PropertyListClientProps {
  initialProperties?: PropertyData[];
  ownerEmail?: string;
}

export default function PropertyListClient({
  initialProperties = [],
  ownerEmail,
}: PropertyListClientProps) {
  const router = useRouter();
  const deletedIdsRef = useRef<Set<string>>(new Set());

  const [properties, setProperties] = useState<PropertyData[]>(initialProperties);

  useEffect(() => {
    setProperties(initialProperties.filter((p) => !deletedIdsRef.current.has(p.id)));
  }, [initialProperties]);

  const [activeTab, setActiveTab] = useState<StatusTab>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("semua");
  const [schemaFilter, setSchemaFilter] = useState("semua");
  const [tierFilter, setTierFilter] = useState("semua");
  const [sortOrder, setSortOrder] = useState("terbaru");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus unit properti ini?")) return;

    // Catat ID agar tidak pernah muncul kembali meskipun ada stale cache
    deletedIdsRef.current.add(id);

    // Optimistic delete: langsung hilangkan kartu dari UI seketika
    const previousProperties = [...properties];
    setProperties((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (res.ok) {
        // Trigger background refresh agar data server & database tersinkronisasi
        router.refresh();
      } else {
        // Rollback jika terjadi kesalahan di server
        deletedIdsRef.current.delete(id);
        setProperties(previousProperties);
        alert("Gagal menghapus listing. Silakan coba kembali.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      deletedIdsRef.current.delete(id);
      setProperties(previousProperties);
      alert("Terjadi kendala saat menghapus listing.");
    }
  };

  const handleToggleStatus = (id: string, isAvailable: boolean) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextStatus: PropertyData["status"] = isAvailable ? "aktif" : "tersewa";
        const nextStatusText = isAvailable ? "Aktif / Tayang" : "Tersewa (Off-Market)";
        return {
          ...p,
          status: nextStatus,
          statusText: nextStatusText,
        };
      })
    );
  };

  // Tab counts (reactive terhadap state properties)
  const counts = useMemo(() => {
    return {
      semua: properties.length,
      aktif: properties.filter((p) => p.status === "aktif").length,
      review: properties.filter((p) => p.status === "review").length,
      tersewa: properties.filter((p) => p.status === "tersewa").length,
      draft: properties.filter((p) => p.status === "draft").length,
    };
  }, [properties]);

  // Filtered list dengan dependency lengkap (termasuk properties dan sortOrder)
  const filteredList = useMemo(() => {
    let list = properties.filter((p) => {
      // Tab filter
      if (activeTab !== "semua" && p.status !== activeTab) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCode = p.code.toLowerCase().includes(q);
        const matchLocation = p.location.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchLocation) return false;
      }

      // Type filter
      if (typeFilter !== "semua" && p.type !== typeFilter) return false;

      // Schema filter
      if (schemaFilter !== "semua" && !p.schemaType.toLowerCase().includes(schemaFilter.toLowerCase())) {
        return false;
      }

      // Tier filter
      if (tierFilter !== "semua" && p.tier !== tierFilter) return false;

      return true;
    });

    if (sortOrder === "terpopuler") {
      list = [...list].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    } else if (sortOrder === "harga_tertinggi") {
      const parsePrice = (str: string) => Number(str.replace(/[^0-9]/g, "")) || 0;
      list = [...list].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortOrder === "harga_terendah") {
      const parsePrice = (str: string) => Number(str.replace(/[^0-9]/g, "")) || 0;
      list = [...list].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    }

    return list;
  }, [properties, activeTab, searchQuery, typeFilter, schemaFilter, tierFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedList = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredList.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredList, validCurrentPage]);

  const startIndex = filteredList.length === 0 ? 0 : (validCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredList.length);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Quick Metrics Ribbon (4 Cards) - Terhubung reaktif dengan state properties */}
      <PropertyMetricsRibbon
        totalCount={counts.semua}
        activeCount={counts.aktif}
        reviewCount={counts.review}
        rentedCount={counts.tersewa}
      />

      {/* 2. Controls & Filter Segment Block */}
      <PropertyFilterBlock
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        typeFilter={typeFilter}
        onTypeFilterChange={(t) => {
          setTypeFilter(t);
          setCurrentPage(1);
        }}
        schemaFilter={schemaFilter}
        onSchemaFilterChange={(s) => {
          setSchemaFilter(s);
          setCurrentPage(1);
        }}
        tierFilter={tierFilter}
        onTierFilterChange={(tr) => {
          setTierFilter(tr);
          setCurrentPage(1);
        }}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        counts={counts}
      />

      {/* 3. Property Cards Collection / Empty States */}
      {properties.length === 0 ? (
        <div className="bg-white rounded-[18px] p-8 sm:p-12 text-center border border-slate-200/80 shadow-2xs space-y-4 max-w-xl mx-auto my-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#3D77EE] flex items-center justify-center mx-auto border border-blue-100">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-extrabold text-[#111827]">
              Belum Ada Unit Properti Terdaftar
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              Akun Anda <span className="font-semibold text-slate-700">({ownerEmail || "Mitra Pemilik"})</span> belum memiliki unit properti yang terdaftar di Tapak. Daftarkan hunian sewa atau jual Anda sekarang untuk mulai menjangkau ribuan calon penyewa langsung ke WhatsApp.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/owner/properties/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-xs rounded-[10px] shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Properti Pertama Anda</span>
            </Link>
          </div>
        </div>
      ) : paginatedList.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 gap-4"
              : "flex flex-col gap-4"
          }
        >
          {paginatedList.map((property) => (
            <PropertyCardRow
              key={property.id}
              property={property}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[18px] p-12 text-center border border-slate-200/80">
          <p className="text-sm font-bold text-[#111827]">Tidak ada properti yang cocok dengan filter.</p>
          <p className="text-xs text-slate-500 mt-1">Coba ubah kata kunci pencarian atau reset filter kategori.</p>
          <button
            type="button"
            onClick={() => {
              setActiveTab("semua");
              setSearchQuery("");
              setTypeFilter("semua");
              setSchemaFilter("semua");
              setTierFilter("semua");
            }}
            className="mt-4 px-4 py-2 bg-blue-50 text-[#3D77EE] font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Pagination Navigation */}
      {filteredList.length > 0 && (
        <PropertyPagination
          currentPage={validCurrentPage}
          totalPages={totalPages}
          totalItems={filteredList.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
