"use client";

import { useEffect } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function DynamicFavicon() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    let faviconUrl = settings?.branding?.faviconUrl;
    if (!faviconUrl) faviconUrl = "/favicon.png";

    try {
      // Browser tab tidak mendukung format .webp untuk favicon.
      // Jika faviconUrl berformat .webp, arahkan ke /favicon.png yang telah dikonversi dari logo brand asli.
      const finalUrl = faviconUrl.endsWith(".webp") ? "/favicon.png" : faviconUrl;
      const type = finalUrl.endsWith(".png")
        ? "image/png"
        : finalUrl.endsWith(".svg")
        ? "image/svg+xml"
        : "image/x-icon";

      // 1. Update / buat link[rel='icon']
      let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.type = type;
      link.href = finalUrl;

      // 2. Update shortcut icon
      let shortcutLink = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement | null;
      if (!shortcutLink) {
        shortcutLink = document.createElement("link");
        shortcutLink.rel = "shortcut icon";
        document.head.appendChild(shortcutLink);
      }
      shortcutLink.type = type;
      shortcutLink.href = finalUrl;

      // 3. Update apple-touch-icon
      let appleIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
      if (!appleIcon) {
        appleIcon = document.createElement("link");
        appleIcon.rel = "apple-touch-icon";
        document.head.appendChild(appleIcon);
      }
      appleIcon.href = "/apple-touch-icon.png";
    } catch {
      // ignore
    }
  }, [settings?.branding?.faviconUrl]);

  return null;
}
