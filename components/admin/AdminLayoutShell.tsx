"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, Lock, ArrowRight, Home, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminLayoutShellProps {
  children: React.ReactNode;
}

export default function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, login } = useAuth();
  const isAdministrator =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "ADMIN" ||
    user?.email?.toLowerCase() === "admin@admin.com";

  const [checkingAuth, setCheckingAuth] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const rawSession = sessionStorage.getItem("tapak_owner_session");
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        if (
          parsed?.role === "SUPER_ADMIN" ||
          parsed?.role === "ADMIN" ||
          parsed?.email?.toLowerCase() === "admin@admin.com"
        ) {
          return false;
        }
      }
    } catch {
      // safe
    }
    return true;
  });

  useEffect(() => {
    if (!checkingAuth) return;
    if (isAdministrator) {
      setCheckingAuth(false);
      return;
    }
    const timer = setTimeout(() => {
      setCheckingAuth(false);
    }, 60);
    return () => clearTimeout(timer);
  }, [checkingAuth, isAdministrator]);

  // State loading otorisasi
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F3F6FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-[#3D77EE] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-slate-500">
            Memverifikasi Hak Akses Administrator...
          </span>
        </div>
      </div>
    );
  }

  // Jika bukan Administrator, tolak akses dengan tampilan elegan
  if (!isAuthenticated || !isAdministrator) {
    return (
      <div className="min-h-screen bg-[#F3F6FB] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[20px] p-7 border border-[#E2E8F0] shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Akses Ditolak</span>
            </div>
            <h1 className="text-xl font-extrabold text-[#111827]">
              Super Admin Studio Terkunci
            </h1>
            <p className="text-xs text-[#687280] leading-relaxed">
              Area ini dikhususkan bagi akun dengan hak akses <strong>Administrator</strong> atau <strong>Super Admin</strong> Tapak.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Akun Saat Ini:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                {user?.email || "Belum Masuk"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tipe / Role:</span>
              <span className="font-bold text-rose-600">
                {user?.role || "Non-Admin"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <Link
              href="/login?redirect=/admin"
              className="flex-1 px-4 py-2.5 rounded-[10px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>Masuk Akun Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => {
                login({
                  email: "admin@admin.com",
                  name: "Super Admin",
                  role: "SUPER_ADMIN",
                  type: "admin",
                });
              }}
              className="px-4 py-2.5 rounded-[10px] text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Akses cepat pengujian sebagai Super Admin"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Aktivasi Demo Admin</span>
            </button>

            <Link
              href="/owner/dashboard"
              className="px-3 py-2.5 rounded-[10px] text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F6FB] text-[#111827]">
      {/* Super Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area: Offset for 260px desktop sidebar */}
      <div className="pl-0 md:pl-[260px] flex flex-col min-h-screen">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        {/* Padding-top ditingkatkan menjadi pt-20 sm:pt-24 agar konten tidak tertutup fixed header */}
        <main className="pt-20 sm:pt-24 flex-1 w-full px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
