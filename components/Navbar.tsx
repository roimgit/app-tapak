"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Calculator, ShieldCheck, Menu, X, PlusCircle } from "lucide-react";
import MobileNavDrawer from "./MobileNavDrawer";

const NAV_LINKS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/explore", label: "Peta Explore", icon: Map },
  { href: "/#kalkulator", label: "Kalkulator Total Biaya", icon: Calculator },
  { href: "/#keunggulan", label: "Verifikasi Tapak.", icon: ShieldCheck },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState("/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const updateActiveLink = useCallback(() => {
    if (pathname.startsWith("/explore")) {
      setActiveHref("/explore");
      return;
    }

    if (pathname === "/") {
      const hash = window.location.hash;
      if (hash === "#kalkulator") {
        setActiveHref("/#kalkulator");
        return;
      }
      if (hash === "#keunggulan") {
        setActiveHref("/#keunggulan");
        return;
      }

      const kalkulatorEl = document.getElementById("kalkulator");
      const keunggulanEl = document.getElementById("keunggulan");
      const scrollY = window.scrollY;

      if (kalkulatorEl && scrollY >= kalkulatorEl.offsetTop - 240) {
        setActiveHref("/#kalkulator");
      } else if (keunggulanEl && scrollY >= keunggulanEl.offsetTop - 240) {
        setActiveHref("/#keunggulan");
      } else {
        setActiveHref("/");
      }
      return;
    }

    setActiveHref(pathname);
  }, [pathname]);

  useEffect(() => {
    updateActiveLink();

    window.addEventListener("hashchange", updateActiveLink);
    window.addEventListener("scroll", updateActiveLink, { passive: true });

    return () => {
      window.removeEventListener("hashchange", updateActiveLink);
      window.removeEventListener("scroll", updateActiveLink);
    };
  }, [updateActiveLink]);

  const handleLinkClick = (href: string) => {
    setActiveHref(href);
    if (href.includes("#") && pathname === "/") {
      const id = href.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" onClick={() => handleLinkClick("/")} className="flex items-center gap-1 group">
          <span className="brand-wordmark text-2xl sm:text-3xl text-[#111827] tracking-tight group-hover:opacity-90 transition-opacity">
            Tapak<span className="text-[#3D77EE]">.</span>
          </span>
          <span className="hidden md:inline-block ml-3 px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase text-[#3D77EE] bg-blue-50 border border-blue-100 rounded-md">
            Verified Homes
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((item) => {
            const isActive = activeHref === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => handleLinkClick(item.href)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-sm font-medium transition-all ${
                  isActive
                    ? "text-[#3D77EE] bg-blue-50/90 font-semibold shadow-xs"
                    : "text-[#687280] hover:text-[#111827] hover:bg-slate-100/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#3D77EE]" : "opacity-75"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/explore"
            onClick={() => handleLinkClick("/explore")}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-[#3D77EE] bg-blue-50 hover:bg-blue-100/70 rounded-[10px] transition-colors"
          >
            <Map className="w-4 h-4" />
            <span>Cari di Peta</span>
          </Link>
          <Link
            href="/paket-iklan"
            onClick={() => handleLinkClick("/paket-iklan")}
            className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-[10px] shadow-sm transition-all active:scale-[0.98] ${
              activeHref === "/paket-iklan" || activeHref === "/pasang-listing"
                ? "text-white bg-[#2B55AB] ring-2 ring-blue-300 shadow-md"
                : "text-white bg-[#3D77EE] hover:bg-[#2B55AB] shadow-blue-500/20 hover:shadow-md"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pasang Listing</span>
          </Link>
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
        activeHref={activeHref}
        onSelectLink={handleLinkClick}
      />
    </header>
  );
}
