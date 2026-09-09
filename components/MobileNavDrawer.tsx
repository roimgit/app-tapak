"use client";

import React from "react";
import Link from "next/link";
import { LogIn, LogOut, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { NavLinkItem } from "./Navbar";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLinkItem[];
  activeHref?: string;
  onSelectLink?: (href: string) => void;
}

export default function MobileNavDrawer({
  isOpen,
  onClose,
  navLinks,
  activeHref,
  onSelectLink,
}: MobileNavDrawerProps) {
  const { t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-x-0 top-20 bg-white border-b border-gray-200 shadow-xl rounded-b-[24px] p-6 space-y-4 animate-in slide-in-from-top duration-200 z-40">
      <div className="flex flex-col space-y-2">
        {navLinks.map((item) => {
          const isActive = activeHref === item.href;
          const Icon = item.icon;
          const label = t(item.key, item.defaultLabel);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                onSelectLink?.(item.href);
                onClose();
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-[10px] text-base font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-[#3D77EE] font-semibold"
                  : "text-gray-700 hover:bg-blue-50/60 hover:text-[#3D77EE]"
              }`}
            >
              {Icon && (
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-[#3D77EE]" : "text-gray-500"}`}
                />
              )}
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
      <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
        {isAuthenticated ? (
          <>
            <Link
              href="/owner/dashboard"
              onClick={() => {
                onSelectLink?.("/owner/dashboard");
                onClose();
              }}
              className="w-full flex items-center justify-between py-3 px-4 rounded-[10px] text-sm font-semibold text-[#111827] bg-blue-50 border border-blue-100"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#3D77EE]" />
                <span>{user?.name || user?.email || "Akun Saya"}</span>
              </div>
              <span className="text-xs text-[#3D77EE] font-bold">Studio</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar dari Akun</span>
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              onClick={() => {
                onSelectLink?.("/login");
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] text-sm font-semibold text-[#111827] bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <LogIn className="w-4 h-4 text-slate-500" />
              <span>{t("nav.login", "Masuk ke Akun")}</span>
            </Link>
            <Link
              href="/register"
              onClick={() => {
                onSelectLink?.("/register");
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-xs font-semibold text-[#3D77EE] border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors"
            >
              <span>Daftar Akun Baru</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
