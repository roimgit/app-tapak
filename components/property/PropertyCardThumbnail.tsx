"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import VerificationBadge from "@/components/VerificationBadge";
import { VerificationTier } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";

interface PropertyCardThumbnailProps {
  image: string;
  title: string;
  verificationTier: VerificationTier;
  propertyType: string;
  maintenanceFee: number;
  isHorizontal: boolean;
}

export default function PropertyCardThumbnail({
  image,
  title,
  verificationTier,
  propertyType,
  maintenanceFee,
  isHorizontal,
}: PropertyCardThumbnailProps) {
  const fallback =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 ${
        isHorizontal
          ? "w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto sm:min-h-[220px]"
          : "w-full aspect-[4/3]"
      }`}
    >
      <Image
        src={image || fallback}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
      />

      <div className="absolute top-3 left-3 z-10">
        <VerificationBadge tier={verificationTier} size="sm" />
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
          {propertyType}
        </span>
      </div>

      {maintenanceFee > 0 && (
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            IPL: {formatRupiah(maintenanceFee)}/bln
          </span>
        </div>
      )}
    </div>
  );
}
