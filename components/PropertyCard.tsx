"use client";

import React from "react";
import Link from "next/link";
import { Bed, Bath, Maximize2, MapPin } from "lucide-react";
import { ListingItem } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";
import PropertyCardThumbnail from "./property/PropertyCardThumbnail";

interface PropertyCardProps {
  listing: ListingItem;
  layout?: "grid" | "horizontal";
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

export default function PropertyCard({
  listing,
  layout = "grid",
  onSelect,
  isSelected = false,
}: PropertyCardProps) {
  const isHorizontal = layout === "horizontal";

  return (
    <div
      onClick={() => onSelect?.(listing.id)}
      className={`group bg-white rounded-[18px] border transition-all duration-300 overflow-hidden flex ${
        isHorizontal ? "flex-col sm:flex-row h-auto" : "flex-col"
      } ${
        isSelected
          ? "border-[#3D77EE] ring-2 ring-[#3D77EE]/20 shadow-lg shadow-blue-500/10"
          : "border-slate-200/80 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
      }`}
    >
      <PropertyCardThumbnail
        image={listing.images[0]}
        title={listing.title}
        verificationTier={listing.verification_tier}
        propertyType={listing.property_type}
        maintenanceFee={listing.maintenance_fee}
        isHorizontal={isHorizontal}
      />

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#687280] mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#3D77EE] shrink-0" />
            <span className="truncate">{listing.district}, {listing.city}</span>
          </div>

          <Link
            href={`/property/${listing.slug}`}
            className="block font-semibold text-base text-[#111827] group-hover:text-[#3D77EE] transition-colors line-clamp-1 mb-2.5"
            title={listing.title}
          >
            {listing.title}
          </Link>

          <div className="flex items-center gap-4 py-2 border-y border-slate-100 text-xs text-[#687280]">
            <div className="flex items-center gap-1.5" title={`${listing.bedrooms} Kamar Tidur`}>
              <Bed className="w-3.5 h-3.5 text-slate-500" />
              <span>{listing.bedrooms} KT</span>
            </div>
            <div className="flex items-center gap-1.5" title={`${listing.bathrooms} Kamar Mandi`}>
              <Bath className="w-3.5 h-3.5 text-slate-500" />
              <span>{listing.bathrooms} KM</span>
            </div>
            <div className="flex items-center gap-1.5" title={`Luas ${listing.area_sqm} m²`}>
              <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{listing.area_sqm} m²</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-2 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-[#687280] block">Mulai dari</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-bold text-[#111827]">
                {formatRupiah(listing.price)}
              </span>
              <span className="text-xs text-[#687280] font-normal">/bulan</span>
            </div>
          </div>

          <Link
            href={`/property/${listing.slug}`}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#3D77EE] hover:bg-[#2B55AB] rounded-[10px] transition-colors inline-flex items-center shadow-xs"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
