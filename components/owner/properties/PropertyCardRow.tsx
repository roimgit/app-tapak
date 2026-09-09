"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Camera,
  MapPin,
  Star,
  Award,
  Eye,
  MessageCircle,
  Edit,
  Share2,
  MoreVertical,
  AlertCircle,
  ArrowRight,
  FileText,
  ShieldCheck,
  Trash2,
  ExternalLink,
} from "lucide-react";

export interface PropertyData {
  id: string;
  code: string;
  type: "Apartemen" | "Rumah" | "Ruko";
  title: string;
  location: string;
  imageUrl: string;
  photoCount: number;
  schemaType: string;
  price: string;
  pricePeriod: string;
  priceNote: string;
  status: "aktif" | "review" | "tersewa" | "draft";
  statusText: string;
  statusNote: string;
  isFeatured?: boolean;
  tier: "GOLD" | "SILVER" | "BRONZE" | "REVIEW";
  views?: number;
  leads?: number;
  score?: number;
  scoreLabel?: string;
  curatorNote?: string;
  tenantInfo?: string;
  slug?: string;
}

interface PropertyCardRowProps {
  property: PropertyData;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, isAvailable: boolean) => void;
}

export default function PropertyCardRow({
  property,
  onDelete,
  onToggleStatus,
}: PropertyCardRowProps) {
  const [isEnabled, setIsEnabled] = useState(property.status === "aktif");

  return (
    <div
      className={`bg-white p-4 lg:p-5 rounded-[18px] shadow-xs border border-slate-200/80 hover:shadow-md transition-all ${
        !isEnabled ? "opacity-75 bg-slate-50/50" : ""
      }`}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6 items-center">
        {/* Col 1: Unit Info & Thumbnail (4 Cols) */}
        <div className="xl:col-span-4 flex items-start gap-3.5">
          <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60">
            <img
              src={property.imageUrl}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/70 text-white font-bold text-[10px] backdrop-blur-xs flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>{property.photoCount} Foto</span>
            </span>
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#3D77EE] bg-blue-50 px-2 py-0.5 rounded-md">
                {property.code}
              </span>
              <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {property.type}
              </span>
            </div>

            <Link
              href={property.slug ? `/property/${property.slug}` : "/explore"}
              className="text-sm font-bold text-[#111827] truncate hover:text-[#3D77EE] transition-colors"
            >
              {property.title}
            </Link>

            <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{property.location}</span>
            </p>
          </div>
        </div>

        {/* Col 2: Schema & Pricing (2 Cols) */}
        <div className="xl:col-span-2 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {property.schemaType}
          </span>
          <div className="text-sm sm:text-base font-black text-[#111827] mt-0.5">
            {property.price}{" "}
            {property.pricePeriod && (
              <span className="text-xs font-normal text-slate-500">{property.pricePeriod}</span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 truncate">{property.priceNote}</span>
        </div>

        {/* Col 3: Listing Status & Tier Badge (2 Cols) */}
        <div className="xl:col-span-2 flex flex-col justify-center gap-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold w-fit ${
                property.status === "aktif"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : property.status === "review"
                  ? "bg-amber-50 text-amber-800 border border-amber-100"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  property.status === "aktif"
                    ? "bg-emerald-500"
                    : property.status === "review"
                    ? "bg-amber-500"
                    : "bg-slate-400"
                }`}
              />
              <span className="uppercase tracking-wider">{property.statusText}</span>
            </div>

            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold ${
                property.tier === "GOLD"
                  ? "bg-amber-50 text-amber-900 border-amber-200"
                  : property.tier === "SILVER"
                  ? "bg-slate-100 text-slate-700 border-slate-200"
                  : property.tier === "BRONZE"
                  ? "bg-orange-50 text-orange-900 border-orange-200"
                  : "bg-slate-50 text-slate-500 border-slate-200"
              }`}
            >
              <Award
                className={`w-3.5 h-3.5 ${
                  property.tier === "GOLD"
                    ? "text-amber-500"
                    : property.tier === "SILVER"
                    ? "text-slate-400"
                    : "text-orange-500"
                }`}
              />
              <span>{property.tier}</span>
            </div>
          </div>

          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            {property.isFeatured && <Star className="w-3 h-3 text-amber-500 fill-amber-400" />}
            <span>{property.statusNote}</span>
          </span>
        </div>

        {/* Col 4: Stats & Performance OR Curator Note OR Rental Notice (2 Cols) */}
        <div className="xl:col-span-2">
          {property.status === "review" && property.curatorNote ? (
            /* Curator Action Notice */
            <div className="bg-amber-50/80 border border-amber-200/80 p-2.5 rounded-xl flex flex-col gap-1.5">
              <div className="flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-[11px] text-amber-900 leading-snug font-medium">
                  <strong>Catatan Kurator:</strong> {property.curatorNote}
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert("Membuka form revisi data berkas...")}
                className="self-start text-[11px] text-[#3D77EE] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Perbaiki Draft Sekarang</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : property.status === "tersewa" ? (
            /* Rented status */
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Masa Sewa Berjalan
              </span>
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pembayaran Lancar (On-Time)</span>
              </div>
              <span className="text-[11px] text-slate-500">310 Riwayat Tayang Tersimpan</span>
            </div>
          ) : (
            /* Performance stats for active units */
            <div className="flex flex-col justify-center gap-2.5 py-1">
              {/* Row 1: Views and Leads with neat badge pills */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-[#E2E8F0] text-slate-600">
                  <Eye className="w-3.5 h-3.5 text-[#3D77EE] shrink-0" />
                  <span>
                    <strong className="text-[#111827]">{property.views ?? 0}</strong> Views
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-[#E2E8F0] text-slate-600">
                  <MessageCircle className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0" />
                  <span>
                    <strong className="text-[#111827]">{property.leads ?? 0}</strong> Leads
                  </span>
                </div>
              </div>

              {/* Row 2: Progress bar with generous spacing and height */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                <div
                  className="bg-[#3D77EE] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(10, property.score ?? 80))}%` }}
                />
              </div>

              {/* Row 3: Score & Optimal label clearly separated with tag styling */}
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[11px] text-slate-500">
                  Skor Performa <strong className="text-[#111827]">{property.score ?? 80}</strong>/100
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-[#3D77EE] border border-blue-100">
                  {property.scoreLabel ?? "Optimal"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Col 5: Quick Actions (2 Cols) */}
        <div className="xl:col-span-2 flex items-center justify-end gap-2 border-t xl:border-t-0 pt-2 xl:pt-0 border-slate-100">
          {property.slug && (
            <Link
              href={`/property/${property.slug}`}
              target="_blank"
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-[#3D77EE] transition-colors"
              title="Lihat Halaman Publik"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                const url = property.slug ? `${window.location.origin}/property/${property.slug}` : window.location.href;
                navigator.clipboard?.writeText(url);
                alert("Tautan properti berhasil disalin ke clipboard!");
              }
            }}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-[#3D77EE] transition-colors cursor-pointer"
            title="Salin Tautan"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Micro-interaction toggle switch */}
          <div className="p-1">
            <label
              className="relative inline-flex items-center cursor-pointer"
              title={isEnabled ? "Nonaktifkan Listing (Jadikan Tersewa)" : "Aktifkan Listing (Tayangkan)"}
            >
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={async (e) => {
                  const nextVal = e.target.checked;
                  setIsEnabled(nextVal);
                  onToggleStatus?.(property.id, nextVal);
                  try {
                    await fetch(`/api/listings/${property.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ is_available: nextVal }),
                    });
                  } catch (err) {
                    console.error("Gagal mengubah status listing:", err);
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#3D77EE]" />
            </label>
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(property.id);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Hapus Listing"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
