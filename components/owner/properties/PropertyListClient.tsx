"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import PropertyFilterBlock, { StatusTab } from "./PropertyFilterBlock";
import PropertyCardRow, { PropertyData } from "./PropertyCardRow";
import PropertyMetricsRibbon from "./PropertyMetricsRibbon";
import PropertyPagination from "./PropertyPagination";

const INITIAL_PROPERTIES: PropertyData[] = [
  {
    id: "prop-1",
    code: "#TPK-8821",
    type: "Apartemen",
    title: "Apartemen Kalibata City Studio",
    location: "Tower Gaharu Lt. 14 • 33 m² • Full Furnished",
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
    photoCount: 8,
    schemaType: "SEWA BULANAN",
    price: "Rp 4.500.000",
    pricePeriod: "/ bln",
    priceNote: "Deposit: Rp 4,5 jt • IPL: Rp 450 rb/bln",
    status: "aktif",
    statusText: "Aktif / Tayang",
    statusNote: "Tayang sejak 12 Feb 2025",
    tier: "GOLD",
    views: 840,
    leads: 14,
    score: 92,
    scoreLabel: "Sangat Baik",
    slug: "studio-cozy-bsd-city-sky-house",
  },
  {
    id: "prop-2",
    code: "#TPK-8902",
    type: "Rumah",
    title: "Rumah Minimalis 2 Lantai BSD City",
    location: "Cluster Greenwich Park • LT 120 / LB 95 m²",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80",
    photoCount: 12,
    schemaType: "DIJUAL (HAK MILIK)",
    price: "Rp 1.850.000.000",
    pricePeriod: "",
    priceNote: "Sertifikat SHM • KPR Ready",
    status: "aktif",
    statusText: "Aktif / Tayang",
    statusNote: "Featured Listing BSD",
    isFeatured: true,
    tier: "SILVER",
    views: 1250,
    leads: 32,
    score: 85,
    scoreLabel: "Optimal",
    slug: "rumah-sudut-arsitektur-skandinavia-navapark-bsd",
  },
  {
    id: "prop-3",
    code: "#TPK-9014",
    type: "Ruko",
    title: "Ruko 3 Lantai Strategis Gading Serpong",
    location: "Kawasan Bisnis Boulevard • LB 180 m²",
    imageUrl:
      "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&auto=format&fit=crop&q=80",
    photoCount: 6,
    schemaType: "SEWA TAHUNAN",
    price: "Rp 85.000.000",
    pricePeriod: "/ thn",
    priceNote: "Deposit: Rp 10 jt • Min 2 Tahun",
    status: "review",
    statusText: "Menunggu Review",
    statusNote: "Estimasi proses: ≤ 24 jam",
    tier: "REVIEW",
    curatorNote: "Mohon lengkapi lampiran PBB tahun berjalan.",
  },
  {
    id: "prop-4",
    code: "#TPK-7740",
    type: "Apartemen",
    title: "Studio Grand Dhika City Bekasi",
    location: "Tower C Lt. 8 • 28 m² • Full AC",
    imageUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
    photoCount: 5,
    schemaType: "SEWA BULANAN",
    price: "Rp 3.200.000",
    pricePeriod: "/ bln",
    priceNote: "Penyewa: Bpk. Aris (s.d Des 2026)",
    status: "tersewa",
    statusText: "Tersewa (Off-Market)",
    statusNote: "Kontrak aktif hingga 12 Des 2026",
    tier: "GOLD",
    tenantInfo: "Bpk. Aris",
  },
  {
    id: "prop-5",
    code: "#TPK-1001",
    type: "Apartemen",
    title: "The Pakubuwono Signature 3BR Full Furnished",
    location: "Jl. Pakubuwono VI No. 72 • 205 m²",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    photoCount: 10,
    schemaType: "SEWA BULANAN",
    price: "Rp 45.000.000",
    pricePeriod: "/ bln",
    priceNote: "Deposit: 1 Bulan • IPL Termasuk",
    status: "aktif",
    statusText: "Aktif / Tayang",
    statusNote: "Verified Gold Partner",
    tier: "GOLD",
    views: 2100,
    leads: 48,
    score: 95,
    scoreLabel: "Sangat Baik",
    slug: "the-pakubuwono-signature-3br-full-furnished",
  },
  {
    id: "prop-6",
    code: "#TPK-1002",
    type: "Rumah",
    title: "Modern Minimalist Villa Sanur Tropical Sanctuary",
    location: "Jl. Danau Tamblingan No. 88 • 350 m²",
    imageUrl:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80",
    photoCount: 14,
    schemaType: "SEWA BULANAN",
    price: "Rp 32.000.000",
    pricePeriod: "/ bln",
    priceNote: "Private Pool • Daily Cleaning",
    status: "aktif",
    statusText: "Aktif / Tayang",
    statusNote: "Tayang sejak 1 Jan 2026",
    tier: "GOLD",
    views: 1640,
    leads: 39,
    score: 90,
    scoreLabel: "Sangat Baik",
    slug: "modern-minimalist-villa-sanur-tropical-sanctuary",
  },
  {
    id: "prop-7",
    code: "#TPK-1003",
    type: "Apartemen",
    title: "District 8 SCBD Studio Suite High Floor",
    location: "District 8 Senopati, Sudirman • 45 m²",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
    photoCount: 7,
    schemaType: "SEWA BULANAN",
    price: "Rp 18.500.000",
    pricePeriod: "/ bln",
    priceNote: "City View SCBD • High Floor",
    status: "aktif",
    statusText: "Aktif / Tayang",
    statusNote: "Featured Sudirman",
    tier: "SILVER",
    views: 980,
    leads: 26,
    score: 88,
    scoreLabel: "Optimal",
    slug: "district-8-scbd-studio-suite-high-floor",
  },
  {
    id: "prop-8",
    code: "#TPK-1004",
    type: "Rumah",
    title: "Rumah Sudut Arsitektur Skandinavia Navapark BSD",
    location: "Cluster Lancewood, Navapark • 240 m²",
    imageUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80",
    photoCount: 16,
    schemaType: "SEWA TAHUNAN",
    price: "Rp 280.000.000",
    pricePeriod: "/ thn",
    priceNote: "Full Smart Home • Parkir 3 Mobil",
    status: "aktif",
    statusText: "Aktif / Tayang",
    statusNote: "Verified Gold Partner",
    tier: "GOLD",
    views: 1420,
    leads: 31,
    score: 89,
    scoreLabel: "Sangat Baik",
    slug: "rumah-sudut-arsitektur-skandinavia-navapark-bsd",
  },
  {
    id: "prop-9",
    code: "#TPK-1005",
    type: "Apartemen",
    title: "Casa Verde Setiabudi Executive Loft 2BR",
    location: "Jl. Setiabudi Tengah No. 14 • 78 m²",
    imageUrl:
      "https://images.unsplash.com/photo-1502005229762-ee152da92e06?w=600&auto=format&fit=crop&q=80",
    photoCount: 6,
    schemaType: "SEWA BULANAN",
    price: "Rp 15.000.000",
    pricePeriod: "/ bln",
    priceNote: "Dekat MRT Setiabudi Astra",
    status: "aktif",
    statusText: "Aktif / Tayang",
    statusNote: "Tayang sejak 28 Feb 2026",
    tier: "BRONZE",
    views: 720,
    leads: 18,
    score: 82,
    scoreLabel: "Cukup",
    slug: "casa-verde-setiabudi-executive-loft-2br",
  },
  {
    id: "prop-10",
    code: "#TPK-1006",
    type: "Apartemen",
    title: "Kost Eksklusif Senopati Co-Living Suite",
    location: "Jl. Suryo No. 42, Senopati • 24 m²",
    imageUrl:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=80",
    photoCount: 9,
    schemaType: "SEWA BULANAN",
    price: "Rp 6.500.000",
    pricePeriod: "/ bln",
    priceNote: "Free WiFi, Laundry & Room Service",
    status: "aktif",
    statusText: "Aktif / Tayang",
    statusNote: "Verified Co-Living",
    tier: "SILVER",
    views: 890,
    leads: 23,
    score: 86,
    scoreLabel: "Optimal",
    slug: "kost-eksklusif-senopati-co-living-suite",
  },
  {
    id: "prop-11",
    code: "#TPK-1007",
    type: "Ruko",
    title: "Ruko Komersial 3.5 Lantai Boulevard Gading Serpong",
    location: "Boulevard Raya AA No. 12 • 220 m²",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    photoCount: 8,
    schemaType: "SEWA TAHUNAN",
    price: "Rp 120.000.000",
    pricePeriod: "/ thn",
    priceNote: "Parkir On-Street Luas • Siap Pakai",
    status: "review",
    statusText: "Menunggu Review",
    statusNote: "Estimasi proses: ≤ 12 jam",
    tier: "REVIEW",
    curatorNote: "Verifikasi sertifikat IMB/PBG sedang divalidasi tim legal.",
  },
  {
    id: "prop-12",
    code: "#TPK-1008",
    type: "Apartemen",
    title: "Ciputra World 2 Jakarta Orchard Satrio 2BR",
    location: "Jl. Prof. DR. Satrio Kav 11 • 98 m²",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80",
    photoCount: 8,
    schemaType: "SEWA BULANAN",
    price: "Rp 22.000.000",
    pricePeriod: "/ bln",
    priceNote: "Penyewa: Ibu Ratna (s.d Nov 2026)",
    status: "tersewa",
    statusText: "Tersewa (Off-Market)",
    statusNote: "Kontrak aktif hingga 10 Nov 2026",
    tier: "GOLD",
    tenantInfo: "Ibu Ratna",
    slug: "ciputra-world-2-jakarta-orchard-satrio-2br",
  },
];

const ITEMS_PER_PAGE = 4;

interface PropertyListClientProps {
  initialProperties?: PropertyData[];
}

export default function PropertyListClient({ initialProperties }: PropertyListClientProps) {
  const router = useRouter();
  const deletedIdsRef = useRef<Set<string>>(new Set());

  const [properties, setProperties] = useState<PropertyData[]>(
    initialProperties && initialProperties.length > 0 ? initialProperties : INITIAL_PROPERTIES
  );

  useEffect(() => {
    if (initialProperties && initialProperties.length > 0) {
      setProperties(initialProperties.filter((p) => !deletedIdsRef.current.has(p.id)));
    }
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

      {/* 3. Property Cards Collection */}
      {paginatedList.length > 0 ? (
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
