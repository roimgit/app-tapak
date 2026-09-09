"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Headphones, ChevronDown } from "lucide-react";

interface OwnerSubNavProps {
  onOpenCS?: () => void;
}

export default function OwnerSubNav({ onOpenCS }: OwnerSubNavProps) {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/owner/dashboard");
  const isPaketIklan = pathname === "/paket-iklan";

  return (
    <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Navigasi Menu Owner */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#111827]">Tapak</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#3D77EE] text-[11px] font-bold uppercase tracking-wider border border-blue-100">
              Owner
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/owner/dashboard"
              className={`py-1 transition-colors relative ${
                isDashboard
                  ? "text-[#3D77EE] font-semibold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-[2px] after:bg-[#3D77EE]"
                  : "text-[#687280] hover:text-[#111827]"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/owner/dashboard"
              className="text-[#687280] hover:text-[#111827] transition-colors py-1"
            >
              Properti Saya
            </Link>
            <Link
              href="/paket-iklan"
              className={`py-1 transition-colors relative ${
                isPaketIklan
                  ? "text-[#3D77EE] font-semibold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-[2px] after:bg-[#3D77EE]"
                  : "text-[#687280] hover:text-[#111827]"
              }`}
            >
              Paket Iklan
            </Link>
            <Link
              href="/paket-iklan#faq"
              className="text-[#687280] hover:text-[#111827] transition-colors py-1"
            >
              Bantuan
            </Link>
          </nav>
        </div>

        {/* Action Kanan: Kontak CS & Profil Pemilik */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20Tapak,%20saya%20ingin%20berkonsultasi%20mengenai%20iklan%20saya."
            target="_blank"
            rel="noopener noreferrer"
            onClick={onOpenCS}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-slate-50 hover:bg-slate-100 text-[#111827] text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Headphones className="w-3.5 h-3.5 text-[#3D77EE]" />
            <span className="hidden sm:inline">Kontak CS</span>
          </a>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3D77EE] to-sky-400 p-0.5">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-xs text-[#3D77EE]">
                O
              </div>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#111827] leading-tight">Oim</span>
              <span className="text-[10px] text-[#687280] leading-tight">Pemilik Aset</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#687280]" />
          </div>
        </div>
      </div>
    </div>
  );
}
