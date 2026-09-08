"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Check,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MessageCircle,
  Share2,
} from "lucide-react";
import { ListingItem } from "@/lib/types";
import { formatRupiah, formatWhatsAppUrl } from "@/lib/utils";
import VerificationBadge from "@/components/VerificationBadge";
import ExploreNearbyAmenities from "./ExploreNearbyAmenities";

interface ExploreDetailPanelProps {
  listing: ListingItem;
  onBack?: () => void;
}

export default function ExploreDetailPanel({ listing, onBack }: ExploreDetailPanelProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = listing.images?.length > 0 ? listing.images : [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  ];

  const firstMonthTotal =
    listing.price +
    (listing.maintenance_fee || 0) +
    (listing.utility_estimate || 0) +
    (listing.deposit || 0);

  const waMessage = `Halo ${listing.agent_name}, saya melihat listing "${listing.title}" di Tapak. Saya ingin menanyakan ketersediaan unit dan menjadwalkan survey lokasi.`;
  const waLink = formatWhatsAppUrl(listing.agent_phone, waMessage);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Lihat listing ${listing.title} di Tapak.`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Tautan berhasil disalin ke clipboard!");
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 bg-[#F3F6FB] animate-in fade-in slide-in-from-left-4 duration-200">
      {/* Header Info Properti */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <VerificationBadge tier={listing.verification_tier} size="md" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {listing.property_type}
            </span>
            <span className="text-xs text-[#3D77EE] font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Siap Huni Langsung
            </span>
          </div>

          <button
            onClick={handleShare}
            type="button"
            className="p-2 rounded-[10px] bg-white border border-[#E2E8F0] hover:border-[#3D77EE] text-slate-600 hover:text-[#3D77EE] transition-all shadow-2xs shrink-0 cursor-pointer"
            title="Bagikan Properti"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] leading-snug">
          {listing.title}
        </h1>

        <div className="flex items-center gap-1.5 mt-1.5 text-xs sm:text-sm text-[#687280]">
          <MapPin className="w-4 h-4 text-[#3D77EE] shrink-0" />
          <span>
            {listing.address}, {listing.district}, {listing.city}
          </span>
        </div>
      </div>

      {/* Galeri Gambar Properti */}
      <div className="mb-5 space-y-2">
        <div className="relative aspect-[16/10] w-full rounded-[18px] overflow-hidden bg-slate-100 border border-[#E2E8F0]">
          <Image
            src={images[activeImageIndex] || images[0]}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover transition-all duration-300"
          />
        </div>

        {/* Thumbnail Foto Tambahan */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-12 rounded-[8px] overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIndex === idx
                    ? "border-[#3D77EE] shadow-2xs"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Spesifikasi Ringkas */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="p-3 rounded-[12px] bg-white border border-[#E2E8F0] flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-[8px] bg-blue-50 text-[#3D77EE] flex items-center justify-center shrink-0">
            <Bed className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-[#687280] block">Kamar Tidur</span>
            <span className="text-xs sm:text-sm font-bold text-[#111827] truncate block">
              {listing.bedrooms} KT
            </span>
          </div>
        </div>

        <div className="p-3 rounded-[12px] bg-white border border-[#E2E8F0] flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-[8px] bg-blue-50 text-[#3D77EE] flex items-center justify-center shrink-0">
            <Bath className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-[#687280] block">Kamar Mandi</span>
            <span className="text-xs sm:text-sm font-bold text-[#111827] truncate block">
              {listing.bathrooms} KM
            </span>
          </div>
        </div>

        <div className="p-3 rounded-[12px] bg-white border border-[#E2E8F0] flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-[8px] bg-blue-50 text-[#3D77EE] flex items-center justify-center shrink-0">
            <Maximize2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-[#687280] block">Luas Total</span>
            <span className="text-xs sm:text-sm font-bold text-[#111827] truncate block">
              {listing.area_sqm} m²
            </span>
          </div>
        </div>
      </div>

      {/* Rincian Biaya Transparan */}
      <div className="bg-white rounded-[18px] p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs mb-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3.5">
          <h3 className="font-bold text-sm sm:text-base text-[#111827]">
            Rincian Biaya Transparan
          </h3>
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-[#3D77EE] rounded-full border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Terverifikasi
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0]">
            <span className="text-[#687280]">Harga Sewa Pokok</span>
            <span className="font-extrabold text-[#111827]">
              {formatRupiah(listing.price)}/bln
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-blue-50/40 border border-blue-100">
            <span className="text-[#3D77EE] font-medium">Biaya IPL (Maintenance)</span>
            <span className="font-bold text-[#3D77EE]">
              {formatRupiah(listing.maintenance_fee || 0)}/bln
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0]">
            <span className="text-[#687280]">Estimasi Utilitas (Listrik/Air)</span>
            <span className="font-bold text-[#111827]">
              {formatRupiah(listing.utility_estimate || 0)}/bln
            </span>
          </div>

          {listing.deposit ? (
            <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0]">
              <div>
                <span className="text-slate-700 font-medium block">Deposit Jaminan</span>
                <span className="text-[10px] text-slate-400">Dapat dikembalikan</span>
              </div>
              <span className="font-bold text-[#111827]">
                {formatRupiah(listing.deposit)}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-3.5 pt-3 border-t border-[#E2E8F0] flex items-center justify-between bg-blue-50/30 p-2.5 rounded-[8px]">
          <span className="text-xs font-bold text-[#3D77EE]">Total Masuk Bulan 1:</span>
          <span className="text-base font-black text-[#111827]">
            {formatRupiah(firstMonthTotal)}
          </span>
        </div>
      </div>

      {/* Deskripsi Hunian */}
      <div className="bg-white rounded-[18px] p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs mb-5">
        <h3 className="font-bold text-sm text-[#111827] mb-2">Tentang Hunian Ini</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {listing.description}
        </p>
      </div>

      {/* Fasilitas Utama */}
      {listing.amenities?.length > 0 && (
        <div className="bg-white rounded-[18px] p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs mb-5">
          <h3 className="font-bold text-sm text-[#111827] mb-3">Fasilitas Unit</h3>
          <div className="grid grid-cols-2 gap-2">
            {listing.amenities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-[8px] border border-[#E2E8F0]"
              >
                <Check className="w-3.5 h-3.5 text-[#3D77EE] shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fasilitas Sekitar & Aksesibilitas (Deteksi Otomatis OpenStreetMap) */}
      <ExploreNearbyAmenities
        listingId={listing.id}
        latitude={listing.latitude}
        longitude={listing.longitude}
        propertyTitle={listing.title}
      />

      {/* Kontak Agen Properti */}
      <div className="bg-white rounded-[18px] p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs mb-8">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E2E8F0]">
          <div className="w-10 h-10 rounded-full bg-[#3D77EE] text-white font-bold flex items-center justify-center text-sm">
            {listing.agent_name ? listing.agent_name.slice(0, 2).toUpperCase() : "TP"}
          </div>
          <div>
            <span className="font-bold text-sm text-[#111827] block">{listing.agent_name}</span>
            <span className="text-[11px] text-[#3D77EE] font-medium">● Agen Terverifikasi Tapak.</span>
          </div>
        </div>

        <div className="space-y-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-[10px] shadow-sm transition-all active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat WhatsApp Agen</span>
          </a>

          <a
            href={`tel:${listing.agent_phone}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-xs sm:text-sm rounded-[10px] transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Telepon Langsung</span>
          </a>

          <button
            type="button"
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-[10px] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Pilihan Hunian Lain</span>
          </button>
        </div>
      </div>
    </div>
  );
}
