import React from "react";
import Link from "next/link";
import { Plus, Calendar, Sparkles, ArrowRight } from "lucide-react";

interface DashboardHeaderAreaProps {
  ownerName?: string;
  quotaAvailable?: number;
}

export default function DashboardHeaderArea({
  ownerName = "Super Admin",
  quotaAvailable = 2,
}: DashboardHeaderAreaProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. Header Greeting & CTA */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Selamat Datang, {ownerName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#3D77EE] shrink-0" />
            <span>Selasa, 8 September 2026</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>Kelola kuota tayang dan performa leads properti Anda secara efisien</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            href="/paket-iklan"
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-[#3D77EE] hover:bg-[#2B55AB] text-white text-xs sm:text-sm font-bold rounded-[10px] shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Pasang Iklan Properti</span>
          </Link>
        </div>
      </section>

      {/* 2. Notification Banner */}
      <aside className="relative overflow-hidden rounded-[18px] bg-blue-50/80 border border-blue-100 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#3D77EE] shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-[#111827]">
              <strong className="font-bold text-[#3D77EE]">Paket Multi-Lapak Aktif:</strong>{" "}
              Berlaku sampai 2 Okt 2026. Tersisa{" "}
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#3D77EE] font-bold text-xs">
                {quotaAvailable} Slot Kosong
              </span>{" "}
              yang siap dimaksimalkan untuk menjaring calon prospek!
            </p>
          </div>

          <Link
            href="/paket-iklan"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#3D77EE] hover:text-[#2B55AB] transition-colors shrink-0 group"
          >
            <span>Gunakan Slot Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
