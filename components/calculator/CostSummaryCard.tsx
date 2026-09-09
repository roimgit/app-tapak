"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface CostSummaryCardProps {
  initialMoveInCost: number;
  rentPrice: number;
  maintenanceFee: number;
  utilityEstimate: number;
  includeDeposit: boolean;
  deposit: number;
  monthlyRunningCost: number;
  totalCommitment: number;
  months: number;
}

export default function CostSummaryCard({
  initialMoveInCost,
  rentPrice,
  maintenanceFee,
  utilityEstimate,
  includeDeposit,
  deposit,
  monthlyRunningCost,
  totalCommitment,
  months,
}: CostSummaryCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#F3F6FB] to-blue-50/60 rounded-[18px] p-5 sm:p-6 border border-blue-100/80 flex flex-col justify-between">
      <div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3D77EE] tracking-wider uppercase bg-blue-100/60 px-2 py-0.5 rounded-md">
          <Sparkles className="w-3 h-3" />
          Estimasi Biaya Masuk Awal
        </span>

        <div className="mt-2 mb-4">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#111827] block">
            {formatRupiah(initialMoveInCost)}
          </span>
          <span className="text-xs text-[#687280]">
            Perkiraan dana awal bulan pertama (termasuk deposit)
          </span>
        </div>

        <div className="space-y-2 text-xs py-3 border-y border-slate-200/80">
          <div className="flex justify-between text-[#687280]">
            <span>Sewa Bulan ke-1:</span>
            <span className="font-semibold text-[#111827]">{formatRupiah(rentPrice)}</span>
          </div>
          <div className="flex justify-between text-[#687280]">
            <span>IPL / Pengelolaan:</span>
            <span className="font-semibold text-[#111827]">{formatRupiah(maintenanceFee)}</span>
          </div>
          <div className="flex justify-between text-[#687280]">
            <span>Estimasi Utilitas:</span>
            <span className="font-semibold text-[#111827]">{formatRupiah(utilityEstimate)}</span>
          </div>
          {includeDeposit && (
            <div className="flex justify-between text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
              <span>Deposit (dapat dikembalikan):</span>
              <span className="font-bold">{formatRupiah(deposit)}</span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-1 space-y-1">
          <div className="flex justify-between text-xs text-[#687280]">
            <span>Biaya Rutin Bulanan:</span>
            <span className="font-bold text-[#111827]">{formatRupiah(monthlyRunningCost)}/bln</span>
          </div>
          <div className="flex justify-between text-xs text-[#687280]">
            <span>Total Komitmen ({months} Bulan):</span>
            <span className="font-bold text-[#3D77EE]">{formatRupiah(totalCommitment)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200/60">
        <p className="text-[11px] text-[#687280] leading-relaxed">
          * Komitmen transparansi Tapak. untuk mencegah biaya siluman saat serah terima unit.
        </p>
      </div>
    </div>
  );
}
