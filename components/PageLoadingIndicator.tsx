"use client";

import React, { Suspense } from "react";
import { useRouteTransition } from "@/hooks/useRouteTransition";

function LoadingModal() {
  const { isNavigating } = useRouteTransition();

  if (!isNavigating) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Memuat Halaman"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-200"
    >
      {/* Garis aksen progress bar di paling atas */}
      <div className="fixed top-0 inset-x-0 h-[3px] bg-[#3D77EE] animate-pulse z-[100000]" />

      {/* Pop-up modal loading di tengah layar */}
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] shadow-2xl p-6 px-8 max-w-[280px] w-[88%] flex flex-col items-center justify-center text-center space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
        <div className="relative flex items-center justify-center w-12 h-12">
          <div className="absolute inset-0 rounded-full border-3 border-blue-100 animate-pulse" />
          <div className="w-10 h-10 rounded-full border-3 border-transparent border-t-[#3D77EE] border-r-[#3D77EE] animate-spin" />
        </div>

        <h4 className="text-sm font-semibold text-[#111827] tracking-tight">
          Memuat Halaman...
        </h4>

        {/* Micro progress line */}
        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
          <div className="h-full bg-[#3D77EE] rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    </div>
  );
}

export default function PageLoadingIndicator() {
  return (
    <Suspense fallback={null}>
      <LoadingModal />
    </Suspense>
  );
}
