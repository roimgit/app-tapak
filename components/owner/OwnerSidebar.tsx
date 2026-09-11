"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Home,
  PlusCircle,
  CreditCard,
  Megaphone,
  MessageSquare,
  Calendar,
  Settings,
  Headphones,
  LogOut,
  X,
  Crown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import OwnerSupportModal from "@/components/owner/OwnerSupportModal";

interface OwnerSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function OwnerSidebar({ isOpen = false, onClose }: OwnerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [propertyCount, setPropertyCount] = useState<number | null>(null);

  // Akses Super Admin Studio HANYA bagi akun yang memiliki role Administrator
  const isSuperAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const isDashboard = pathname === "/owner/dashboard";
  const isProperti = pathname === "/owner/properti";
  const isNewProperty = pathname === "/owner/properties/new";
  const isPaketIklan = pathname === "/owner/paket-iklan";
  const isSlotIklan = pathname.startsWith("/owner/iklan");

  useEffect(() => {
    const email = user?.email || "admin@admin.com";
    fetch(`/api/owner/property-count?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && typeof d.count === "number") {
          setPropertyCount(d.count);
        }
      })
      .catch(() => {});
  }, [user?.email]);

  const navItems = [
    {
      label: "Dashboard",
      href: "/owner/dashboard",
      icon: LayoutGrid,
      isActive: isDashboard,
      badge: null,
    },
    {
      label: "Properti Saya",
      href: "/owner/properti",
      icon: Home,
      isActive: isProperti,
      badge:
        propertyCount !== null && propertyCount > 0
          ? {
              text: propertyCount.toString(),
              isCircle: false,
              bg: isProperti
                ? "bg-white text-[#3D77EE]"
                : "bg-blue-50 text-[#3D77EE] border border-blue-100",
            }
          : null,
    },
    {
      label: "Paket Iklan",
      href: "/owner/paket-iklan",
      icon: CreditCard,
      isActive: isPaketIklan,
      badge: {
        text: "Promo",
        isCircle: false,
        bg: isPaketIklan
          ? "bg-white text-[#3D77EE]"
          : "bg-amber-50 text-amber-700 border border-amber-200",
      },
    },
    {
      label: "Pasang Slot Iklan",
      href: "/owner/iklan",
      icon: Megaphone,
      isActive: isSlotIklan,
      badge: {
        text: "Slot",
        isCircle: false,
        bg: isSlotIklan
          ? "bg-white text-[#3D77EE]"
          : "bg-emerald-50 text-emerald-700 border border-emerald-200",
      },
    },
    {
      label: "Tambah Properti",
      href: "/owner/properties/new",
      icon: PlusCircle,
      isActive: isNewProperty,
      badge: null,
    },
    {
      label: "Pesan & Prospek",
      href: "/owner/dashboard#feed-wa",
      icon: MessageSquare,
      isActive: false,
      badge: { text: "28", isCircle: false, bg: "bg-slate-100 text-slate-700" },
    },
    {
      label: "Jadwal Kunjungan",
      href: "/owner/dashboard#properti",
      icon: Calendar,
      isActive: false,
      badge: { text: "5", isCircle: false, bg: "bg-slate-100 text-slate-700" },
    },
    {
      label: "Pengaturan Profil",
      href: "/owner/dashboard#profil",
      icon: Settings,
      isActive: false,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-full w-[260px] bg-white border-r border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between pt-5 pb-5 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Brand Tapak. */}
          <div className="px-6 mb-6 flex items-center justify-between">
            <Link href="/owner/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[10px] bg-[#3D77EE] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-blue-500/20">
                T
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#111827]">
                Tapak<span className="text-[#3D77EE]">.</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Switch to Super Admin Studio if user is Super Admin */}
          {isSuperAdmin && (
            <div className="px-3 mb-3">
              <Link
                href="/admin"
                prefetch={true}
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all text-xs font-bold border border-slate-700 shadow-sm group"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Crown className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="leading-tight truncate">Super Admin Studio</span>
                  <span className="text-[10px] text-slate-400 font-normal">Kelola Konten &amp; Web</span>
                </div>
              </Link>
            </div>
          )}

          {/* Section Header: Menu Utama */}
          <div className="px-5 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block px-2">
              Menu Utama
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={true}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs font-semibold ${
                    item.isActive
                      ? "bg-[#3D77EE] text-white shadow-sm font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#111827]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${item.isActive ? "text-white" : "text-slate-500"}`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`flex items-center justify-center font-bold text-[10px] px-2 py-0.5 rounded-full ${item.badge.bg}`}
                    >
                      {item.badge.text}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section Bawah: Pengaturan & Dukungan */}
        <div className="px-3 pt-3 border-t border-slate-100 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-1 block">
            Pengaturan &amp; Dukungan
          </span>

          <button
            type="button"
            onClick={() => setIsSupportOpen(true)}
            className="flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-[#111827] rounded-xl transition-all text-xs font-semibold w-full text-left cursor-pointer"
          >
            <Headphones className="w-4 h-4 text-[#3D77EE]" />
            <span>Bantuan &amp; Dukungan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all text-xs font-semibold w-full text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Modal Popup Bantuan & Dukungan */}
      <OwnerSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </>
  );
}
