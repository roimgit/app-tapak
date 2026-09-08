import React from "react";
import { ShieldCheck, Award, ShieldAlert, Check } from "lucide-react";
import { VerificationTier } from "@/lib/types";

interface VerificationBadgeProps {
  tier: VerificationTier;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function VerificationBadge({
  tier,
  size = "sm",
  showLabel = true,
}: VerificationBadgeProps) {
  if (tier === "GOLD") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-xs ${
          size === "sm"
            ? "px-2.5 py-0.5 text-xs"
            : size === "md"
            ? "px-3 py-1 text-xs"
            : "px-4 py-1.5 text-sm"
        } bg-amber-50 text-amber-900 border-amber-300`}
        title="Terverifikasi Gold: Sertifikat Legalitas, Fisik, dan Akurasi Biaya Terinspeksi 100%"
      >
        <Award className={size === "sm" ? "w-3.5 h-3.5 text-amber-600" : "w-4 h-4 text-amber-600"} />
        {showLabel && <span>Verifikasi Gold</span>}
      </span>
    );
  }

  if (tier === "SILVER") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-xs ${
          size === "sm"
            ? "px-2.5 py-0.5 text-xs"
            : size === "md"
            ? "px-3 py-1 text-xs"
            : "px-4 py-1.5 text-sm"
        } bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]`}
        title="Terverifikasi Silver: Inspeksi Fisik Lapangan & Pemilik Terverifikasi"
      >
        <ShieldCheck className={size === "sm" ? "w-3.5 h-3.5 text-[#0EA5E9]" : "w-4 h-4 text-[#0EA5E9]"} />
        {showLabel && <span>Verifikasi Silver</span>}
      </span>
    );
  }

  if (tier === "BRONZE") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-xs ${
          size === "sm"
            ? "px-2.5 py-0.5 text-xs"
            : size === "md"
            ? "px-3 py-1 text-xs"
            : "px-4 py-1.5 text-sm"
        } bg-orange-50 text-orange-800 border-orange-200`}
        title="Terverifikasi Bronze: Identitas Host & Dokumen Dasar Terverifikasi"
      >
        <Check className={size === "sm" ? "w-3.5 h-3.5 text-orange-600" : "w-4 h-4 text-orange-600"} />
        {showLabel && <span>Verifikasi Bronze</span>}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${
        size === "sm"
          ? "px-2.5 py-0.5 text-xs"
          : "px-3 py-1 text-xs"
      } bg-gray-100 text-gray-600 border-gray-200`}
    >
      <ShieldAlert className="w-3.5 h-3.5 text-gray-400" />
      {showLabel && <span>Standar</span>}
    </span>
  );
}
