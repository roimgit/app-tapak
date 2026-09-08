"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface CostInputsProps {
  rentPrice: number;
  setRentPrice: (v: number) => void;
  months: number;
  setMonths: (v: number) => void;
  maintenanceFee: number;
  setMaintenanceFee: (v: number) => void;
  utilityEstimate: number;
  setUtilityEstimate: (v: number) => void;
  deposit: number;
  setDeposit: (v: number) => void;
  includeDeposit: boolean;
  setIncludeDeposit: (v: boolean) => void;
}

export default function CostInputs({
  rentPrice,
  setRentPrice,
  months,
  setMonths,
  maintenanceFee,
  setMaintenanceFee,
  utilityEstimate,
  setUtilityEstimate,
  deposit,
  setDeposit,
  includeDeposit,
  setIncludeDeposit,
}: CostInputsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[#111827] mb-1.5">Durasi Sewa</label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 3, 6, 12].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMonths(m)}
              className={`py-2 text-xs font-semibold rounded-[10px] border transition-all ${
                months === m
                  ? "bg-[#3D77EE] text-white border-[#3D77EE] shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {m} Bulan
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="font-semibold text-[#111827]">Harga Sewa / Bulan</span>
          <span className="font-bold text-[#3D77EE]">{formatRupiah(rentPrice)}</span>
        </div>
        <input
          type="range"
          min={2000000}
          max={60000000}
          step={500000}
          value={rentPrice}
          onChange={(e) => setRentPrice(Number(e.target.value))}
          className="w-full accent-[#3D77EE] cursor-pointer"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="font-semibold text-[#111827] flex items-center gap-1">
            Biaya IPL / Pengelolaan
            <HelpCircle className="w-3 h-3 text-slate-400" />
          </span>
          <span className="font-bold text-[#111827]">{formatRupiah(maintenanceFee)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={6000000}
          step={100000}
          value={maintenanceFee}
          onChange={(e) => setMaintenanceFee(Number(e.target.value))}
          className="w-full accent-[#3D77EE] cursor-pointer"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="font-semibold text-[#111827] flex items-center gap-1">
            Estimasi Utilitas (Listrik, Air & Wifi)
            <HelpCircle className="w-3 h-3 text-slate-400" />
          </span>
          <span className="font-bold text-[#111827]">{formatRupiah(utilityEstimate)}</span>
        </div>
        <input
          type="range"
          min={200000}
          max={4000000}
          step={100000}
          value={utilityEstimate}
          onChange={(e) => setUtilityEstimate(Number(e.target.value))}
          className="w-full accent-[#3D77EE] cursor-pointer"
        />
      </div>

      <div className="pt-2 border-t border-slate-100">
        <div className="flex justify-between items-center mb-1 text-xs">
          <label className="font-semibold text-[#111827] flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeDeposit}
              onChange={(e) => setIncludeDeposit(e.target.checked)}
              className="rounded text-[#3D77EE] focus:ring-[#3D77EE]"
            />
            Hitung Uang Jaminan (Deposit Refundable)
          </label>
          <span className="font-bold text-[#111827]">
            {includeDeposit ? formatRupiah(deposit) : "Tidak dihitung"}
          </span>
        </div>
        {includeDeposit && (
          <input
            type="range"
            min={0}
            max={50000000}
            step={500000}
            value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
            className="w-full accent-[#3D77EE] cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
