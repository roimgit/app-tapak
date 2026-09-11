"use client";

import React, { Suspense } from "react";
import { useRouteTransition } from "@/hooks/useRouteTransition";

function TopProgressBar() {
  const { isNavigating } = useRouteTransition();

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[100000] pointer-events-none">
      {/* Garis aksen progress bar halus di paling atas layar tanpa memblokir interaksi pengguna */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#3D77EE] via-[#60A5FA] to-[#3D77EE] animate-pulse shadow-sm shadow-blue-500/20" />
    </div>
  );
}

export default function PageLoadingIndicator() {
  return (
    <Suspense fallback={null}>
      <TopProgressBar />
    </Suspense>
  );
}
