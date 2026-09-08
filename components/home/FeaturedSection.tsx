import React from "react";
import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { ListingItem } from "@/lib/types";

interface FeaturedSectionProps {
  listings: ListingItem[];
}

export default function FeaturedSection({ listings }: FeaturedSectionProps) {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#3D77EE] uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>Pilihan Kurator Tapak.</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            Hunian Rekomendasi Terverifikasi
          </h2>
          <p className="text-sm text-[#687280] mt-1">
            Audit fisik komprehensif, kepemilikan terjamin, dan tanpa mark-up IPL
          </p>
        </div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-[#3D77EE] text-sm font-bold text-[#111827] hover:text-[#3D77EE] rounded-[10px] transition-all shadow-xs"
        >
          <span>Jelajah di Peta</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <PropertyCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
