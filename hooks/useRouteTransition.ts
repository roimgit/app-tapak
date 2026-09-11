"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useRouteTransition() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset loading saat URL atau parameter pencarian berubah
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
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

    // Abaikan klik hash pada halaman yang sama (misal: /#keunggulan ketika sudah di /)
    const currentTarget = window.location.pathname + window.location.search;
    try {
      const resolvedUrl = new URL(href, window.location.origin);
      const resolvedTarget = resolvedUrl.pathname + resolvedUrl.search;

      if (resolvedTarget === currentTarget) {
        return;
      }

      // Aktifkan progress bar dengan jeda singkat agar transisi super cepat tidak menyebabkan flicker
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsNavigating(true);
      }, 60);
    } catch {
      // Abaikan jika URL tidak valid
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [handleLinkClick]);

  // Timeout pengaman agar progress bar tidak menyala terus-menerus
  useEffect(() => {
    if (!isNavigating) return;
    const safetyTimer = setTimeout(() => setIsNavigating(false), 4000);
    return () => clearTimeout(safetyTimer);
  }, [isNavigating]);

  return { isNavigating, stopNavigation: () => setIsNavigating(false) };
}
