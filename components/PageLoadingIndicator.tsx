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
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl p-6 px-8 max-w-[280px] w-[88%] flex flex-col items-center justify-center text-center space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-center w-12 h-12">
          <svg
            className="w-11 h-11 animate-spin text-[#3D77EE]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="text-blue-100"
              stroke="currentColor"
              strokeWidth="3"
              cx="12"
              cy="12"
            />
            <path
              className="text-[#3D77EE]"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
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
