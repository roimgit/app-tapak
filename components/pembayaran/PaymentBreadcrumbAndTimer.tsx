"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, ChevronRight, Clock } from "lucide-react";

interface PaymentBreadcrumbAndTimerProps {
  invoiceId?: string;
}

export default function PaymentBreadcrumbAndTimer({
  invoiceId = "#INV-2026-04819",
}: PaymentBreadcrumbAndTimerProps) {
  const [timeLeft, setTimeLeft] = useState(23 * 3600 + 59 * 60 + 45);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
      {/* Breadcrumbs */}
      <div className="flex items-center flex-wrap gap-2 text-xs text-[#687280]">
        <Link
          href="/paket-iklan"
          className="hover:text-[#3D77EE] transition-colors flex items-center gap-1 font-medium"
        >
          <Building2 className="w-3.5 h-3.5 text-[#3D77EE]" />
          <span>Sewa Lapak</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-[#111827] font-semibold">Pembayaran Tagihan</span>
        <span className="bg-blue-50 text-[#3D77EE] px-2 py-0.5 rounded font-mono font-bold text-[11px] tracking-wide border border-blue-100">
          {invoiceId}
        </span>
      </div>

      {/* Countdown Timer */}
      <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200/80 px-4 py-1.5 rounded-full shadow-xs w-fit">
        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
        <span className="text-xs font-medium">Selesaikan pembayaran dalam:</span>
        <span className="text-xs font-bold text-amber-800 font-mono tracking-wider">
          {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(seconds)}
        </span>
      </div>
    </div>
  );
}
