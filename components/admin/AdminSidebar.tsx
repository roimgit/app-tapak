"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Sliders,
  Tag,
  Megaphone,
  FileText,
  Building2,
  Globe,
  UserCheck,
  LogOut,
  X,
  Crown,
  Users,
  Headphones,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const NAV_ITEMS = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin" || pathname === "/admin/dashboard",
    },
    {
      label: "Logo & Branding",
      href: "/admin/branding",
      icon: Sparkles,
      active: pathname.startsWith("/admin/branding"),
    },
    {
      label: "Slot Iklan & Moderasi",
      href: "/admin/iklan",
      icon: Megaphone,
      active: pathname.startsWith("/admin/iklan"),
      badge: "Slot",
    },
    {
      label: "Konten Beranda & Hero",
      href: "/admin/beranda",
      icon: Sliders,
      active: pathname.startsWith("/admin/beranda"),
    },
    {
      label: "Paket Langganan Mitra",
      href: "/admin/paket-iklan",
      icon: Tag,
      active: pathname.startsWith("/admin/paket-iklan"),
    },
    {
      label: "Artikel & Berita",
      href: "/admin/artikel",
      icon: FileText,
      active: pathname.startsWith("/admin/artikel"),
    },
    {
      label: "Semua Properti Global",
      href: "/admin/properti",
      icon: Building2,
      active: pathname.startsWith("/admin/properti"),
      badge: "12 Unit",
    },
    {
      label: "Kelola Akun & Akses",
      href: "/admin/pengguna",
      icon: Users,
      active: pathname.startsWith("/admin/pengguna"),
    },
    {
      label: "Kontak Bantuan Owner",
      href: "/admin/kontak",
      icon: Headphones,
      active: pathname.startsWith("/admin/kontak"),
    },
  ];

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#111827] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top: Logo & Super Admin Identifier */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
            <Link href="/admin" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-[8px] bg-[#3D77EE] flex items-center justify-center font-black text-white text-base shadow-xs group-hover:scale-105 transition-transform">
                T
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white flex items-center">
                  Tapak<span className="text-[#3D77EE]">.</span>
                </span>
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-[9px] font-extrabold tracking-widest text-amber-300 uppercase mt-0.5 w-fit">
                  <Crown className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span>SUPER ADMIN</span>
                </div>
              </div>
            </Link>

            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Role Status Pill */}
          <div className="p-3.5 mx-3 mt-3 rounded-[10px] bg-slate-800/80 border border-slate-700/80 flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-200 block truncate">
                Mode Kontrol Penuh
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                Kelola CMS &amp; Beranda
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
              KONTROL KONTEN
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose()}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-[10px] text-xs font-semibold transition-all ${
                    item.active
                      ? "bg-[#3D77EE] text-white shadow-xs font-bold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/90"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${item.active ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9.5px] px-1.5 py-0.5 rounded-[4px] font-bold ${
                        item.active ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions: Switch to Owner Studio, Web Publik, Logout */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <div className="px-3 pb-1.5 text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
            PINTASAN STUDIO
          </div>

          <Link
            href="/owner/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-[#3D77EE]" />
            <span>Owner Studio (Mitra)</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Lihat Web Publik</span>
          </Link>

          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
}
