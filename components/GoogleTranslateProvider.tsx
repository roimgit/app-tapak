"use client";

import React, { useEffect } from "react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages?: string;
              autoDisplay?: boolean;
              layout?: number;
              multilanguagePage?: boolean;
            },
            elementId: string
          ): void;
          InlineLayout?: {
            SIMPLE: number;
            HORIZONTAL: number;
          };
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

// Patch pengaman rekonsiliasi DOM React untuk mencegah 'removeChild' & 'insertBefore' NotFoundError
// saat Google Translate secara asinkronus menyuntikkan tag <font> atau memindahkan text node
if (typeof window !== "undefined" && typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (child.parentNode) {
        return child.parentNode.removeChild(child) as T;
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (referenceNode.parentNode) {
        return referenceNode.parentNode.insertBefore(newNode, referenceNode) as T;
      }
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

export default function GoogleTranslateProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Suntikkan stylesheet penimpa langsung ke <head> agar memiliki prioritas tertinggi
    const STYLE_ID = "tapak-google-translate-overrides";
    if (!document.getElementById(STYLE_ID)) {
      const styleTag = document.createElement("style");
      styleTag.id = STYLE_ID;
      styleTag.textContent = `
        /* Sembunyikan SEMUA varian iframe banner, balon popup, dan wrapper skiptranslate */
        body > .skiptranslate,
        body > div.skiptranslate,
        iframe.skiptranslate,
        iframe[class*="skiptranslate"],
        iframe[class*="goog"],
        iframe[class*="VIpgJd"],
        iframe[id*=":container"],
        iframe[src*="translate"],
        div[class*="VIpgJd"],
        #goog-gt-tt,
        #goog-gt-vt,
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-tooltip:hover,
        .goog-te-banner-frame {
          display: none !important;
          visibility: hidden !important;
          height: 0px !important;
          max-height: 0px !important;
          width: 0px !important;
          max-width: 0px !important;
          opacity: 0 !important;
          pointer-events: none !important;
          position: absolute !important;
          top: -9999px !important;
          left: -9999px !important;
          z-index: -99999 !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Hilangkan pergeseran margin top yang dipaksakan Google Translate pada layar */
        html, body {
          top: 0px !important;
          position: static !important;
          margin-top: 0px !important;
          padding-top: 0px !important;
        }

        /* Sembunyikan highlight kuning saat hover teks terjemahan */
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
      `;
      document.head.appendChild(styleTag);
    }

    // 2. Inisialisasi Google Translate SDK
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "id",
            includedLanguages: "id,en,ko",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // 3. Observer & interval pembersih untuk menyembunyikan runtime banner & menetralkan style body
    const cleanupGoogleBanners = () => {
      if (typeof document === "undefined") return;

      if (document.body) {
        if (document.body.style.top && document.body.style.top !== "0px") {
          document.body.style.setProperty("top", "0px", "important");
        }
        if (document.body.style.position && document.body.style.position !== "static") {
          document.body.style.setProperty("position", "static", "important");
        }
        if (document.body.style.marginTop && document.body.style.marginTop !== "0px") {
          document.body.style.setProperty("margin-top", "0px", "important");
        }
      }

      if (document.documentElement) {
        if (document.documentElement.style.top && document.documentElement.style.top !== "0px") {
          document.documentElement.style.setProperty("top", "0px", "important");
        }
      }

      const elements = document.querySelectorAll<HTMLElement>(
        'iframe[class*="skiptranslate"], iframe[class*="goog"], iframe[class*="VIpgJd"], iframe[id*=":container"], body > .skiptranslate, body > div.skiptranslate, [class*="VIpgJd"], #goog-gt-tt, #goog-gt-vt, .goog-te-balloon-frame, .goog-te-banner-frame'
      );

      elements.forEach((el) => {
        if (el.id === "google_translate_element" || el.closest("#google_translate_element")) {
          return;
        }
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("height", "0px", "important");
        el.style.setProperty("max-height", "0px", "important");
        el.style.setProperty("width", "0px", "important");
        el.style.setProperty("max-width", "0px", "important");
        el.style.setProperty("opacity", "0", "important");
        el.style.setProperty("pointer-events", "none", "important");
        el.style.setProperty("position", "absolute", "important");
        el.style.setProperty("top", "-9999px", "important");
        el.style.setProperty("left", "-9999px", "important");
        el.style.setProperty("z-index", "-99999", "important");
      });
    };

    cleanupGoogleBanners();
    const interval = setInterval(cleanupGoogleBanners, 200);
    const observer = new MutationObserver(cleanupGoogleBanners);
    if (document.body) {
      observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: "-9999px",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
        zIndex: -9999,
      }}
    />
  );
}
