"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useRouteTransition() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset loading saat URL atau parameter pencarian berubah
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  const handleLinkClick = useCallback((e: MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href) return;

    // Abaikan tautan eksternal, tab baru, target anchor hash, tel / mailto
    if (
      anchor.target === "_blank" ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.altKey ||
      e.defaultPrevented ||
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#")
    ) {
      return;
    }

    // Periksa apakah rute tujuan berbeda dari rute saat ini
    const currentTarget = window.location.pathname + window.location.search;
    const resolvedUrl = new URL(href, window.location.origin);
    const resolvedTarget = resolvedUrl.pathname + resolvedUrl.search;

    if (resolvedTarget !== currentTarget) {
      setIsNavigating(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, [handleLinkClick]);

  // Timeout pengaman agar tidak stuck jika navigasi terhambat
  useEffect(() => {
    if (!isNavigating) return;
    const timer = setTimeout(() => setIsNavigating(false), 8000);
    return () => clearTimeout(timer);
  }, [isNavigating]);

  return { isNavigating, stopNavigation: () => setIsNavigating(false) };
}
