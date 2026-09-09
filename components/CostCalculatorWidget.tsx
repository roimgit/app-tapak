"use client";

import React, { useState } from "react";
import { Calculator, ShieldCheck } from "lucide-react";
import CostInputs from "./calculator/CostInputs";
import CostSummaryCard from "./calculator/CostSummaryCard";

interface CostCalculatorWidgetProps {
  initialRent?: number;
  initialMaintenance?: number;
  initialUtility?: number;
  initialDeposit?: number;
  title?: string;
  isCompact?: boolean;
}

export default function CostCalculatorWidget({
  initialRent = 18500000,
  initialMaintenance = 1450000,
  initialUtility = 1200000,
  initialDeposit = 18500000,
  title = "Kalkulator Total Biaya Hunian",
  isCompact = false,
}: CostCalculatorWidgetProps) {
  const [rentPrice, setRentPrice] = useState<number>(initialRent);
  const [months, setMonths] = useState<number>(12);
  const [maintenanceFee, setMaintenanceFee] = useState<number>(initialMaintenance);
  const [utilityEstimate, setUtilityEstimate] = useState<number>(initialUtility);
  const [deposit, setDeposit] = useState<number>(initialDeposit);
  const [includeDeposit, setIncludeDeposit] = useState<boolean>(true);

  const monthlyRunningCost = rentPrice + maintenanceFee + utilityEstimate;
  const initialMoveInCost = monthlyRunningCost + (includeDeposit ? deposit : 0);
  const totalCommitment =
    (rentPrice + maintenanceFee + utilityEstimate) * months +
    (includeDeposit ? deposit : 0);

  return (
    <div className="bg-white rounded-[18px] border border-slate-200/80 shadow-md p-5 sm:p-7 transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-[10px] bg-blue-50 text-[#3D77EE] flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#111827]">{title}</h3>
            <p className="text-xs text-[#687280]">
              Transparansi biaya sewa, IPL, utilitas & deposit tanpa biaya tersembunyi
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          Akurasi Terverifikasi
        </span>
      </div>

      <div className={`mt-6 grid ${isCompact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"} gap-6`}>
        <div className={isCompact ? "space-y-4" : "lg:col-span-7"}>
          <CostInputs
            rentPrice={rentPrice}
            setRentPrice={setRentPrice}
            months={months}
            setMonths={setMonths}
            maintenanceFee={maintenanceFee}
            setMaintenanceFee={setMaintenanceFee}
            utilityEstimate={utilityEstimate}
            setUtilityEstimate={setUtilityEstimate}
            deposit={deposit}
            setDeposit={setDeposit}
            includeDeposit={includeDeposit}
            setIncludeDeposit={setIncludeDeposit}
          />
        </div>

        <div className={isCompact ? "mt-4" : "lg:col-span-5"}>
          <CostSummaryCard
            initialMoveInCost={initialMoveInCost}
            rentPrice={rentPrice}
            maintenanceFee={maintenanceFee}
            utilityEstimate={utilityEstimate}
            includeDeposit={includeDeposit}
            deposit={deposit}
            monthlyRunningCost={monthlyRunningCost}
            totalCommitment={totalCommitment}
            months={months}
          />
        </div>
      </div>
    </div>
  );
}
