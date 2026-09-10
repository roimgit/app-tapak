import React from "react";
import { ShieldCheck } from "lucide-react";
import { ListingItem } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";

interface PropertyCostBreakdownProps {
  listing: ListingItem;
}

export default function PropertyCostBreakdown({ listing }: PropertyCostBreakdownProps) {
  const isDijual = listing.transaction_type === "DIJUAL";

  if (isDijual) {
    const notaryCost = Math.round(listing.price * 0.01);
    const transferCost = Math.round(listing.price * 0.005);
    const totalEstimate = listing.price + notaryCost + transferCost;

    return (
      <div className="bg-white rounded-[10px] p-6 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">Estimasi Biaya Pembelian</h2>
            <p className="text-xs text-[#687280] mt-0.5">
              Estimasi biaya di luar harga jual. Angka final sesuai kesepakatan notaris.
            </p>
          </div>
          <span className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-blue-50 text-[#3D77EE] rounded-full border border-blue-200">
            <ShieldCheck className="w-4 h-4" />
            Panduan Tapak.
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-[8px] bg-slate-50 border border-slate-200">
            <div>
              <span className="text-sm font-bold text-[#111827] block">Harga Jual Properti</span>
              <span className="text-xs text-[#687280]">Harga yang disepakati antara penjual dan pembeli</span>
            </div>
            <span className="text-base font-extrabold text-[#111827]">{formatRupiah(listing.price)}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-[8px] bg-blue-50/50 border border-blue-100">
            <div>
              <span className="text-sm font-bold text-[#111827] block">Estimasi Biaya Notaris / PPAT</span>
              <span className="text-xs text-[#687280]">~1% dari nilai transaksi (bervariasi per notaris)</span>
            </div>
            <span className="text-base font-bold text-[#3D77EE]">~{formatRupiah(notaryCost)}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-[8px] bg-slate-50 border border-slate-200">
            <div>
              <span className="text-sm font-bold text-[#111827] block">Estimasi Biaya Balik Nama (BBN)</span>
              <span className="text-xs text-[#687280]">~0.5% dari NJOP/nilai transaksi</span>
            </div>
            <span className="text-base font-bold text-[#111827]">~{formatRupiah(transferCost)}</span>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/50 to-transparent p-4 rounded-[8px]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3D77EE]">
              Total Estimasi Biaya:
            </span>
            <p className="text-xs text-[#687280]">(Harga Jual + Notaris + Balik Nama)</p>
          </div>
          <span className="text-2xl font-extrabold text-[#111827]">{formatRupiah(totalEstimate)}</span>
        </div>
      </div>
    );
  }

  // === DISEWAKAN breakdown ===
  const firstMonthTotal =
    listing.price + listing.maintenance_fee + listing.utility_estimate + listing.deposit;

  return (
    <div className="bg-white rounded-[10px] p-6 sm:p-7 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#111827]">Rincian Biaya Transparan</h2>
          <p className="text-xs text-[#687280] mt-0.5">
            Standar transparansi Tapak.: Tidak ada biaya tersembunyi saat tanda tangan kontrak
          </p>
        </div>
        <span className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-blue-50 text-[#3D77EE] rounded-full border border-blue-200">
          <ShieldCheck className="w-4 h-4" />
          Audit Tim Tapak.
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3.5 rounded-[8px] bg-slate-50 border border-slate-200">
          <div>
            <span className="text-sm font-bold text-[#111827] block">Harga Sewa Pokok</span>
            <span className="text-xs text-[#687280]">Pembayaran sewa unit hunian per bulan</span>
          </div>
          <span className="text-base font-extrabold text-[#111827]">
            {formatRupiah(listing.price)}/bln
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-[8px] bg-blue-50/50 border border-blue-100">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#111827]">
                Biaya Pengelolaan Lingkungan (IPL)
              </span>
              <span className="text-[11px] font-bold text-[#3D77EE] bg-blue-100 px-1.5 py-0.5 rounded">
                Transparan
              </span>
            </div>
            <span className="text-xs text-[#687280]">
              Maintenance gedung, kebersihan, keamanan 24 jam, dan fasilitas klub
            </span>
          </div>
          <span className="text-base font-bold text-[#3D77EE]">
            {formatRupiah(listing.maintenance_fee)}/bln
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-[8px] bg-slate-50 border border-slate-200">
          <div>
            <span className="text-sm font-bold text-[#111827] block">
              Estimasi Utilitas (Listrik, Air & Wifi)
            </span>
            <span className="text-xs text-[#687280]">
              Perkiraan pemakaian normal berdasarkan data historis unit sejenis
            </span>
          </div>
          <span className="text-base font-bold text-[#111827]">
            {formatRupiah(listing.utility_estimate)}/bln
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-[8px] bg-amber-50/60 border border-amber-200">
          <div>
            <span className="text-sm font-bold text-amber-950 block">
              Deposit Jaminan (Refundable)
            </span>
            <span className="text-xs text-amber-800">
              Uang jaminan yang dikembalikan 100% saat masa sewa selesai tanpa kerusakan
            </span>
          </div>
          <span className="text-base font-bold text-amber-900">{formatRupiah(listing.deposit)}</span>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/50 to-transparent p-4 rounded-[8px]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3D77EE]">
            Total Estimasi Masuk Pertama:
          </span>
          <p className="text-xs text-[#687280]">(Sewa Bln 1 + IPL + Utilitas + Deposit)</p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-2xl font-extrabold text-[#111827]">
            {formatRupiah(firstMonthTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}


