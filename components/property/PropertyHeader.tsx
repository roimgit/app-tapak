"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Heart, MapPin, CheckCircle2, EyeOff, ExternalLink } from "lucide-react";
import VerificationBadge from "@/components/VerificationBadge";
import { ListingItem } from "@/lib/types";

interface PropertyHeaderProps {
  listing: ListingItem;
}

export default function PropertyHeader({ listing }: PropertyHeaderProps) {
  const handleShare = () => {
    const shareUrl =
      typeof window !== "undefined"
        ? (listing.slug ? `${window.location.origin}/property/${listing.slug}` : window.location.href)
        : "";

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: listing.title,
          text: `Lihat listing ${listing.title} di Tapak.`,
          url: shareUrl,
        })
        .catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert("Tautan properti berhasil disalin ke clipboard!");
    }
  };

  const googleMapsUrl =
    listing.latitude && listing.longitude
      ? `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.address || listing.title}, ${listing.district}, ${listing.city}`)}`;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#687280] hover:text-[#3D77EE] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Peta Jelajah</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-[10px] bg-white border border-slate-200 text-slate-600 hover:text-[#3D77EE] transition-all shadow-xs cursor-pointer"
            title="Bagikan Properti"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 rounded-[10px] bg-white border border-slate-200 text-slate-600 hover:text-rose-600 transition-all shadow-xs"
            title="Simpan ke Favorit"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 mb-2">
        <VerificationBadge tier={listing.verification_tier} size="md" />

        {/* Badge Jenis Transaksi */}
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            listing.transaction_type === "DIJUAL"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-blue-50 text-[#3D77EE] border border-blue-200"
          }`}
        >
          {listing.transaction_type === "DIJUAL" ? "Dijual" : "Disewakan"}
        </span>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {listing.property_type}
        </span>

        {/* Badge Sertifikat */}
        {listing.certificate_type && (
          <span className="text-xs text-slate-600 font-semibold bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
            {listing.certificate_type.replace("_", " ")}
          </span>
        )}

        {/* Status Tersedia */}
        {listing.transaction_type === "DISEWAKAN" && (
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Siap Huni
          </span>
        )}

        {/* Private listing indicator */}
        {listing.is_private && (
          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
            <EyeOff className="w-3 h-3" />
            Listing Privat
          </span>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight">
        {listing.title}
      </h1>

      <div className="flex items-center flex-wrap gap-2.5 mt-2.5 text-xs sm:text-sm text-[#687280]">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#3D77EE] shrink-0" />
          <span>
            {listing.is_private
              ? `Kawasan ${listing.district}, ${listing.city}`
              : `${listing.address}, ${listing.district}, ${listing.city}`}
          </span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-xs font-semibold text-[#3D77EE] bg-blue-50 hover:bg-blue-100/80 border border-blue-200 transition-colors shadow-2xs cursor-pointer"
          title="Buka Lokasi di Google Maps"
        >
          <span>Buka Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
