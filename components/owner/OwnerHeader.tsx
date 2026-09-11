"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Menu, ExternalLink, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface OwnerHeaderProps {
  onToggleSidebar?: () => void;
}

export default function OwnerHeader({ onToggleSidebar }: OwnerHeaderProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  // Akses Super Admin Studio HANYA bagi akun yang memiliki role Administrator
  const isSuperAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";
  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "Mitra Tapak.");
  const displayRole = isSuperAdmin ? "Super Admin" : "Mitra Pemilik";
  const initialLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 left-0 md:left-[260px] right-0 h-16 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Sisi Kiri: Mobile Hamburger + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-[10px] text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center bg-[#F3F6FB] rounded-[10px] px-3 py-1.5 w-full max-w-sm border border-slate-200/60 focus-within:border-[#3D77EE] focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari unit properti, transaksi..."
            className="bg-transparent border-none outline-none text-[#111827] placeholder:text-slate-400 text-xs w-full"
          />
        </div>
      </div>

      {/* Sisi Kanan: Notifikasi + Profil Avatar + Tombol Logout */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Tombol Notifikasi */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-[10px] text-slate-500 hover:bg-slate-100 hover:text-[#111827] transition-colors"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3D77EE]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-[14px] shadow-xl border border-slate-200 p-3 text-xs z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-[#111827]">
                <span>Notifikasi</span>
                <span className="text-[10px] text-[#3D77EE] font-semibold">Tandai sudah dibaca</span>
              </div>
              <div className="py-2.5 border-b border-slate-100">
                <span className="font-bold text-[#111827] block">Sistem Tapak. Siap</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Semua layanan listing dan transaksi berjalan optimal.</p>
                <span className="text-[10px] text-slate-400 mt-1 block">Baru saja</span>
              </div>
            </div>
          )}
        </div>

        {/* Pemisah Vertikal */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Link Cepat ke Super Admin Studio (jika Super Admin) */}
        {isSuperAdmin && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs border border-slate-700"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin Studio</span>
          </Link>
        )}

        {/* Link Cepat ke Web Publik */}
        <Link
          href="/explore"
          className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#3D77EE] transition-colors"
        >
          <span>Web Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Profil Akun Super Admin */}
        <div className="flex items-center gap-2.5 pl-1 sm:pl-2">
          <div className="w-8 h-8 rounded-full bg-[#3D77EE] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {initialLetter}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-[#111827] leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] text-[#3D77EE] font-bold uppercase tracking-wider">
              {displayRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
