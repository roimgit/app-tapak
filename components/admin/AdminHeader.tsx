"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Globe, ExternalLink, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const userName = user?.name || "Super Admin";

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[260px] h-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          onClick={onToggleSidebar}
          type="button"
          className="p-2 rounded-[8px] text-slate-600 hover:text-[#111827] hover:bg-slate-100 md:hidden cursor-pointer"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Section title & badge */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm sm:text-base text-[#111827]">
            Super Admin Studio
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#3D77EE] border border-blue-200">
            <ShieldCheck className="w-3 h-3" />
            Pusat Kontrol CMS
          </span>
        </div>
      </div>

      {/* Right Tools */}
      <div className="flex items-center gap-3">
        {/* Quick View Website Button */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title="Buka Web Publik di Tab Baru"
        >
          <Globe className="w-3.5 h-3.5 text-[#3D77EE]" />
          <span>Web Publik</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </Link>

        {/* Admin Avatar & Profile Info */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-full bg-[#3D77EE] text-white font-black text-xs flex items-center justify-center shadow-xs">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-[#111827] leading-tight">
              {userName}
            </span>
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#3D77EE]">
              SUPER ADMIN
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            type="button"
            className="p-1.5 ml-1 rounded-[8px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Keluar (Logout)"
            aria-label="Keluar dari Admin Studio"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
