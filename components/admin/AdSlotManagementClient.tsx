"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Megaphone,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  Save,
  Check,
  X,
  Sliders,
  RefreshCw,
} from "lucide-react";
import { AdSlotDefinition, AdBookingData } from "@/lib/ad-slots";
import { formatRupiah } from "@/lib/utils";

export default function AdSlotManagementClient() {
  const [activeTab, setActiveTab] = useState<"SLOTS" | "MODERATION" | "SCHEDULE">("MODERATION");
  const [slots, setSlots] = useState<AdSlotDefinition[]>([]);
  const [bookings, setBookings] = useState<AdBookingData[]>([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [savingSlots, setSavingSlots] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal Tolak
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<AdBookingData | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const loadData = useCallback(async () => {
    try {
      const [resSlots, resBookings] = await Promise.all([
        fetch("/api/ads/slots").then((r) => r.json()),
        fetch("/api/ads/bookings").then((r) => r.json()),
      ]);

      if (resSlots.success && Array.isArray(resSlots.data)) {
        setSlots(resSlots.data);
      }
      if (resBookings.success && Array.isArray(resBookings.data)) {
        setBookings(resBookings.data);
        if (resBookings.counts) setCounts(resBookings.counts);
      }
    } catch {
      showToast("error", "Gagal memuat data slot iklan dan pengajuan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch("/api/ads/slots").then((r) => r.json()),
      fetch("/api/ads/bookings").then((r) => r.json()),
    ])
      .then(([resSlots, resBookings]) => {
        if (!isMounted) return;
        if (resSlots.success && Array.isArray(resSlots.data)) {
          setSlots(resSlots.data);
        }
        if (resBookings.success && Array.isArray(resBookings.data)) {
          setBookings(resBookings.data);
          if (resBookings.counts) setCounts(resBookings.counts);
        }
      })
      .catch(() => {
        if (isMounted) showToast("error", "Gagal memuat data slot iklan dan pengajuan.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handler update tarif slot iklan
  const handleRateChange = (slotIndex: number, rateIndex: number, newPrice: number) => {
    const updated = [...slots];
    updated[slotIndex].rates[rateIndex].priceRupiah = newPrice;
    setSlots(updated);
  };

  const handleSlotToggle = (
    slotIndex: number,
    field: "isOpen" | "maxRotationSlots",
    val: boolean | number
  ) => {
    const updated = [...slots];
    if (field === "isOpen") {
      updated[slotIndex].isOpen = Boolean(val);
    } else {
      updated[slotIndex].maxRotationSlots = Number(val);
    }
    setSlots(updated);
  };

  const handleSaveSlots = async () => {
    setSavingSlots(true);
    try {
      const res = await fetch("/api/ads/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Tarif dan kuota slot iklan berhasil disimpan!");
      } else {
        showToast("error", data.error || "Gagal menyimpan tarif slot.");
      }
    } catch {
      showToast("error", "Terjadi kesalahan koneksi saat menyimpan tarif.");
    } finally {
      setSavingSlots(false);
    }
  };

  // Handler Moderasi Booking Iklan
  const handleApprove = async (booking: AdBookingData) => {
    setActionLoadingId(booking.id);
    try {
      const res = await fetch("/api/ads/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: booking.id, action: "APPROVE" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Iklan "${booking.title}" berhasil disetujui & dijadwalkan tayang!`);
        loadData();
      } else {
        showToast("error", data.error || "Gagal menyetujui iklan.");
      }
    } catch {
      showToast("error", "Terjadi kesalahan jaringan.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectModal = (booking: AdBookingData) => {
    setSelectedBooking(booking);
    setRejectionNote("");
    setRejectModalOpen(true);
  };

  const submitReject = async () => {
    if (!selectedBooking) return;
    setActionLoadingId(selectedBooking.id);
    try {
      const res = await fetch("/api/ads/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedBooking.id,
          action: "REJECT",
          rejectionNote: rejectionNote.trim() || "Materi visual belum sesuai standar estetika Tapak.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Pengajuan iklan "${selectedBooking.title}" ditolak.`);
        setRejectModalOpen(false);
        setSelectedBooking(null);
        loadData();
      } else {
        showToast("error", data.error || "Gagal menolak materi iklan.");
      }
    } catch {
      showToast("error", "Terjadi kesalahan jaringan.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const approvedBookings = bookings.filter((b) => b.status === "APPROVED");
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-[8px] bg-blue-50 text-[#3D77EE]">
              <Megaphone className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Slot Iklan Beranda &amp; Moderasi Materi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#687280] mt-1">
            Sediakan slot iklan, atur tarif durasi sewa, dan kurasi materi banner/popup yang diajukan oleh mitra pemilik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 rounded-[10px] text-slate-600 hover:bg-slate-100 border border-[#E2E8F0] transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#3D77EE]" : ""}`} />
          </button>
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded-[10px] text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Lihat Beranda Publik</span>
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

      {/* Metric KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-[#687280]">Total Pengajuan Iklan</span>
          <div className="text-2xl font-black text-[#111827] mt-1">{counts.all}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Semua Riwayat Booking</span>
        </div>

        <div className="p-4 rounded-[16px] bg-amber-50/70 border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Perlu Review (Pending)</span>
            {counts.pending > 0 && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />}
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">{counts.pending}</div>
          <span className="text-[11px] text-amber-800 font-semibold mt-0.5 block">
            Materi Iklan Baru Masuk
          </span>
        </div>

        <div className="p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-[#687280]">Iklan Disetujui</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{counts.approved}</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
            Masuk Jadwal Tayang
          </span>
        </div>

        <div className="p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-[#687280]">Slot Tayang Hari Ini</span>
          <div className="text-2xl font-black text-[#3D77EE] mt-1">
            {bookings.filter((b) => b.status === "APPROVED" && b.startDate <= todayStr && b.endDate >= todayStr).length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            Sedang Tampil di Beranda
          </span>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("MODERATION")}
          className={`px-4 py-2 rounded-[10px] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "MODERATION"
              ? "bg-[#3D77EE] text-white shadow-2xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Moderasi Pengajuan Iklan</span>
          {counts.pending > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-900 font-black">
              {counts.pending}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("SLOTS")}
          className={`px-4 py-2 rounded-[10px] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "SLOTS"
              ? "bg-[#3D77EE] text-white shadow-2xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Pengaturan Slot &amp; Tarif Sewa</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("SCHEDULE")}
          className={`px-4 py-2 rounded-[10px] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "SCHEDULE"
              ? "bg-[#3D77EE] text-white shadow-2xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Kalender &amp; Jadwal Tayang</span>
        </button>
      </div>

      {/* TAB 1: MODERASI PENGAJUAN IKLAN */}
      {activeTab === "MODERATION" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm sm:text-base text-[#111827]">
              Antrean Pengajuan Iklan Owner ({pendingBookings.length} Menunggu Persetujuan)
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-[18px] border border-[#E2E8F0]">
              Memuat antrean iklan...
            </div>
          ) : pendingBookings.length === 0 ? (
            <div className="p-12 text-center text-xs sm:text-sm text-slate-500 bg-white rounded-[18px] border border-[#E2E8F0] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-[#111827]">Semua Pengajuan Telah Dimoderasi</p>
              <p className="text-slate-400">Tidak ada materi iklan yang menunggu kurasi saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {pendingBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-[18px] border border-[#E2E8F0] shadow-2xs overflow-hidden p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-[#3D77EE] border border-blue-100">
                        {b.slotType === "BILLBOARD_HOME" ? "Billboard Beranda" : "Promo Popup Modal"}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        PENDING
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-600">
                        Diajukan oleh: <strong className="text-[#111827]">{b.ownerName}</strong> ({b.ownerEmail})
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#3D77EE]" />
                      <span>Rencana Tayang: {b.startDate} s/d {b.endDate}</span>
                    </div>
                  </div>

                  {/* Visual Preview Box */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-center">
                    {/* Visual Banner Preview */}
                    <div className="lg:col-span-2 rounded-[14px] overflow-hidden border border-slate-200 bg-slate-900 relative aspect-[16/6] flex items-center justify-center">
                      <Image
                        src={b.imageUrl}
                        alt={b.title}
                        fill
                        className="object-cover opacity-80"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#3D77EE] text-white w-fit mb-1 uppercase tracking-wider">
                          {b.tag || "PROMO KHUSUS"}
                        </span>
                        <h4 className="text-white font-extrabold text-sm sm:text-base leading-tight">
                          {b.title}
                        </h4>
                        {b.subtitle && (
                          <p className="text-slate-200 text-xs mt-0.5 line-clamp-1">{b.subtitle}</p>
                        )}
                      </div>
                    </div>

                    {/* Booking Details & Actions */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-[14px] border border-slate-200/70 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                          Tautan Tujuan (Link Listing)
                        </span>
                        <a
                          href={b.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#3D77EE] hover:underline truncate block"
                        >
                          {b.targetUrl}
                        </a>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <span className="text-slate-500">Sumber Pembayaran:</span>
                        <span className="font-bold text-slate-800">
                          {b.paymentSource === "PACKAGE_INCLUDED" ? "Paket Tertinggi (Gratis)" : "Bayar Mandiri"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Nilai Transaksi:</span>
                        <span className="font-black text-[#111827]">
                          {b.amountPaid ? formatRupiah(b.amountPaid) : "Termasuk Paket"}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                        <button
                          type="button"
                          disabled={actionLoadingId === b.id}
                          onClick={() => openRejectModal(b)}
                          className="flex-1 py-2 rounded-[8px] text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer disabled:opacity-50"
                        >
                          Tolak
                        </button>
                        <button
                          type="button"
                          disabled={actionLoadingId === b.id}
                          onClick={() => handleApprove(b)}
                          className="flex-1 py-2 rounded-[8px] text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui &amp; Jadwalkan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PENGATURAN SLOT & TARIF */}
      {activeTab === "SLOTS" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm sm:text-base text-[#111827]">
              Konfigurasi Slot Iklan &amp; Skema Tarif Sewa (Untuk Owner)
            </h2>
            <button
              type="button"
              onClick={handleSaveSlots}
              disabled={savingSlots}
              className="px-4 py-2 rounded-[10px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSlots ? "Menyimpan..." : "Simpan Tarif Slot"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {slots.map((slot, sIdx) => (
              <div
                key={slot.type}
                className="bg-white rounded-[18px] border border-[#E2E8F0] shadow-2xs p-5 sm:p-6 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-[#3D77EE]">
                      {slot.type === "BILLBOARD_HOME" ? (
                        <Megaphone className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-[#111827]">{slot.name}</h3>
                      <span className="text-[11px] text-slate-400">{slot.dimensionLabel}</span>
                    </div>
                  </div>

                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slot.isOpen}
                      onChange={(e) => handleSlotToggle(sIdx, "isOpen", e.target.checked)}
                      className="w-4 h-4 accent-[#3D77EE] rounded"
                    />
                    <span className={slot.isOpen ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {slot.isOpen ? "Slot Terbuka" : "Slot Ditutup"}
                    </span>
                  </label>
                </div>

                <p className="text-xs text-[#687280]">{slot.description}</p>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Maksimal Slot Rotasi Bersamaan
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={slot.maxRotationSlots}
                    onChange={(e) => handleSlotToggle(sIdx, "maxRotationSlots", Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#111827]"
                  />
                  <span className="text-[10.5px] text-slate-400 mt-0.5 block">
                    Jumlah banner yang berotasi otomatis setiap 5 detik di beranda.
                  </span>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <label className="block text-[11px] font-bold text-[#111827]">
                    Daftar Tarif Sewa Berdasarkan Durasi:
                  </label>
                  {slot.rates.map((rate, rIdx) => (
                    <div
                      key={rate.days}
                      className="flex items-center justify-between p-2.5 rounded-[10px] bg-slate-50 border border-slate-200 gap-3"
                    >
                      <span className="text-xs font-semibold text-slate-700">{rate.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-400">Rp</span>
                        <input
                          type="number"
                          step={50000}
                          value={rate.priceRupiah}
                          onChange={(e) => handleRateChange(sIdx, rIdx, Number(e.target.value))}
                          className="w-32 px-2.5 py-1 rounded-[6px] bg-white border border-[#E2E8F0] text-xs font-bold text-[#3D77EE] focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: KALENDER & JADWAL TAYANG */}
      {activeTab === "SCHEDULE" && (
        <div className="bg-white rounded-[18px] border border-[#E2E8F0] shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-base text-[#111827]">
                Kalender Jadwal Booking &amp; Slot Tayang ({approvedBookings.length} Terjadwal)
              </h2>
              <p className="text-xs text-[#687280] mt-0.5">
                Pantau periode tayang iklan yang sudah disetujui untuk memastikan tidak ada kekosongan atau bentrok slot.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Tipe Slot</th>
                  <th className="py-2.5 px-3">Judul Iklan &amp; Pengiklan</th>
                  <th className="py-2.5 px-3">Periode Tayang</th>
                  <th className="py-2.5 px-3">Status Hari Ini</th>
                  <th className="py-2.5 px-3">Sumber Biaya</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvedBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Belum ada iklan yang disetujui dalam jadwal tayang.
                    </td>
                  </tr>
                ) : (
                  approvedBookings.map((b) => {
                    const isLiveToday = b.startDate <= todayStr && b.endDate >= todayStr;
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-blue-50 text-[#3D77EE]">
                            {b.slotType === "BILLBOARD_HOME" ? "Billboard" : "Popup"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-[#111827] block truncate max-w-xs">{b.title}</span>
                          <span className="text-[11px] text-slate-400">{b.ownerName} ({b.ownerEmail})</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                          {b.startDate} s/d {b.endDate}
                        </td>
                        <td className="py-3 px-3">
                          {isLiveToday ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Sedang Tayang</span>
                            </span>
                          ) : b.startDate > todayStr ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              Terjadwal
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-400">
                              Selesai
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-slate-700">
                            {b.paymentSource === "PACKAGE_INCLUDED" ? "Paket Tertinggi" : formatRupiah(b.amountPaid)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <a
                            href={b.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded text-slate-500 hover:text-[#3D77EE] hover:bg-slate-100 inline-flex"
                            title="Buka Tautan"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Alasan Penolakan */}
      {rejectModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#111827] flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>Tolak Materi Iklan Owner</span>
              </h3>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Anda akan menolak pengajuan iklan <strong className="text-[#111827]">{selectedBooking.title}</strong> dari <strong className="text-[#111827]">{selectedBooking.ownerName}</strong>. Berikan catatan revisi:
            </p>

            <textarea
              rows={3}
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="Contoh: Rasio gambar tidak sesuai format 16:9 atau resolusi terlalu rendah. Mohon gunakan gambar HD tanpa watermark."
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
                disabled={actionLoadingId === selectedBooking.id}
                onClick={submitReject}
                className="px-4 py-2 rounded-[10px] text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {actionLoadingId === selectedBooking.id ? "Memproses..." : "Konfirmasi Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
