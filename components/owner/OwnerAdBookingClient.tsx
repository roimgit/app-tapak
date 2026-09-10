"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Megaphone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Crown,
  ExternalLink,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AdSlotDefinition, AdBookingData, AdSlotType } from "@/lib/ad-slots";
import { formatRupiah } from "@/lib/utils";
import ImageUploadDropzone from "@/components/ui/ImageUploadDropzone";

const PRESET_BANNER_IMAGES = [
  {
    name: "Apartemen SCBD Modern",
    url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Resort Rumah Botanikal",
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Interior Mewah Elegan",
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Penthouse Suite Kota",
    url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function OwnerAdBookingClient() {
  const { user } = useAuth();
  const ownerEmail = user?.email || "owner_demo@tapak.id";
  const ownerName = user?.name || ownerEmail.split("@")[0];

  const [slots, setSlots] = useState<AdSlotDefinition[]>([]);
  const [myBookings, setMyBookings] = useState<AdBookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [selectedSlotType, setSelectedSlotType] = useState<AdSlotType>("BILLBOARD_HOME");
  const [selectedDays, setSelectedDays] = useState<number>(30);
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [paymentSource, setPaymentSource] = useState<"PAID" | "PACKAGE_INCLUDED">("PAID");

  // Creative Content
  const [title, setTitle] = useState("Cluster Eksklusif Lavender — Hunian Mewah Siap Huni");
  const [tag, setTag] = useState("PENAWARAN SPESIAL");
  const [subtitle, setSubtitle] = useState("Cashback sewa Rp 5 Juta & gratis biaya IPL 6 bulan pertama untuk penyewa terverifikasi.");
  const [imageUrl, setImageUrl] = useState(PRESET_BANNER_IMAGES[0].url);
  const [targetUrl, setTargetUrl] = useState("/explore");
  const [ctaText, setCtaText] = useState("Lihat Unit Tersedia");

  // Selected rejection note modal
  const [rejectionModalBooking, setRejectionModalBooking] = useState<AdBookingData | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const loadData = useCallback(async () => {
    try {
      const [resSlots, resMy] = await Promise.all([
        fetch("/api/ads/slots").then((r) => r.json()),
        fetch(`/api/ads/bookings?ownerEmail=${encodeURIComponent(ownerEmail)}`).then((r) => r.json()),
      ]);

      if (resSlots.success && Array.isArray(resSlots.data)) {
        setSlots(resSlots.data);
      }
      if (resMy.success && Array.isArray(resMy.data)) {
        setMyBookings(resMy.data);
      }
    } catch {
      showToast("error", "Gagal memuat data slot iklan.");
    } finally {
      setLoading(false);
    }
  }, [ownerEmail]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch("/api/ads/slots").then((r) => r.json()),
      fetch(`/api/ads/bookings?ownerEmail=${encodeURIComponent(ownerEmail)}`).then((r) => r.json()),
    ])
      .then(([resSlots, resMy]) => {
        if (!isMounted) return;
        if (resSlots.success && Array.isArray(resSlots.data)) {
          setSlots(resSlots.data);
        }
        if (resMy.success && Array.isArray(resMy.data)) {
          setMyBookings(resMy.data);
        }
      })
      .catch(() => {
        if (isMounted) showToast("error", "Gagal memuat data slot iklan.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [ownerEmail]);

  // Current slot definition & price calculation
  const currentSlot = useMemo(() => {
    return slots.find((s) => s.type === selectedSlotType) || slots[0];
  }, [slots, selectedSlotType]);

  const currentRate = useMemo(() => {
    if (!currentSlot?.rates) return null;
    return currentSlot.rates.find((r) => r.days === selectedDays) || currentSlot.rates[0];
  }, [currentSlot, selectedDays]);

  const calculatedEndDate = useMemo(() => {
    if (!startDate) return "";
    const start = new Date(startDate);
    start.setDate(start.getDate() + selectedDays);
    return start.toISOString().split("T")[0];
  }, [startDate, selectedDays]);

  const finalPrice = paymentSource === "PACKAGE_INCLUDED" ? 0 : currentRate?.priceRupiah || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim() || !startDate) {
      showToast("error", "Mohon lengkapi judul, gambar, dan tanggal mulai tayang.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/ads/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotType: selectedSlotType,
          ownerEmail,
          ownerName,
          title,
          tag,
          subtitle,
          imageUrl,
          targetUrl,
          ctaText,
          startDate,
          endDate: calculatedEndDate,
          paymentSource,
          amountPaid: finalPrice,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          "success",
          "Pengajuan slot iklan berhasil dikirim! Status saat ini 'Menunggu Kurasi' oleh tim Administrator."
        );
        loadData();
      } else {
        showToast("error", data.error || "Gagal mengirim pengajuan iklan.");
      }
    } catch {
      showToast("error", "Terjadi kendala jaringan saat memproses booking iklan.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Pasang Slot Iklan Beranda (Self-Service)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#687280] mt-1">
            Tampilkan properti Anda di slot utama beranda Tapak. Pilih durasi tayang, upload materi banner, atau klaim kuota iklan gratis dari paket Anda.
          </p>
        </div>

        <Link
          href="/owner/paket-iklan"
          className="px-3.5 py-2 rounded-[10px] text-xs font-bold text-[#3D77EE] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors inline-flex items-center gap-1.5 w-fit"
        >
          <Crown className="w-3.5 h-3.5 text-amber-500" />
          <span>Lihat Paket Langganan</span>
        </Link>
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

      {/* Form & Live Preview Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sisi Kiri: Form Booking & Materi Iklan (7 Kolom) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Pilih Tipe Slot */}
          <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="font-bold text-sm sm:text-base text-[#111827] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#3D77EE] text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Pilih Tipe Slot Iklan</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Billboard */}
              <button
                type="button"
                onClick={() => setSelectedSlotType("BILLBOARD_HOME")}
                className={`p-4 rounded-[14px] border text-left transition-all cursor-pointer ${
                  selectedSlotType === "BILLBOARD_HOME"
                    ? "bg-blue-50/50 border-[#3D77EE] ring-1 ring-[#3D77EE]"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs sm:text-sm text-[#111827]">
                    Billboard Banner Beranda
                  </span>
                  {selectedSlotType === "BILLBOARD_HOME" && (
                    <CheckCircle2 className="w-4 h-4 text-[#3D77EE]" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  Banner horizontal 16:9 di bagian atas halaman beranda. Visibilitas maksimal ke seluruh pengunjung.
                </p>
                <span className="text-[10px] font-bold text-[#3D77EE] mt-2 block">
                  Mulai Rp 250.000 / 7 hari
                </span>
              </button>

              {/* Option 2: Popup Modal */}
              <button
                type="button"
                onClick={() => setSelectedSlotType("PROMO_POPUP")}
                className={`p-4 rounded-[14px] border text-left transition-all cursor-pointer ${
                  selectedSlotType === "PROMO_POPUP"
                    ? "bg-blue-50/50 border-[#3D77EE] ring-1 ring-[#3D77EE]"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs sm:text-sm text-[#111827]">
                    Popup Modal Promosi
                  </span>
                  {selectedSlotType === "PROMO_POPUP" && (
                    <CheckCircle2 className="w-4 h-4 text-[#3D77EE]" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  Modal dialog interaktif yang otomatis muncul di tengah layar saat beranda dimuat. Tingkat klik tertinggi.
                </p>
                <span className="text-[10px] font-bold text-[#3D77EE] mt-2 block">
                  Mulai Rp 350.000 / 7 hari
                </span>
              </button>
            </div>
          </div>

          {/* Step 2: Durasi & Jadwal Tayang */}
          <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="font-bold text-sm sm:text-base text-[#111827] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#3D77EE] text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Pilih Durasi &amp; Tanggal Mulai Tayang</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-2">
                Pilihan Durasi Sewa Slot:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {currentSlot?.rates.map((rate) => (
                  <button
                    key={rate.days}
                    type="button"
                    onClick={() => setSelectedDays(rate.days)}
                    className={`py-2.5 px-3 rounded-[10px] border text-center transition cursor-pointer ${
                      selectedDays === rate.days
                        ? "bg-[#3D77EE] border-[#3D77EE] text-white shadow-2xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-xs font-bold block">{rate.days} Hari</span>
                    <span
                      className={`text-[10.5px] block font-semibold ${
                        selectedDays === rate.days ? "text-blue-100" : "text-slate-500"
                      }`}
                    >
                      {formatRupiah(rate.priceRupiah)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tanggal Mulai Tayang *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-[8px] bg-slate-50 border border-slate-200 text-xs font-bold text-[#111827]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tanggal Selesai (Otomatis)
                </label>
                <input
                  type="date"
                  value={calculatedEndDate}
                  disabled
                  className="w-full px-3 py-2 rounded-[8px] bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Materi Kreatif Iklan */}
          <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="font-bold text-sm sm:text-base text-[#111827] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#3D77EE] text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Materi Banner &amp; Konten Iklan</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Judul Promosi Banner *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Cluster Lancewood Navapark — Hunian Resort Botanikal"
                className="w-full px-3.5 py-2 rounded-[8px] bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-[#111827] focus:bg-white focus:border-[#3D77EE]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tag Kategori / Badge (Kecil)
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="DEVELOPER RESMI / PROMO KHUSUS"
                  className="w-full px-3 py-1.5 rounded-[8px] bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Teks Tombol Aksi (CTA)
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Lihat Unit Tersedia"
                  className="w-full px-3 py-1.5 rounded-[8px] bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Sub-judul / Penawaran Lengkap
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Bebas iuran pemeliharaan (IPL) 6 bulan pertama..."
                className="w-full px-3.5 py-2 rounded-[8px] bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:bg-white"
              />
            </div>

            <div className="space-y-3">
              <ImageUploadDropzone
                folder="ads"
                initialUrl={imageUrl}
                label="Unggah Desain Banner Iklan (Supabase Storage) *"
                aspectRatioLabel={
                  selectedSlotType === "BILLBOARD_HOME"
                    ? "Rasio 16:9 • Min 1200×675 px • Maks 5MB"
                    : "Rasio 16:10 • Min 800×500 px • Maks 5MB"
                }
                helpText="Gambar diunggah langsung ke Supabase Storage dengan kompresi WebP otomatis untuk menghemat bandwidth."
                onUploadSuccess={(url) => setImageUrl(url)}
              />

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Atau Input URL / Pilih Gambar Preset
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://pub-xxxxxx.r2.dev/ads/banner.webp atau https://..."
                  className="w-full px-3.5 py-2 rounded-[8px] bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:bg-white"
                  required
                />

                {/* Preset Image Recommendations */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold">Pilihan Cepat:</span>
                  {PRESET_BANNER_IMAGES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Tautan / Link Tujuan Saat Iklan Diklik *
              </label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="/explore?slug=nama-unit-anda"
                className="w-full px-3.5 py-2 rounded-[8px] bg-slate-50 border border-slate-200 text-xs font-semibold text-[#3D77EE] focus:bg-white"
                required
              />
              <span className="text-[10.5px] text-slate-400 mt-0.5 block">
                Bisa diisi link unit properti Anda di Tapak (misal: /explore?q=Navapark).
              </span>
            </div>
          </div>

          {/* Step 4: Metode Biaya & Submit */}
          <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="font-bold text-sm sm:text-base text-[#111827] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#3D77EE] text-white text-xs flex items-center justify-center font-bold">
                4
              </span>
              <span>Skema Pembayaran / Klaim Benefit Paket</span>
            </h2>

            <div className="space-y-2.5">
              {/* Option A: Klaim Paket Tertinggi */}
              <label className="flex items-start gap-3 p-3 rounded-[12px] bg-blue-50/50 border border-blue-200 cursor-pointer">
                <input
                  type="radio"
                  name="paymentSource"
                  checked={paymentSource === "PACKAGE_INCLUDED"}
                  onChange={() => setPaymentSource("PACKAGE_INCLUDED")}
                  className="mt-0.5 w-4 h-4 accent-[#3D77EE]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#111827]">
                      Klaim Kuota Slot Iklan Gratis dari Paket Langganan
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-[#3D77EE] text-white">
                      GRATIS Rp 0
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Khusus mitra yang memiliki Paket Juragan Properti (Enterprise). Kuota slot billboard gratis Anda otomatis digunakan.
                  </p>
                </div>
              </label>

              {/* Option B: Bayar Mandiri */}
              <label className="flex items-start gap-3 p-3 rounded-[12px] bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="paymentSource"
                  checked={paymentSource === "PAID"}
                  onChange={() => setPaymentSource("PAID")}
                  className="mt-0.5 w-4 h-4 accent-[#3D77EE]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#111827]">
                      Bayar Mandiri per Slot Tayang ({selectedDays} Hari)
                    </span>
                    <span className="font-black text-xs text-emerald-700">
                      {formatRupiah(currentRate?.priceRupiah || 0)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pembayaran instan via QRIS, Virtual Account BCA, Mandiri, BRI, BNI tanpa perantara.
                  </p>
                </div>
              </label>
            </div>

            {/* Total & Submit Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">
                  Total Biaya Slot Iklan:
                </span>
                <span className="text-lg sm:text-xl font-black text-[#111827]">
                  {formatRupiah(finalPrice)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-[10px] text-xs sm:text-sm font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] transition shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Mengirim Pengajuan..." : "Kirim Pengajuan Iklan"}
              </button>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Live Interactive Preview (5 Kolom) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4 sticky top-20">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#3D77EE]" />
                <span>Pratinjau Tampilan Iklan di Beranda</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Preview
              </span>
            </div>

            {/* Live Billboard Mockup */}
            <div className="rounded-[16px] overflow-hidden border border-slate-300 shadow-sm relative bg-slate-950 aspect-[16/7] flex flex-col justify-end p-4">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover opacity-75"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9.5px] font-black bg-[#3D77EE] text-white uppercase tracking-wider">
                    {tag || "PROMO MITRA"}
                  </span>
                  <span className="text-[10.5px] text-slate-300 font-semibold">{ownerName}</span>
                </div>

                <h3 className="text-white font-black text-sm sm:text-base leading-tight drop-shadow-sm">
                  {title}
                </h3>

                {subtitle && (
                  <p className="text-slate-200 text-[11px] line-clamp-2 leading-relaxed">
                    {subtitle}
                  </p>
                )}

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[8px] bg-[#3D77EE] text-white text-[11px] font-bold shadow-xs">
                    <span>{ctaText || "Lihat Unit"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200/70 text-xs space-y-1.5 text-slate-600">
              <div className="flex items-center justify-between font-bold text-[#111827]">
                <span>Tipe Slot:</span>
                <span>{selectedSlotType === "BILLBOARD_HOME" ? "Billboard Beranda" : "Promo Popup"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rencana Jadwal:</span>
                <span className="font-semibold text-slate-800">{startDate} s/d {calculatedEndDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Durasi Aktif:</span>
                <span className="font-semibold text-slate-800">{selectedDays} Hari Kalender</span>
              </div>
            </div>

            <div className="p-3 rounded-[10px] bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Setelah dikirim, materi iklan akan masuk ke Pusat Kurasi Admin (status <strong>PENDING</strong>). Iklan akan otomatis tayang di halaman depan segera setelah disetujui.
              </span>
            </div>
          </div>
        </div>
      </form>

      {/* Riwayat Pengajuan Iklan Saya */}
      <div className="bg-white rounded-[18px] border border-[#E2E8F0] shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-base text-[#111827]">
              Riwayat Pengajuan Slot Iklan Saya ({myBookings.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau status persetujuan, jadwal tayang, dan riwayat materi iklan yang Anda pasang.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Slot</th>
                <th className="py-2.5 px-3">Judul &amp; Gambar</th>
                <th className="py-2.5 px-3">Jadwal Tayang</th>
                <th className="py-2.5 px-3">Status Moderasi</th>
                <th className="py-2.5 px-3">Biaya</th>
                <th className="py-2.5 px-3 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Memuat riwayat iklan...
                  </td>
                </tr>
              ) : myBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Anda belum pernah mengajukan slot iklan. Silakan gunakan formulir di atas.
                  </td>
                </tr>
              ) : (
                myBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-blue-50 text-[#3D77EE]">
                        {b.slotType === "BILLBOARD_HOME" ? "Billboard" : "Popup"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-8 rounded bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                          <Image src={b.imageUrl} alt={b.title} fill className="object-cover" unoptimized />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-[#111827] block truncate">{b.title}</span>
                          <span className="text-[10px] text-slate-400 truncate block">{b.targetUrl}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                      {b.startDate} s/d {b.endDate}
                    </td>
                    <td className="py-3 px-3">
                      {b.status === "PENDING" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Menunggu Kurasi</span>
                        </span>
                      )}
                      {b.status === "APPROVED" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Disetujui &amp; Tayang</span>
                        </span>
                      )}
                      {b.status === "REJECTED" && (
                        <button
                          type="button"
                          onClick={() => setRejectionModalBooking(b)}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 inline-flex items-center gap-1 cursor-pointer hover:bg-rose-200"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Ditolak (Lihat Alasan)</span>
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-700">
                        {b.paymentSource === "PACKAGE_INCLUDED" ? "Paket Juragan" : formatRupiah(b.amountPaid)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={b.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded text-slate-400 hover:text-[#3D77EE]"
                        title="Buka Tautan"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lihat Alasan Penolakan untuk Owner */}
      {rejectionModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-rose-700 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span>Catatan Revisi dari Administrator</span>
              </h3>
              <button
                onClick={() => setRejectionModalBooking(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Pengajuan iklan untuk <strong className="text-[#111827]">{rejectionModalBooking.title}</strong> belum dapat disetujui dengan alasan:
            </p>

            <div className="p-3.5 rounded-[12px] bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium leading-relaxed">
              {rejectionModalBooking.rejectionNote || "Materi gambar tidak sesuai spesifikasi ukuran atau kualitas."}
            </div>

            <p className="text-[11px] text-slate-500">
              Anda dapat mengajukan ulang materi iklan yang sudah diperbaiki menggunakan formulir di halaman ini.
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setRejectionModalBooking(null)}
                className="px-4 py-2 rounded-[10px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] cursor-pointer"
              >
                Tutup Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
