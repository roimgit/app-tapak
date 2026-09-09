import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CheckCircle2 } from "lucide-react";
import DashboardHeaderArea from "@/components/owner/DashboardHeaderArea";
import QuotaStatusHeroCard from "@/components/owner/QuotaStatusHeroCard";
import KpiPerformanceRow from "@/components/owner/KpiPerformanceRow";
import ActivePropertiesTable from "@/components/owner/ActivePropertiesTable";
import RecentLeadsFeed from "@/components/owner/RecentLeadsFeed";
import BillingHistorySection from "@/components/owner/BillingHistorySection";

import { formatRupiah } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard Mitra Pemilik — Tapak. Owner Studio",
  description:
    "Kelola kuota tayang, pantau leads WhatsApp, dan optimalkan performa listing properti Anda di Tapak.",
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

  // Ambil data subscription aktif, riwayat payment, dan listing aktif dari database
  let activeSubscription = null;
  let payments: Array<{
    id: string;
    order_id: string;
    amount: unknown;
    payment_method: string;
    status: string;
    created_at: Date;
  }> = [];
  let activeListings: any[] = [];

  try {
    activeSubscription = await prisma.subscription.findFirst({
      where: { user_id: { in: ["admin@admin.com", "owner_demo"] }, is_active: true },
      orderBy: { created_at: "desc" },
    });

    payments = await prisma.payment.findMany({
      where: { user_id: { in: ["admin@admin.com", "owner_demo"] } },
      orderBy: { created_at: "desc" },
      take: 6,
    });

    activeListings = await prisma.listing.findMany({
      where: { is_available: true },
      take: 6,
      orderBy: { created_at: "desc" },
    });
  } catch (err) {
    console.error("Dashboard data fetch fallback:", err);
  }

  const activePropertiesData = activeListings.map((l, idx) => ({
    id: l.id,
    title: l.title,
    specs: `${l.district}, ${l.city} • ${l.area_sqm} m²`,
    type: (l.property_type === "Rumah" ? "rumah" : "apartemen") as "apartemen" | "rumah",
    price: `Rp ${(Number(l.price) / 1000000).toLocaleString("id-ID")} Juta`,
    pricePeriod: "/ bulan",
    daysRemaining: 30 - ((idx * 4) % 20),
    waContacts: 18 + idx * 6,
    imageUrl:
      l.images?.[0] ||
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
  }));

  // Metrik kuota lapak
  const packageName = activeSubscription?.package_name || "Paket Multi-Lapak";
  const quotaTotal = activeSubscription?.quota_total || 5;
  const quotaUsed = activeListings.length > 0 ? Math.min(activeListings.length, quotaTotal) : 3;
  const quotaAvailable = Math.max(0, quotaTotal - quotaUsed);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Banner Konfirmasi Pembayaran Sukses (jika ada param ?payment=success) */}
      {isPaymentSuccess && (
        <div className="p-4 sm:p-5 rounded-[18px] bg-emerald-500 text-white shadow-lg shadow-emerald-500/10 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-white/20 flex items-center justify-center font-bold text-lg">
                ✓
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                  Pembayaran Terverifikasi
                </span>
                <h2 className="text-lg font-black">Kuota Lapak Berhasil Aktif!</h2>
                <p className="text-xs opacity-90">
                  Transaksi {params.orderId ? `#${params.orderId}` : ""} telah lunas. Kuota iklan siap digunakan sekarang.
                </p>
              </div>
            </div>
            <a
              href="#properti"
              className="px-4 py-2 rounded-[10px] bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors shadow-2xs shrink-0"
            >
              Lihat Properti Saya &darr;
            </a>
          </div>
        </div>
      )}

      {/* 1. Header Area & Banner Notifikasi */}
      <DashboardHeaderArea ownerName="Super Admin" quotaAvailable={quotaAvailable} />

      {/* 2. Hero Card: WIDGET STATUS KUOTA LAPAK AKTIF */}
      <QuotaStatusHeroCard
        packageName={packageName}
        quotaTotal={quotaTotal}
        quotaUsed={quotaUsed}
        remainingDays={24}
        endDateFormatted="2 Oktober 2026"
      />

      {/* 3. Row Metrik KPI: Leads WhatsApp, Tayangan, Status Distribusi */}
      <KpiPerformanceRow />

      {/* 4. Grid Utama: Tabel Properti Tayang (8 cols) & Feed Leads WhatsApp (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <ActivePropertiesTable initialProperties={activePropertiesData} />
        </div>
        <div className="lg:col-span-4">
          <RecentLeadsFeed />
        </div>
      </div>

      {/* 5. Riwayat Tagihan & Pembayaran Otomatis */}
      <BillingHistorySection payments={payments} />
    </div>
  );
}
