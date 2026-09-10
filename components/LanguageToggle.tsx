"use client";

import React from "react";
import { useLanguage, Language } from "@/context/LanguageContext";

const OPTIONS: { code: Language; label: string }[] = [
  { code: "ID", label: "ID" },
  { code: "KOR", label: "KOR" },
  { code: "ENG", label: "ENG" },
];

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Pilihan Bahasa / Language Switcher"
      className={`inline-flex items-center p-1 bg-slate-100/80 rounded-full select-none transition-all ${className}`}
    >
      {OPTIONS.map((opt) => {
        const isActive = language === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLanguage(opt.code)}
            aria-pressed={isActive}
            className={`min-w-[34px] sm:min-w-[36px] h-7 sm:h-8 px-2.5 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-[#3D77EE] text-white shadow-xs"
                : "text-[#111827] hover:text-[#3D77EE] hover:bg-blue-50/60"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
