"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Map,
  BookOpen,
  ShieldCheck,
  Tag,
  Menu,
  X,
  PlusCircle,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import MobileNavDrawer from "./MobileNavDrawer";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export interface NavLinkItem {
  href: string;
  key: string;
  defaultLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_LINKS: NavLinkItem[] = [
  { href: "/", key: "nav.home", defaultLabel: "Beranda", icon: Home },
  { href: "/explore", key: "nav.explore", defaultLabel: "Explore", icon: Map },
  { href: "/artikel", key: "nav.articles", defaultLabel: "Artikel", icon: BookOpen },
  { href: "/paket-iklan", key: "nav.pricing", defaultLabel: "Paket Iklan", icon: Tag },
  { href: "/#keunggulan", key: "nav.verification", defaultLabel: "Verifikasi Tapak.", icon: ShieldCheck },
];

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [activeHref, setActiveHref] = useState("/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const updateActiveLink = useCallback(() => {
    if (pathname.startsWith("/explore")) {
      setActiveHref("/explore");
      return;
    }

    if (pathname.startsWith("/artikel")) {
      setActiveHref("/artikel");
      return;
    }

    if (pathname.startsWith("/paket-iklan")) {
      setActiveHref("/paket-iklan");
      return;
    }

    if (pathname.startsWith("/login")) {
      setActiveHref("/login");
      return;
    }

    if (pathname === "/") {
      const hash = window.location.hash;
      if (hash === "#keunggulan") {
        setActiveHref("/#keunggulan");
        return;
      }

      const keunggulanEl = document.getElementById("keunggulan");
      const scrollY = window.scrollY;

      if (keunggulanEl && scrollY >= keunggulanEl.offsetTop - 240) {
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
      <div
        className={`mx-auto h-20 flex items-center justify-between ${
          pathname.startsWith("/explore")
            ? "w-full px-4 sm:px-6"
            : "w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10"
        }`}
      >
        {/* Brand Wordmark Logo */}
        <Link
          href="/"
          onClick={() => handleLinkClick("/")}
          className="flex items-center gap-1 group shrink-0 mr-4"
        >
          <span className="brand-wordmark text-2xl sm:text-3xl text-[#111827] tracking-tight group-hover:opacity-90 transition-opacity">
            Tapak<span className="text-[#3D77EE]">.</span>
          </span>
          <span className="hidden xl:inline-block ml-3 px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase text-[#3D77EE] bg-blue-50 border border-blue-100 rounded-md whitespace-nowrap">
            {t("nav.verified_badge", "Verified Homes")}
          </span>
        </Link>

        {/* Navigation Links with whitespace-nowrap and generous spacing */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_LINKS.map((item) => {
            const isActive = activeHref === item.href;
            const Icon = item.icon;
            const label = t(item.key, item.defaultLabel);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleLinkClick(item.href)}
                className={`flex items-center gap-1.5 xl:gap-2 px-3 xl:px-3.5 py-2 rounded-[10px] text-xs xl:text-sm font-semibold whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? "text-[#3D77EE] bg-blue-50/90 shadow-2xs font-bold"
                    : "text-[#687280] hover:text-[#111827] hover:bg-slate-100/60"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#3D77EE]" : "opacity-75"}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions Area */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0 ml-4">
          {/* Language Switcher Capsule Toggle */}
          <LanguageToggle />

          {/* User Auth Status or Login Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/owner/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-blue-50 border border-blue-200 text-[#3D77EE] hover:bg-blue-100 transition-colors text-xs font-bold shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#3D77EE] text-white flex items-center justify-center text-[10px] font-extrabold">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : user?.email?.slice(0, 2).toUpperCase() || "TP"}
                </div>
                <span className="max-w-[120px] truncate">{user?.name || "Akun Saya"}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Keluar dari Akun"
                className="p-2 rounded-[10px] text-slate-400 hover:text-red-600 hover:bg-red-50 border border-[#E2E8F0] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => handleLinkClick("/login")}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs xl:text-sm font-semibold text-[#111827] hover:text-[#3D77EE] bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-[10px] shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{t("nav.login", "Masuk")}</span>
            </Link>
          )}

          {/* Tombol Pasang Listing */}
          <Link
            href="/paket-iklan"
            onClick={() => handleLinkClick("/paket-iklan")}
            className="flex items-center gap-1.5 px-4 py-2 text-xs xl:text-sm font-semibold rounded-[10px] text-white bg-[#3D77EE] hover:bg-[#2B55AB] shadow-sm shadow-blue-500/20 hover:shadow-md transition-all active:scale-[0.98] whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>{t("nav.post_listing", "Pasang Listing")}</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label="Buka menu navigasi"
            className="p-2 rounded-[10px] text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
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
