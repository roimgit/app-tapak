import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OwnerSubNav from "@/components/paket-iklan/OwnerSubNav";
import { prisma } from "@/lib/prisma";
import {
  ShieldCheck,
  Sparkles,
  PlusCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Receipt,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard Pemilik Properti — Tapak.",
  description:
    "Kelola kuota sewa lapak, pantau masa aktif iklan, dan publikasikan properti Anda di Tapak.",
};

interface OwnerDashboardProps {
  searchParams: Promise<{
    payment?: string;
    orderId?: string;
  }>;
}

export default async function OwnerDashboardPage({
  searchParams,
}: OwnerDashboardProps) {
  const params = await searchParams;
  const isPaymentSuccess = params.payment === "success";

  // Ambil data subscription aktif & riwayat payment dari database
  let activeSubscription = null;
  let payments: Array<{
    id: string;
    order_id: string;
    amount: unknown;
    payment_method: string;
    status: string;
    created_at: Date;
  }> = [];

  try {
    activeSubscription = await prisma.subscription.findFirst({
      where: { user_id: "owner_demo", is_active: true },
      orderBy: { created_at: "desc" },
    });

    payments = await prisma.payment.findMany({
      where: { user_id: "owner_demo" },
      orderBy: { created_at: "desc" },
      take: 5,
    });
  } catch (err) {
    console.error("Dashboard data fetch fallback:", err);
  }

  // Fallback data demo jika belum ada transaksi di database
  const quotaTotal = activeSubscription?.quota_total ?? 5;
  const quotaUsed = activeSubscription?.quota_used ?? 0;
  const quotaAvailable = quotaTotal - quotaUsed;
  const packageName = activeSubscription?.package_name ?? "Multi Lapak";

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB] text-[#111827]">
      <Navbar />
      <OwnerSubNav />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Notifikasi Pembayaran Berhasil */}
        {isPaymentSuccess && (
          <div className="mb-8 p-5 sm:p-6 rounded-[18px] bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider opacity-90 block">
                    NICEPAY SNAP BI • Terverifikasi Otomatis
                  </span>
                  <h2 className="text-xl font-black">
                    Kuota Lapak Berhasil Aktif!
                  </h2>
                  <p className="text-xs opacity-90 mt-0.5">
                    Transaksi {params.orderId ? `#${params.orderId}` : ""} telah lunas. Kuota iklan siap digunakan sekarang.
                  </p>
                </div>
              </div>

              <Link
                href="/explore"
                className="px-5 py-2.5 rounded-[10px] bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors shadow-sm shrink-0"
              >
                Mulai Pasang Listing
              </Link>
            </div>
          </div>
        )}

        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3D77EE]">
                Studio Manajemen Iklan
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#3D77EE] text-[10px] font-bold border border-blue-100">
                Owner Terverifikasi
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
              Dashboard Properti Saya
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/paket-iklan"
              className="px-4 py-2.5 rounded-[10px] bg-white border border-slate-200 text-xs font-bold text-[#111827] hover:bg-slate-50 transition-colors"
            >
              Tambah / Perpanjang Paket
            </Link>
            <Link
              href="/paket-iklan"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-[#3D77EE] hover:bg-[#2B55AB] text-white text-xs font-bold transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Pasang Listing Baru</span>
            </Link>
          </div>
        </div>

        {/* 4 Kartu Statistik Kuota Lapak */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-[18px] p-5 border border-slate-200/80 shadow-xs">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Total Kuota Paket
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#111827]">{quotaTotal}</span>
              <span className="text-xs font-semibold text-[#687280]">Listing Aktif</span>
            </div>
            <span className="text-[11px] text-[#3D77EE] font-semibold block mt-1">
              Paket: {packageName}
            </span>
          </div>

          <div className="bg-white rounded-[18px] p-5 border border-slate-200/80 shadow-xs">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Sisa Kuota Tersedia
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-600">{quotaAvailable}</span>
              <span className="text-xs font-semibold text-[#687280]">Slot Kosong</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
              Siap dipublikasikan kapan saja
            </span>
          </div>

          <div className="bg-white rounded-[18px] p-5 border border-slate-200/80 shadow-xs">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Kuota Terpakai
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-700">{quotaUsed}</span>
              <span className="text-xs font-semibold text-[#687280]">Tayang di Peta</span>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block mt-1">
              {quotaUsed === 0 ? "Belum ada iklan tayang" : `${quotaUsed} properti live`}
            </span>
          </div>

          <div className="bg-white rounded-[18px] p-5 border border-slate-200/80 shadow-xs">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Status Berlangganan
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-lg font-bold text-[#111827]">Aktif &amp; Terverifikasi</span>
            </div>
            <span className="text-[11px] text-[#687280] block mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3D77EE]" />
              <span>Garansi transaksi aman</span>
            </span>
          </div>
        </div>

        {/* Grid 2 Kolom: Detail Langganan & Riwayat Transaksi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Detail Paket Aktif (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-[18px] border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3D77EE]" />
                <h3 className="text-base font-bold text-[#111827]">Paket Aktif Saat Ini</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3D77EE] text-[11px] font-bold">
                {packageName}
              </span>
            </div>

            <div className="space-y-3.5 text-xs text-[#687280]">
              <div className="flex items-center justify-between">
                <span>Pengguna / Pemilik:</span>
                <strong className="text-[#111827]">Oim (owner_demo)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Kuota Unit:</span>
                <strong className="text-[#111827]">{quotaTotal} Properti Sekaligus</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Masa Aktif:</span>
                <strong className="text-[#111827]">
                  {activeSubscription?.start_date
                    ? new Date(activeSubscription.start_date).toLocaleDateString("id-ID")
                    : "Aktif"} s/d{" "}
                  {activeSubscription?.end_date
                    ? new Date(activeSubscription.end_date).toLocaleDateString("id-ID")
                    : "60 Hari Kedepan"}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Integrasi WhatsApp:</span>
                <strong className="text-emerald-700">Terhubung Langsung</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Prioritas Pencarian:</span>
                <strong className="text-[#3D77EE]">Peringkat Atas Regional</strong>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                href="/explore"
                className="w-full py-3 rounded-[10px] bg-[#3D77EE] hover:bg-[#2B55AB] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Lihat Listing di Peta Jelajah</span>
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Riwayat Pembayaran (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-[18px] border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#3D77EE]" />
                <h3 className="text-base font-bold text-[#111827]">Riwayat Pembayaran Terbaru</h3>
              </div>
              <span className="text-xs text-slate-400">SNAP BI Gateway</span>
            </div>

            {payments.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs">
                {payments.map((p) => (
                  <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#111827]">{p.order_id}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === "SETTLED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#687280] mt-1">
                        <span>{p.payment_method}</span>
                        <span>•</span>
                        <span>{new Date(p.created_at).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-[#111827] block">
                        {formatRupiah(Number(p.amount))}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        Lunas Otomatis
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>Belum ada riwayat transaksi yang tercatat.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
