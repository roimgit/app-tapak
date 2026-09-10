"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  Phone,
  MessageCircle,
  Share2,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpDown,
  Building,
  Home,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { AgentProfile } from "@/lib/agents";
import { ListingItem } from "@/lib/types";
import PropertyCard from "@/components/PropertyCard";
import VerificationBadge from "@/components/VerificationBadge";
import { formatWhatsAppUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import LoginRequiredModal from "@/components/auth/LoginRequiredModal";

interface AgentStorefrontClientProps {
  agent: AgentProfile;
  initialListings: ListingItem[];
}

export default function AgentStorefrontClient({
  agent,
  initialListings,
}: AgentStorefrontClientProps) {
  const { checkAuth, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] = useState<string>("ALL"); // "ALL" | "DIJUAL" | "DISEWAKAN"
  const [propertyType, setPropertyType] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "newest">("featured");

  const waMessage = `Halo ${agent.name}, saya melihat etalase properti Anda di Tapak. (https://tapak.id/agen/${agent.slug}). Saya ingin berkonsultasi mengenai listing yang Anda kelola.`;
  const waLink = formatWhatsAppUrl(agent.phone, waMessage);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (!checkAuth()) {
      e.preventDefault();
      setShowLoginModal(true);
      return;
    }
    window.open(waLink, "_blank", "noopener,noreferrer");
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    if (!checkAuth()) {
      e.preventDefault();
      setShowLoginModal(true);
      return;
    }
    window.location.href = `tel:${agent.phone}`;
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `${agent.name} — Konsultan Properti Terverifikasi Tapak`,
          text: `Lihat etalase listing properti terverifikasi milik ${agent.name} di Tapak.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Tautan etalase agen berhasil disalin ke clipboard!");
    }
  };

  // Property types available in this agent's catalog
  const availableTypes = useMemo(() => {
    const types = new Set(initialListings.map((l) => l.property_type));
    return Array.from(types);
  }, [initialListings]);

  // Filtered & Sorted Listings
  const filteredListings = useMemo(() => {
    return initialListings
      .filter((item) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            item.title.toLowerCase().includes(q) ||
            item.city.toLowerCase().includes(q) ||
            item.district.toLowerCase().includes(q) ||
            (item.address && item.address.toLowerCase().includes(q));
          if (!match) return false;
        }
        // Transaction type filter
        if (transactionType !== "ALL") {
          if (item.transaction_type !== transactionType) return false;
        }
        // Property type filter
        if (propertyType !== "ALL") {
          if (item.property_type.toLowerCase() !== propertyType.toLowerCase()) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        return 0; // default order
      });
  }, [initialListings, searchQuery, transactionType, propertyType, sortBy]);

  const countDijual = initialListings.filter((l) => l.transaction_type === "DIJUAL").length;
  const countDisewakan = initialListings.filter((l) => l.transaction_type === "DISEWAKAN").length;

  const handleResetFilters = () => {
    setSearchQuery("");
    setTransactionType("ALL");
    setPropertyType("ALL");
    setSortBy("featured");
  };

  return (
    <div className="bg-[#F3F6FB] min-h-screen py-6 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#687280]">
          <Link href="/" className="hover:text-[#3D77EE] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/explore" className="hover:text-[#3D77EE] transition-colors">
            Explore
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111827] font-semibold">{agent.name}</span>
        </nav>

        {/* Top Agent Profile Card (E-Commerce Storefront Header) */}
        <div className="bg-white rounded-[22px] border border-[#E2E8F0] shadow-2xs p-6 sm:p-8 lg:p-10 relative overflow-hidden">
          {/* Subtle background brand accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
            {/* Left: Avatar & Bio */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-white shadow-md bg-slate-100 shrink-0">
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  fill
                  sizes="112px"
                  priority
                  className="object-cover"
                />
                <span
                  title="Online & Siap Melayani"
                  className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                    {agent.name}
                  </h1>
                  <VerificationBadge tier={agent.verification_tier} size="md" />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#3D77EE] border border-blue-200">
                    Mitra Terverifikasi
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#687280]">
                  <span className="font-semibold text-slate-800">{agent.title}</span>
                  <span>&bull;</span>
                  <span>{agent.agency}</span>
                </div>

                {/* Ratings & Quick Credential Pills */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-[8px] font-bold border border-amber-200/80">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{agent.rating.toFixed(1)}</span>
                    <span className="font-normal text-slate-600">({agent.review_count} ulasan)</span>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-50 text-slate-700 px-2.5 py-1 rounded-[8px] font-semibold border border-[#E2E8F0]">
                    <Briefcase className="w-3.5 h-3.5 text-[#3D77EE]" />
                    <span>{agent.experience_years}+ Tahun Pengalaman</span>
                  </div>

                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-[8px] font-semibold border border-emerald-200">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Respons &lt; 5 Menit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact & Share CTAs */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-[10px] shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handlePhoneClick}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-xs sm:text-sm rounded-[10px] shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Telepon Agen</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-3 bg-white hover:bg-slate-50 border border-[#E2E8F0] hover:border-[#3D77EE] text-slate-700 hover:text-[#3D77EE] rounded-[10px] transition-all shadow-2xs flex items-center justify-center cursor-pointer"
                title="Bagikan Profil Agen"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bio & Coverage Area */}
          <div className="mt-6 pt-6 border-t border-[#E2E8F0] grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#687280]">
                Profil &amp; Dedikasi Konsultan
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {agent.bio}
              </p>

              {/* Specialties */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {agent.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50/60 text-[#3D77EE] px-2.5 py-1 rounded-md border border-blue-100"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{spec}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-50/80 rounded-[14px] p-4 border border-[#E2E8F0] space-y-2">
              <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#3D77EE]" />
                <span>Wilayah Layanan Utama</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {agent.coverage_areas.map((area, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium bg-white text-slate-700 px-2.5 py-0.5 rounded-[6px] border border-[#E2E8F0]"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Transparent Metric Stats Banner */}
          <div className="mt-6 pt-6 border-t border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 bg-slate-50 rounded-[12px] border border-[#E2E8F0]">
              <span className="text-xl sm:text-2xl font-black text-[#111827] block">
                {initialListings.length}
              </span>
              <span className="text-[11px] text-[#687280] font-medium">Listing Aktif</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-[12px] border border-[#E2E8F0]">
              <span className="text-xl sm:text-2xl font-black text-[#111827] block">
                {agent.sold_listings_count}+
              </span>
              <span className="text-[11px] text-[#687280] font-medium">Transaksi Selesai</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-[12px] border border-[#E2E8F0]">
              <span className="text-xl sm:text-2xl font-black text-emerald-700 block">
                99.6%
              </span>
              <span className="text-[11px] text-[#687280] font-medium">Kepuasan Klien</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-[12px] border border-[#E2E8F0]">
              <span className="text-xl sm:text-2xl font-black text-[#3D77EE] block">
                100%
              </span>
              <span className="text-[11px] text-[#687280] font-medium">Verifikasi Fisik</span>
            </div>
          </div>
        </div>

        {/* E-Commerce Catalog Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                Etalase Properti {agent.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#687280]">
                Menampilkan {filteredListings.length} dari total {initialListings.length} properti terverifikasi
              </p>
            </div>

            {/* Filter Transaction Type Tabs */}
            <div className="inline-flex items-center p-1 bg-white border border-[#E2E8F0] rounded-[12px] shadow-2xs self-start md:self-auto">
              <button
                type="button"
                onClick={() => setTransactionType("ALL")}
                className={`px-3 sm:px-4 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                  transactionType === "ALL"
                    ? "bg-[#3D77EE] text-white shadow-xs"
                    : "text-[#111827] hover:text-[#3D77EE]"
                }`}
              >
                Semua ({initialListings.length})
              </button>

              <button
                type="button"
                onClick={() => setTransactionType("DIJUAL")}
                className={`px-3 sm:px-4 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                  transactionType === "DIJUAL"
                    ? "bg-[#3D77EE] text-white shadow-xs"
                    : "text-[#111827] hover:text-[#3D77EE]"
                }`}
              >
                Dijual ({countDijual})
              </button>

              <button
                type="button"
                onClick={() => setTransactionType("DISEWAKAN")}
                className={`px-3 sm:px-4 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                  transactionType === "DISEWAKAN"
                    ? "bg-[#3D77EE] text-white shadow-xs"
                    : "text-[#111827] hover:text-[#3D77EE]"
                }`}
              >
                Disewakan ({countDisewakan})
              </button>
            </div>
          </div>

          {/* Search & Property Type Filter Bar */}
          <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-2xs p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan nama hunian, area, atau kota..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-[#E2E8F0] focus:border-[#3D77EE] focus:bg-white rounded-[10px] text-xs sm:text-sm text-[#111827] placeholder:text-slate-400 outline-none transition-all"
              />
            </div>

            {/* Property Type Dropdown / Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setPropertyType("ALL")}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  propertyType === "ALL"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Semua Tipe
              </button>

              {availableTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(type)}
                  className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    propertyType.toLowerCase() === type.toLowerCase()
                      ? "bg-[#3D77EE] text-white shadow-xs font-bold"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-[#E2E8F0] shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  aria-label="Urutkan Properti"
                  className="bg-transparent text-xs font-semibold text-[#111827] outline-none cursor-pointer py-1"
                >
                  <option value="featured">Rekomendasi</option>
                  <option value="price_asc">Harga Terendah</option>
                  <option value="price_desc">Harga Tertinggi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Cards Grid */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-10 sm:p-14 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#3D77EE] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#111827]">
                Tidak ada properti yang cocok dengan filter
              </h3>
              <p className="text-xs text-[#687280] max-w-md mx-auto">
                Coba ubah kata kunci pencarian atau reset filter untuk melihat seluruh katalog listing milik agen ini.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#3D77EE] hover:bg-[#2B55AB] text-white text-xs font-bold rounded-[10px] transition-colors inline-block cursor-pointer shadow-xs"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredListings.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  listing={listing}
                  layout="grid"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        targetName={agent.name}
        redirectUrl={`/agen/${agent.slug}`}
      />
    </div>
  );
}
