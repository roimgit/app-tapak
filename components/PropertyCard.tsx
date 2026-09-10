"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize2, MapPin } from "lucide-react";
import { ListingItem } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";
import PropertyCardThumbnail from "./property/PropertyCardThumbnail";

interface PropertyCardProps {
  listing: ListingItem;
  layout?: "grid" | "horizontal";
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
  onViewDetail?: (id: string) => void;
  isSelected?: boolean;
}

export default function PropertyCard({
  listing,
  layout = "grid",
  onSelect,
  onHover,
  onViewDetail,
  isSelected = false,
}: PropertyCardProps) {
  const isHorizontal = layout === "horizontal";

  // Dense row format matching mobile/desktop real-estate list row format
  if (isHorizontal) {
    const isSale = listing.transaction_type === "DIJUAL";
    const fallback =
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80";
    const photo = listing.images?.[0] || fallback;

    return (
      <div
        onClick={() => onSelect?.(listing.id)}
        onMouseEnter={() => onHover?.(listing.id)}
        onMouseLeave={() => onHover?.(null)}
        className={`group px-3 py-2.5 sm:px-3.5 sm:py-3 border-b border-[#E2E8F0] flex items-start gap-3 transition-colors cursor-pointer select-none ${
          isSelected
            ? "bg-[#3D77EE]/8 border-l-[3.5px] border-l-[#3D77EE] pl-2 sm:pl-2.5"
            : "hover:bg-slate-50/80 bg-white"
        }`}
      >
        {/* Left Side: Thumbnail Image */}
        <div className="shrink-0 relative w-[80px] h-[80px] sm:w-[88px] sm:h-[88px] rounded-[8px] overflow-hidden bg-slate-100 border border-[#E2E8F0] mt-0.5">
          <Image
            src={photo}
            alt={listing.title}
            fill
            sizes="88px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Right Side: Information & Action Button */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
          <div>
            {/* Top Tag / Pill */}
            <div className="flex items-center gap-1.5 mb-0.5">
              {listing.verification_tier === "GOLD" || listing.verification_tier === "SILVER" ? (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[9px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  saran
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[9px] font-medium bg-slate-100 text-slate-600">
                  {listing.property_type || "Hunian"}
                </span>
              )}

              {isSale && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                  Dijual
                </span>
              )}
            </div>

            {/* Main Title / Price Line */}
            <div className="mb-0.5">
              <h3 className="font-extrabold text-[13.5px] sm:text-[14.5px] text-[#111827] group-hover:text-[#3D77EE] transition-colors leading-tight truncate">
                {isSale ? "Jual " : "Sewa "}
                {formatRupiah(listing.price)}
                {!isSale && <span className="text-[10.5px] font-normal text-[#687280]">/bln</span>}
              </h3>
            </div>

            {/* Second Line: IPL / Maintenance or Legalitas */}
            <div className="text-[11px] sm:text-[11.5px] font-semibold text-[#111827] mb-0.5 truncate">
              {listing.maintenance_fee && listing.maintenance_fee > 0 ? (
                <span>Biaya perawatan {formatRupiah(listing.maintenance_fee)}</span>
              ) : listing.certificate_type ? (
                <span>Sertifikat {listing.certificate_type}</span>
              ) : (
                <span>Bebas biaya perawatan</span>
              )}
            </div>

            {/* Third Line: Specs with middle dots */}
            <div className="text-[10.5px] sm:text-[11px] text-[#4B5563] mb-0.5 truncate flex items-center gap-1">
              <span>{listing.property_type}</span>
              <span>·</span>
              <span>{listing.bedrooms} KT</span>
              <span>·</span>
              <span>{listing.bathrooms} KM</span>
              <span>·</span>
              {listing.land_area_sqm ? (
                <span>LT {listing.land_area_sqm}/LB {listing.area_sqm} m²</span>
              ) : (
                <span>{listing.area_sqm} m²</span>
              )}
            </div>

            {/* Fourth Line: Location */}
            <div className="text-[10px] sm:text-[10.5px] text-[#6B7280] truncate mb-0.5">
              {listing.district}, {listing.city}
            </div>
          </div>

          {/* Bottom Row: Snippet & Action Button */}
          <div className="flex items-center justify-between gap-2 mt-1 pt-1 border-t border-slate-100">
            <div className="text-[9.5px] sm:text-[10px] text-[#9CA3AF] truncate leading-tight flex-1">
              {listing.title}
            </div>

            {onViewDetail ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(listing.id);
                }}
                className="px-2.5 py-1 text-[10.5px] font-semibold text-white bg-[#3D77EE] hover:bg-[#2B55AB] rounded-[6px] transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0 inline-flex items-center gap-1"
              >
                <span>Lihat Detail</span>
              </button>
            ) : (
              <Link
                href={`/explore?slug=${listing.slug}`}
                className="px-2.5 py-1 text-[10.5px] font-semibold text-white bg-[#3D77EE] hover:bg-[#2B55AB] rounded-[6px] transition-all shadow-2xs shrink-0 inline-flex items-center gap-1"
              >
                <span>Lihat Detail</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid layout for Homepage / Agent Storefront
  return (
    <div
      onClick={() => onSelect?.(listing.id)}
      onMouseEnter={() => onHover?.(listing.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group bg-white border transition-all duration-200 overflow-hidden flex flex-col rounded-[18px] cursor-pointer ${
        isSelected
          ? "border-[#3D77EE] shadow-sm ring-1 ring-[#3D77EE]/25"
          : "border-[#E2E8F0] hover:border-[#3D77EE] shadow-2xs"
      }`}
    >
      <PropertyCardThumbnail
        image={listing.images[0]}
        title={listing.title}
        verificationTier={listing.verification_tier}
        propertyType={listing.property_type}
        maintenanceFee={listing.maintenance_fee}
        isHorizontal={false}
        transactionType={listing.transaction_type}
      />

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 font-medium text-[#687280] text-xs mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#3D77EE] shrink-0" />
            <span className="truncate">
              {listing.district}, {listing.city}
            </span>
          </div>

          {onViewDetail ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail(listing.id);
              }}
              className="text-left font-bold text-[#111827] group-hover:text-[#3D77EE] transition-colors line-clamp-1 w-full cursor-pointer text-base mb-2.5"
              title={listing.title}
            >
              {listing.title}
            </button>
          ) : (
            <Link
              href={`/explore?slug=${listing.slug}`}
              className="block font-bold text-[#111827] group-hover:text-[#3D77EE] transition-colors line-clamp-1 text-base mb-2.5"
              title={listing.title}
            >
              {listing.title}
            </Link>
          )}

          <div className="flex items-center border-y border-[#E2E8F0] text-[#687280] gap-4 py-2 text-xs">
            <div className="flex items-center gap-1" title={`${listing.bedrooms} Kamar Tidur`}>
              <Bed className="w-3 h-3 text-slate-500" />
              <span>{listing.bedrooms} KT</span>
            </div>
            <div className="flex items-center gap-1" title={`${listing.bathrooms} Kamar Mandi`}>
              <Bath className="w-3 h-3 text-slate-500" />
              <span>{listing.bathrooms} KM</span>
            </div>
            {listing.land_area_sqm ? (
              <div
                className="flex items-center gap-1"
                title={`LT ${listing.land_area_sqm} / LB ${listing.area_sqm} m²`}
              >
                <Maximize2 className="w-3 h-3 text-slate-500" />
                <span className="truncate">
                  LT {listing.land_area_sqm} / LB {listing.area_sqm}m²
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1" title={`Luas ${listing.area_sqm} m²`}>
                <Maximize2 className="w-3 h-3 text-slate-500" />
                <span>{listing.area_sqm} m²</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 mt-4 pt-2">
          <div className="min-w-0">
            <span className="text-[#687280] block leading-tight text-xs">
              {listing.transaction_type === "DIJUAL" ? "Harga Jual" : "Mulai dari"}
            </span>
            <div className="flex items-baseline gap-1 truncate">
              <span className="font-extrabold text-[#111827] truncate text-lg sm:text-xl">
                {formatRupiah(listing.price)}
              </span>
              {listing.transaction_type !== "DIJUAL" && (
                <span className="text-[10px] sm:text-xs text-[#687280] font-normal shrink-0">
                  /bln
                </span>
              )}
            </div>
          </div>

          {onViewDetail ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail(listing.id);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#3D77EE] hover:bg-[#2B55AB] rounded-[8px] transition-colors inline-flex items-center justify-center shrink-0 shadow-xs cursor-pointer active:scale-95"
            >
              Lihat Detail
            </button>
          ) : (
            <Link
              href={`/explore?slug=${listing.slug}`}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#3D77EE] hover:bg-[#2B55AB] rounded-[8px] transition-colors inline-flex items-center justify-center shrink-0 shadow-xs"
            >
              Lihat Detail
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}


