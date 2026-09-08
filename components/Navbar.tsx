"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Calculator, ShieldCheck, Menu, X, PlusCircle } from "lucide-react";
import MobileNavDrawer from "./MobileNavDrawer";

const NAV_LINKS = [
  { href: "/", label: "Beranda", icon: Map },
  { href: "/explore", label: "Peta Explore", icon: Map },
  { href: "/#kalkulator", label: "Kalkulator Total Biaya", icon: Calculator },
  { href: "/#keunggulan", label: "Verifikasi Tapak.", icon: ShieldCheck },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 group">
          <span className="brand-wordmark text-2xl sm:text-3xl text-[#111827] tracking-tight group-hover:opacity-90 transition-opacity">
            Tapak<span className="text-[#3D77EE]">.</span>
          </span>
          <span className="hidden md:inline-block ml-3 px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase text-[#3D77EE] bg-blue-50 border border-blue-100 rounded-md">
            Verified Homes
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-sm font-medium transition-all ${
                  isActive
                    ? "text-[#3D77EE] bg-blue-50/70 font-semibold"
                    : "text-[#687280] hover:text-[#111827] hover:bg-slate-100/60"
                }`}
              >
                <Icon className="w-4 h-4 opacity-80" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/explore"
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-[#3D77EE] bg-blue-50 hover:bg-blue-100/70 rounded-[10px] transition-colors"
          >
            <Map className="w-4 h-4" />
            <span>Cari di Peta</span>
          </Link>
          <button
            type="button"
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-[#3D77EE] hover:bg-[#2B55AB] rounded-[10px] shadow-sm shadow-blue-500/20 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pasang Listing</span>
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          aria-label="Buka menu navigasi"
          className="md:hidden p-2.5 rounded-[10px] text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={NAV_LINKS}
      />
    </header>
  );
}
