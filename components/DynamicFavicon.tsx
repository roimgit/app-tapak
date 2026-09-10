"use client";

import { useEffect } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function DynamicFavicon() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    const faviconUrl = settings?.branding?.faviconUrl;
    if (!faviconUrl) return;

    try {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = faviconUrl;

      // Update apple-touch-icon if present or create
      let appleIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
      if (!appleIcon) {
        appleIcon = document.createElement("link");
        appleIcon.rel = "apple-touch-icon";
        document.head.appendChild(appleIcon);
      }
      appleIcon.href = faviconUrl;
    } catch {
      // ignore
    }
  }, [settings?.branding?.faviconUrl]);

  return null;
}
