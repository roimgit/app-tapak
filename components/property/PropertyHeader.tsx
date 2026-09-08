import React from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Heart, MapPin, CheckCircle2 } from "lucide-react";
import VerificationBadge from "@/components/VerificationBadge";
import { ListingItem } from "@/lib/types";

interface PropertyHeaderProps {
  listing: ListingItem;
}

export default function PropertyHeader({ listing }: PropertyHeaderProps) {
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
            className="p-2 rounded-[10px] bg-white border border-slate-200 text-slate-600 hover:text-[#3D77EE] transition-all shadow-xs"
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
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {listing.property_type}
        </span>
        <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Siap Huni Langsung
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight">
        {listing.title}
      </h1>

      <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-[#687280]">
        <MapPin className="w-4 h-4 text-[#3D77EE] shrink-0" />
        <span>
          {listing.address}, {listing.district}, {listing.city}
        </span>
      </div>
    </div>
  );
}
