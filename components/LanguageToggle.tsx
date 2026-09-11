"use client";

import React from "react";
import { useLanguage, Language } from "@/context/LanguageContext";

function FlagID({ className = "w-4 h-2.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={`inline-block rounded-[2px] shadow-2xs shrink-0 overflow-hidden border border-black/10 ${className}`}>
      <path fill="#E70011" d="M0 0h640v240H0z" />
      <path fill="#FFFFFF" d="M0 240h640v240H0z" />
    </svg>
  );
}

function FlagKOR({ className = "w-4 h-2.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 48" className={`inline-block rounded-[2px] shadow-2xs shrink-0 overflow-hidden border border-black/10 bg-white ${className}`}>
      <rect width="72" height="48" fill="#ffffff" />
      <g transform="translate(36,24)">
        {/* Taegeuk Circle (Red Yang on top, Blue Yin on bottom, tilted along diagonal) */}
        <g transform="rotate(33.69)">
          <path d="M-12,0a12,12 0 0,1 24,0a6,6 0 0,1 -12,0a6,6 0 0,0 -12,0z" fill="#CD2E3A" />
          <path d="M-12,0a12,12 0 0,0 24,0a6,6 0 0,0 -12,0a6,6 0 0,1 -12,0z" fill="#0047A0" />
        </g>

        {/* Top-Left: Geon (☰) - 3 Solid Bars */}
        <g transform="rotate(33.69) translate(-18,0)">
          <rect x="-4" y="-3.33" width="8" height="1.33" fill="#000000" rx="0.2" />
          <rect x="-4" y="-0.67" width="8" height="1.33" fill="#000000" rx="0.2" />
          <rect x="-4" y="2" width="8" height="1.33" fill="#000000" rx="0.2" />
        </g>

        {/* Bottom-Right: Gon (☷) - 3 Broken Bars */}
        <g transform="rotate(33.69) translate(18,0)">
          <rect x="-4" y="-3.33" width="3.67" height="1.33" fill="#000000" rx="0.2" />
          <rect x="0.33" y="-3.33" width="3.67" height="1.33" fill="#000000" rx="0.2" />
          <rect x="-4" y="-0.67" width="3.67" height="1.33" fill="#000000" rx="0.2" />
          <rect x="0.33" y="-0.67" width="3.67" height="1.33" fill="#000000" rx="0.2" />
          <rect x="-4" y="2" width="3.67" height="1.33" fill="#000000" rx="0.2" />
          <rect x="0.33" y="2" width="3.67" height="1.33" fill="#000000" rx="0.2" />
        </g>

        {/* Top-Right: Gam (☵) - Broken, Solid, Broken */}
        <g transform="rotate(-33.69) translate(18,0)">
          <rect x="-4" y="-3.33" width="3.67" height="1.33" fill="#000000" rx="0.2" />
          <rect x="0.33" y="-3.33" width="3.67" height="1.33" fill="#000000" rx="0.2" />
          <rect x="-4" y="-0.67" width="8" height="1.33" fill="#000000" rx="0.2" />
          <rect x="-4" y="2" width="3.67" height="1.33" fill="#000000" rx="0.2" />
          <rect x="0.33" y="2" width="3.67" height="1.33" fill="#000000" rx="0.2" />
        </g>

        {/* Bottom-Left: Ri (☲) - Solid, Broken, Solid */}
        <g transform="rotate(-33.69) translate(-18,0)">
          <rect x="-4" y="-3.33" width="8" height="1.33" fill="#000000" rx="0.2" />
          <rect x="-4" y="-0.67" width="3.67" height="1.33" fill="#000000" rx="0.2" />
          <rect x="0.33" y="-0.67" width="3.67" height="1.33" fill="#000000" rx="0.2" />
          <rect x="-4" y="2" width="8" height="1.33" fill="#000000" rx="0.2" />
        </g>
      </g>
    </svg>
  );
}

function FlagUK({ className = "w-4 h-2.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={`inline-block rounded-[2px] shadow-2xs shrink-0 overflow-hidden border border-black/10 ${className}`}>
      <clipPath id="uk-flag-clip"><path d="M0 0h640v480H0z"/></clipPath>
      <g clipPath="url(#uk-flag-clip)">
        <path fill="#012169" d="M0 0h640v480H0z"/>
        <path fill="#FFF" d="m75 0 245 180L565 0h75v50L440 240l200 150v90h-75L320 300 75 480H0v-50l200-150L0 90V0h75z"/>
        <path fill="#C8102E" d="m424 282 216 162v36h-24L392 306l32-24zm-208-84L0 36V0h24l224 168-32 30zm208-16 216-162h-48L280 182h32l112-80zm-208 84L0 428v48l248-186h-32l-96 74z"/>
        <path fill="#FFF" d="M240 0h160v480H240zM0 160h640v160H0z"/>
        <path fill="#C8102E" d="M267 0h106v480H267zM0 187h640v106H0z"/>
      </g>
    </svg>
  );
}

const OPTIONS = [
  { code: "ID" as const, flag: FlagID, title: "Bahasa Indonesia", ariaLabel: "Ganti ke Bahasa Indonesia" },
  { code: "KOR" as const, flag: FlagKOR, title: "한국어 (Korean)", ariaLabel: "한국어로 변경" },
  { code: "ENG" as const, flag: FlagUK, title: "English", ariaLabel: "Switch to English" },
];

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Pilihan Bahasa / Language Switcher"
      translate="no"
      className={`notranslate inline-flex items-center gap-1 p-1 bg-slate-100/90 rounded-full border border-slate-200/70 select-none shadow-2xs ${className}`}
    >
      {OPTIONS.map((opt) => {
        const isActive = language === opt.code;
        const FlagComponent = opt.flag;
        return (
          <button
            key={opt.code}
            type="button"
            translate="no"
            onClick={() => setLanguage(opt.code)}
            aria-pressed={isActive}
            aria-label={opt.ariaLabel}
            title={opt.title}
            className={`notranslate w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-[#3D77EE] shadow-xs ring-2 ring-[#3D77EE]/25 scale-105"
                : "hover:bg-white hover:scale-105 opacity-70 hover:opacity-100"
            }`}
          >
            <FlagComponent className="w-5 h-3.5 shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
