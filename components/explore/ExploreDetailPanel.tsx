"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MessageCircle,
  Share2,
  Lock,
} from "lucide-react";
import { ListingItem } from "@/lib/types";
import { formatRupiah, formatWhatsAppUrl } from "@/lib/utils";
import VerificationBadge from "@/components/VerificationBadge";
import ExploreNearbyAmenities from "./ExploreNearbyAmenities";
import { useAuth } from "@/context/AuthContext";
import LoginRequiredModal from "@/components/auth/LoginRequiredModal";
import { getUnitAmenityIcon } from "@/lib/amenity-icons";
import { slugifyAgent } from "@/lib/agents";

interface ExploreDetailPanelProps {
  listing: ListingItem;
  onBack?: () => void;
}

export default function ExploreDetailPanel({ listing, onBack }: ExploreDetailPanelProps) {
  const { checkAuth, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
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
    window.location.href = `tel:${listing.agent_phone}`;
  };

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
    <div className="w-full h-full overflow-y-auto bg-white animate-in fade-in duration-200">
      {/* Sticky Top Header with Back button & Share */}
      <div className="sticky top-0 z-20 bg-white px-3.5 sm:px-4 py-2.5 border-b border-[#E2E8F0] flex items-center justify-between shrink-0 shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#111827] hover:text-[#3D77EE] px-2.5 py-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar</span>
        </button>

        <button
          onClick={handleShare}
          type="button"
          className="p-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#3D77EE] transition-colors cursor-pointer"
          title="Bagikan Properti"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Galeri Gambar Properti (Full Width) */}
      <div className="border-b border-[#E2E8F0]">
        <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
          <Image
            src={images[activeImageIndex] || images[0]}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            priority
            className="object-cover transition-all duration-300"
          />
        </div>

        {/* Thumbnail Foto Tambahan */}
        {images.length > 1 && (
          <div className="px-3.5 sm:px-4 py-2 flex gap-2 overflow-x-auto bg-white">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-14 h-11 rounded-[6px] overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? "border-[#3D77EE] shadow-2xs"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="" fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Header Info Properti */}
      <div className="px-3.5 sm:px-4 py-3.5 border-b border-[#E2E8F0]">
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <VerificationBadge tier={listing.verification_tier} size="sm" />
          <span
            className={`px-2 py-0.5 rounded-[4px] text-[10.5px] font-bold ${
              listing.transaction_type === "DIJUAL"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-blue-50 text-[#3D77EE] border border-blue-200"
            }`}
          >
            {listing.transaction_type === "DIJUAL" ? "Dijual" : "Disewakan"}
          </span>
          <span className="px-2 py-0.5 rounded-[4px] text-[10.5px] font-semibold bg-slate-100 text-slate-700">
            {listing.property_type}
          </span>
          {listing.certificate_type && (
            <span className="text-[10.5px] text-slate-600 font-semibold bg-slate-50 px-2 py-0.5 rounded-[4px] border border-slate-200">
              {listing.certificate_type.replace("_", " ")}
            </span>
          )}
          {listing.transaction_type === "DISEWAKAN" && (
            <span className="text-[10.5px] text-[#3D77EE] font-semibold bg-blue-50 px-2 py-0.5 rounded-[4px] border border-blue-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Siap Huni
            </span>
          )}
        </div>

        <div className="mb-1">
          <span className="text-xs text-[#687280]">
            {listing.transaction_type === "DIJUAL" ? "Harga Jual Total" : "Harga Sewa"}
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#111827]">
            {formatRupiah(listing.price)}
            {listing.transaction_type !== "DIJUAL" && (
              <span className="text-xs font-normal text-[#687280]"> /bulan</span>
            )}
          </div>
        </div>

        <h1 className="text-base sm:text-lg font-bold text-[#111827] leading-snug mt-1">
          {listing.title}
        </h1>

        <div className="flex items-center gap-1 mt-1 text-xs text-[#687280]">
          <MapPin className="w-3.5 h-3.5 text-[#3D77EE] shrink-0" />
          <span className="truncate">
            {listing.is_private
              ? `Kawasan ${listing.district}, ${listing.city}`
              : `${listing.address}, ${listing.district}, ${listing.city}`}
          </span>
        </div>
      </div>

      {/* Spesifikasi Ringkas */}
      <div className="px-3.5 sm:px-4 py-3 border-b border-[#E2E8F0]">
        <div className={`grid ${listing.land_area_sqm ? "grid-cols-4" : "grid-cols-3"} gap-2`}>
          <div className="p-2.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0] flex items-center gap-2">
            <div className="w-7 h-7 rounded-[6px] bg-blue-50 text-[#3D77EE] flex items-center justify-center shrink-0">
              <Bed className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#687280] block">Kamar Tidur</span>
              <span className="text-xs font-bold text-[#111827] truncate block">
                {listing.bedrooms} KT
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0] flex items-center gap-2">
            <div className="w-7 h-7 rounded-[6px] bg-blue-50 text-[#3D77EE] flex items-center justify-center shrink-0">
              <Bath className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#687280] block">Kamar Mandi</span>
              <span className="text-xs font-bold text-[#111827] truncate block">
                {listing.bathrooms} KM
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0] flex items-center gap-2">
            <div className="w-7 h-7 rounded-[6px] bg-blue-50 text-[#3D77EE] flex items-center justify-center shrink-0">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#687280] block">Luas Bangunan</span>
              <span className="text-xs font-bold text-[#111827] truncate block">
                {listing.area_sqm} m²
              </span>
            </div>
          </div>

          {listing.land_area_sqm ? (
            <div className="p-2.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0] flex items-center gap-2">
              <div className="w-7 h-7 rounded-[6px] bg-blue-50 text-[#3D77EE] flex items-center justify-center shrink-0">
                <Maximize2 className="w-3.5 h-3.5 opacity-60" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#687280] block">Luas Tanah</span>
                <span className="text-xs font-bold text-[#111827] truncate block">
                  {listing.land_area_sqm} m²
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Rincian Biaya Transparan / Estimasi Biaya Pembelian */}
      <div className="px-3.5 sm:px-4 py-3.5 border-b border-[#E2E8F0]">
        {listing.transaction_type === "DIJUAL" ? (
          <div>
            <div className="flex items-center justify-between pb-2 mb-2.5">
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#111827]">
                  Estimasi Biaya Pembelian
                </h3>
                {listing.price_status && (
                  <span className="text-[10.5px] font-semibold text-slate-500">
                    Status: {listing.price_status === "NEGO" ? "Bisa Nego" : "Harga Nett"}
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-[4px] border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                Dijual
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-[6px] bg-slate-50 border border-[#E2E8F0]">
                <span className="text-[#687280]">Harga Jual Properti</span>
                <span className="font-extrabold text-[#111827]">
                  {formatRupiah(listing.price)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-[6px] bg-blue-50/40 border border-blue-100">
                <span className="text-[#3D77EE] font-medium">Estimasi Biaya Notaris (~1%)</span>
                <span className="font-bold text-[#3D77EE]">
                  ~{formatRupiah(Math.round(listing.price * 0.01))}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-[6px] bg-slate-50 border border-[#E2E8F0]">
                <span className="text-[#687280]">Estimasi Biaya Balik Nama (~0.5%)</span>
                <span className="font-bold text-[#111827]">
                  ~{formatRupiah(Math.round(listing.price * 0.005))}
                </span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-center justify-between bg-blue-50/30 p-2 rounded-[6px]">
              <span className="text-xs font-bold text-[#3D77EE]">Total Estimasi Biaya:</span>
              <span className="text-sm sm:text-base font-black text-[#111827]">
                {formatRupiah(listing.price + Math.round(listing.price * 0.015))}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between pb-2 mb-2.5">
              <h3 className="font-bold text-xs sm:text-sm text-[#111827]">
                Rincian Biaya Transparan
              </h3>
              <span className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 bg-blue-50 text-[#3D77EE] rounded-[4px] border border-blue-200">
                <ShieldCheck className="w-3 h-3" />
                Terverifikasi
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-[6px] bg-slate-50 border border-[#E2E8F0]">
                <span className="text-[#687280]">Harga Sewa Pokok</span>
                <span className="font-extrabold text-[#111827]">
                  {formatRupiah(listing.price)}/bln
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-[6px] bg-blue-50/40 border border-blue-100">
                <span className="text-[#3D77EE] font-medium">Biaya IPL (Maintenance)</span>
                <span className="font-bold text-[#3D77EE]">
                  {formatRupiah(listing.maintenance_fee || 0)}/bln
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-[6px] bg-slate-50 border border-[#E2E8F0]">
                <span className="text-[#687280]">Estimasi Utilitas (Listrik/Air)</span>
                <span className="font-bold text-[#111827]">
                  {formatRupiah(listing.utility_estimate || 0)}/bln
                </span>
              </div>

              {listing.deposit ? (
                <div className="flex items-center justify-between p-2 rounded-[6px] bg-slate-50 border border-[#E2E8F0]">
                  <div>
                    <span className="text-slate-700 font-medium block">Deposit Jaminan</span>
                    <span className="text-[9.5px] text-slate-400">Dapat dikembalikan</span>
                  </div>
                  <span className="font-bold text-[#111827]">
                    {formatRupiah(listing.deposit)}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-center justify-between bg-blue-50/30 p-2 rounded-[6px]">
              <span className="text-xs font-bold text-[#3D77EE]">Total Masuk Bulan 1:</span>
              <span className="text-sm sm:text-base font-black text-[#111827]">
                {formatRupiah(firstMonthTotal)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Deskripsi Hunian */}
      <div className="px-3.5 sm:px-4 py-3.5 border-b border-[#E2E8F0]">
        <h3 className="font-bold text-xs sm:text-sm text-[#111827] mb-1.5">Tentang Hunian Ini</h3>
        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
          {listing.description}
        </p>
      </div>

      {/* Fasilitas Unit */}
      {listing.amenities?.length > 0 && (
        <div className="px-3.5 sm:px-4 py-3.5 border-b border-[#E2E8F0]">
          <h3 className="font-bold text-xs sm:text-sm text-[#111827] mb-2.5">Fasilitas Unit</h3>
          <div className="grid grid-cols-2 gap-2">
            {listing.amenities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-[6px] border border-[#E2E8F0]"
              >
                <span className="text-[#3D77EE] shrink-0">
                  {getUnitAmenityIcon(item, "w-3.5 h-3.5")}
                </span>
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fasilitas Sekitar & Aksesibilitas (Deteksi Otomatis OpenStreetMap) */}
      <div className="px-3.5 sm:px-4">
        <ExploreNearbyAmenities
          listingId={listing.id}
          latitude={listing.latitude}
          longitude={listing.longitude}
          propertyTitle={listing.title}
          isFullWidth={true}
        />
      </div>

      {/* Kontak Agen Properti */}
      <div className="px-3.5 sm:px-4 py-4 pb-12">
        <Link
          href={`/agen/${slugifyAgent(listing.agent_name)}`}
          className="flex items-center justify-between gap-3 mb-3.5 pb-3 border-b border-[#E2E8F0] group cursor-pointer hover:bg-slate-50 -mx-1 px-1 py-1 rounded-[8px] transition-colors"
          title={`Kunjungi etalase properti ${listing.agent_name}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#3D77EE] text-white font-bold flex items-center justify-center text-xs shrink-0 group-hover:scale-105 transition-transform">
              {listing.agent_name ? listing.agent_name.slice(0, 2).toUpperCase() : "TP"}
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-[#111827] group-hover:text-[#3D77EE] transition-colors block">
                {listing.agent_name}
              </span>
              <span className="text-[10.5px] text-[#3D77EE] font-medium">● Agen Terverifikasi Tapak.</span>
            </div>
          </div>
          <span className="text-[10.5px] font-semibold text-[#3D77EE] bg-blue-50 group-hover:bg-[#3D77EE] group-hover:text-white px-2 py-0.5 rounded-[6px] border border-blue-200 transition-all shrink-0">
            Etalase &rarr;
          </span>
        </Link>

        {!isAuthenticated && (
          <div className="mb-3 p-2 rounded-[6px] bg-blue-50/70 border border-blue-100 flex items-center gap-1.5 text-[10.5px] text-[#3D77EE] font-semibold">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Wajib masuk akun untuk menghubungi agen</span>
          </div>
        )}

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-[8px] shadow-2xs transition-all active:scale-98 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat WhatsApp Agen</span>
            {!isAuthenticated && <Lock className="w-3.5 h-3.5 text-white/80 ml-auto" />}
          </button>

          <button
            type="button"
            onClick={handlePhoneClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-xs sm:text-sm rounded-[8px] transition-colors cursor-pointer active:scale-98"
          >
            <Phone className="w-4 h-4" />
            <span>Telepon Langsung</span>
            {!isAuthenticated && <Lock className="w-3.5 h-3.5 text-white/80 ml-auto" />}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-[8px] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Pilihan Hunian Lain</span>
          </button>
        </div>
      </div>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        targetName={listing.agent_name}
        redirectUrl={`/explore`}
      />
    </div>
  );
}
