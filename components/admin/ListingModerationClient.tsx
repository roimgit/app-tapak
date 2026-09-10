"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  ExternalLink,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Search,
  Check,
  X,
  Eye,
  RefreshCw,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { ListingItem } from "@/lib/types";

interface ModerationCounts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function ListingModerationClient() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [counts, setCounts] = useState<ModerationCounts>({ all: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL"); // ALL, PENDING, APPROVED, REJECTED
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal Tolak
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchModerationListings = useCallback(async () => {
    try {
      const url = activeTab === "ALL" ? "/api/admin/listings/moderation" : `/api/admin/listings/moderation?status=${activeTab}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setListings(json.data || []);
        if (json.counts) {
          setCounts(json.counts);
        }
      }
    } catch {
      setToastMessage({ type: "error", text: "Gagal memuat antrean moderasi listing." });
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    let isMounted = true;
    const url = activeTab === "ALL" ? "/api/admin/listings/moderation" : `/api/admin/listings/moderation?status=${activeTab}`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        if (json.success) {
          setListings(json.data || []);
          if (json.counts) setCounts(json.counts);
        }
      })
      .catch(() => {
        if (isMounted) setToastMessage({ type: "error", text: "Gagal memuat antrean moderasi listing." });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleApprove = async (listing: ListingItem) => {
    setActionLoadingId(listing.id);
    try {
      const res = await fetch("/api/admin/listings/moderation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: listing.id, action: "APPROVE" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Listing "${listing.title}" disetujui & langsung tayang di publik.`);
        fetchModerationListings();
      } else {
        showToast("error", data.error || "Gagal menyetujui listing.");
      }
    } catch {
      showToast("error", "Terjadi kesalahan koneksi saat memproses persetujuan.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectModal = (listing: ListingItem) => {
    setSelectedListing(listing);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const submitReject = async () => {
    if (!selectedListing) return;
    setActionLoadingId(selectedListing.id);
    try {
      const res = await fetch("/api/admin/listings/moderation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedListing.id,
          action: "REJECT",
          rejection_reason: rejectionReason.trim() || "Informasi foto/data belum memenuhi syarat Tapak.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Listing "${selectedListing.title}" ditolak.`);
        setRejectModalOpen(false);
        setSelectedListing(null);
        fetchModerationListings();
      } else {
        showToast("error", data.error || "Gagal menolak listing.");
      }
    } catch {
      showToast("error", "Terjadi kesalahan koneksi saat memproses penolakan.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredListings = useMemo(() => {
    if (!searchQuery.trim()) return listings;
    const q = searchQuery.toLowerCase();
    return listings.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.district.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        (l.owner_email && l.owner_email.toLowerCase().includes(q))
    );
  }, [listings, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-[8px] bg-blue-50 text-[#3D77EE]">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Pusat Moderasi &amp; Kurasi Listing
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#687280] mt-1">
            Validasi seluruh listing properti yang diposting oleh mitra pemilik / agen sebelum ditayangkan ke web publik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchModerationListings}
            className="p-2 rounded-[10px] text-slate-600 hover:bg-slate-100 border border-[#E2E8F0] transition"
            title="Refresh Antrean"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#3D77EE]" : ""}`} />
          </button>
          <Link
            href="/explore"
            target="_blank"
            className="px-3.5 py-2 rounded-[10px] text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Explore Publik</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-4 rounded-[12px] border text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in ${
            toastMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-[#687280]">Total Semua Unit</span>
          <div className="text-2xl font-black text-[#111827] mt-1">{counts.all}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Listing di Database</span>
        </div>

        <div className="p-4 rounded-[16px] bg-amber-50/70 border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Menunggu Kurasi</span>
            {counts.pending > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">{counts.pending}</div>
          <span className="text-[11px] text-amber-800 font-semibold mt-0.5 block">
            Perlu Review Admin
          </span>
        </div>

        <div className="p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-[#687280]">Disetujui (Tayang)</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{counts.approved}</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
            Tampil di Web Publik
          </span>
        </div>

        <div className="p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-[#687280]">Ditolak (Revisi)</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{counts.rejected}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Dikembalikan ke Owner</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-[18px] p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="flex items-center bg-slate-50 rounded-[10px] px-3.5 py-2 w-full sm:max-w-md border border-[#E2E8F0] focus-within:border-[#3D77EE] focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul properti, kota, pengunggah..."
              className="bg-transparent border-none outline-none text-[#111827] placeholder:text-slate-400 text-xs sm:text-sm w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "ALL", label: "Semua", count: counts.all },
              { id: "PENDING", label: "Menunggu Kurasi", count: counts.pending, highlight: true },
              { id: "APPROVED", label: "Disetujui", count: counts.approved },
              { id: "REJECTED", label: "Ditolak", count: counts.rejected },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#3D77EE] text-white shadow-2xs"
                    : tab.highlight && tab.count > 0
                    ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Listings Moderation List */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#3D77EE]" />
              <span>Memuat data moderasi...</span>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Tidak ada listing pada filter ini.
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {filteredListings.map((item) => {
                const isPending = item.approval_status === "PENDING";
                const isApproved = item.approval_status === "APPROVED";
                const isRejected = item.approval_status === "REJECTED";
                const isRowLoading = actionLoadingId === item.id;

                return (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors rounded-lg px-2"
                  >
                    {/* Sisi Kiri: Thumbnail & Data Properti */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-[10px] overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
                        <Image
                          src={
                            item.images?.[0] ||
                            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&auto=format&fit=crop&q=80"
                          }
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Status Badge */}
                          {isPending && (
                            <span className="px-2 py-0.5 rounded-[4px] text-[10.5px] font-bold bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Menunggu Kurasi</span>
                            </span>
                          )}
                          {isApproved && (
                            <span className="px-2 py-0.5 rounded-[4px] text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Disetujui &amp; Tayang</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="px-2 py-0.5 rounded-[4px] text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300 inline-flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              <span>Ditolak</span>
                            </span>
                          )}

                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#3D77EE]">
                            {item.property_type}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {item.transaction_type}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">
                            Tier {item.verification_tier}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm sm:text-base text-[#111827] truncate">
                          {item.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#687280]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#3D77EE]" />
                            <span>{item.district}, {item.city}</span>
                          </span>
                          <span>•</span>
                          <span>LB: {item.area_sqm} m²</span>
                          <span>•</span>
                          <span>Owner: {item.owner_email || item.agent_name}</span>
                        </div>

                        {/* Catatan Penolakan jika ada */}
                        {item.rejection_reason && (
                          <div className="p-2 rounded bg-rose-50 border border-rose-100 text-[11px] text-rose-700 font-medium mt-1">
                            Alasan Penolakan: {item.rejection_reason}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sisi Kanan: Harga & Tombol Moderasi */}
                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Harga Penawaran
                        </span>
                        <span className="font-black text-sm sm:text-base text-[#111827]">
                          {formatRupiah(item.price)}
                        </span>
                      </div>

                      {/* Tombol Aksi Moderasi */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/explore?slug=${item.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-[8px] text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
                          title="Pratinjau Unit"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Tombol Tolak */}
                        {!isRejected && (
                          <button
                            type="button"
                            disabled={isRowLoading}
                            onClick={() => openRejectModal(item)}
                            className="px-2.5 py-1.5 rounded-[8px] text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition disabled:opacity-50 cursor-pointer"
                          >
                            Tolak
                          </button>
                        )}

                        {/* Tombol Setujui */}
                        {!isApproved && (
                          <button
                            type="button"
                            disabled={isRowLoading}
                            onClick={() => handleApprove(item)}
                            className="px-3 py-1.5 rounded-[8px] text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-2xs flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Setujui</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Alasan Penolakan */}
      {rejectModalOpen && selectedListing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#111827] flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>Tolak Listing Properti</span>
              </h3>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Anda akan menolak listing <strong className="text-[#111827]">{selectedListing.title}</strong>. Masukkan alasan penolakan agar pemilik properti dapat merevisinya:
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Contoh: Foto kamar mandi buram, mohon upload foto beresolusi tinggi dan lengkapi bukti sertifikat SHM."
              className="w-full px-3.5 py-2.5 rounded-[10px] bg-slate-50 border border-slate-200 text-xs sm:text-sm text-[#111827] focus:outline-none focus:border-rose-500 focus:bg-white"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={actionLoadingId === selectedListing.id}
                onClick={submitReject}
                className="px-4 py-2 rounded-[10px] text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {actionLoadingId === selectedListing.id ? "Memproses..." : "Konfirmasi Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
