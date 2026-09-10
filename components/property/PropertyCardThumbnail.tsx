"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import VerificationBadge from "@/components/VerificationBadge";
import { VerificationTier, TransactionType } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";

interface PropertyCardThumbnailProps {
  image: string;
  title: string;
  verificationTier: VerificationTier;
  propertyType: string;
  maintenanceFee: number;
  isHorizontal: boolean;
  transactionType?: TransactionType;
}

export default function PropertyCardThumbnail({
  image,
  title,
  verificationTier,
  propertyType,
  maintenanceFee,
  isHorizontal,
  transactionType = "DISEWAKAN",
}: PropertyCardThumbnailProps) {
  const fallback =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 shrink-0 ${
        isHorizontal
          ? "w-[115px] xs:w-[130px] sm:w-[150px] md:w-[160px] min-h-[115px] sm:min-h-[125px] h-full self-stretch"
          : "w-full aspect-[4/3]"
      }`}
    >
      <Image
        src={image || fallback}
        alt={title}
        fill
        sizes="(max-width: 768px) 150px, 200px"
        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
      />

      <div className="absolute top-1.5 left-1.5 z-10 scale-75 sm:scale-85 origin-top-left">
        <VerificationBadge tier={verificationTier} size="sm" />
      </div>

      <div className="absolute top-1.5 right-1.5 z-10">
        <span className="px-1.5 py-0.5 rounded-[4px] text-[9px] sm:text-[9.5px] font-semibold bg-[#111827]/85 text-white border border-white/10 shadow-2xs">
          {propertyType}
        </span>
      </div>

      {transactionType === "DIJUAL" ? (
        <div className="absolute bottom-1.5 left-1.5 z-10">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] sm:text-[9.5px] font-bold bg-emerald-600 text-white shadow-2xs">
            Dijual
          </span>
        </div>
      ) : maintenanceFee > 0 ? (
        <div className="absolute bottom-1.5 left-1.5 z-10">
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[4px] text-[8.5px] sm:text-[9px] font-semibold bg-[#111827]/85 text-white border border-white/10 shadow-2xs">
            <CheckCircle2 className="w-2.5 h-2.5 text-[#3D77EE]" />
            <span className="truncate max-w-[70px] sm:max-w-none">IPL {formatRupiah(maintenanceFee)}</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}

