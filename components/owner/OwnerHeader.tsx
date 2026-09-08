"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Menu, ExternalLink } from "lucide-react";

interface OwnerHeaderProps {
  onToggleSidebar?: () => void;
}

export default function OwnerHeader({ onToggleSidebar }: OwnerHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

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

      {/* Sisi Kanan: Notifikasi + Profil Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
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
                <span className="font-bold text-[#111827] block">Pembayaran Berhasil Dilunasi</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Paket Multi-Lapak Anda telah aktif dan kuota siap digunakan.</p>
                <span className="text-[10px] text-slate-400 mt-1 block">Baru saja</span>
              </div>
              <div className="py-2.5">
                <span className="font-bold text-[#111827] block">Prospek Baru di WhatsApp</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Hendra Wijaya mengirim pertanyaan untuk Senopati Suites 2BR.</p>
                <span className="text-[10px] text-slate-400 mt-1 block">12 menit lalu</span>
              </div>
            </div>
          )}
        </div>

        {/* Pemisah Vertikal */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Link Cepat ke Web Publik */}
        <Link
          href="/explore"
          className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#3D77EE] transition-colors"
        >
          <span>Web Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Profil Akun Pemilik */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3D77EE] to-sky-400 p-0.5 shadow-xs">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-xs text-[#3D77EE]">
              O
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-[#111827] leading-tight">Oim</span>
            <span className="text-[10px] text-[#3D77EE] font-bold uppercase tracking-wider">
              Owner Pro
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
