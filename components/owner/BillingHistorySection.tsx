import React from "react";
import Link from "next/link";
import { Receipt, CheckCircle2, AlertCircle } from "lucide-react";

interface PaymentRecord {
  id: string;
  order_id: string;
  amount: unknown;
  payment_method: string;
  status: string;
  created_at: Date;
}

interface BillingHistorySectionProps {
  payments: PaymentRecord[];
}

export default function BillingHistorySection({ payments }: BillingHistorySectionProps) {
  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div
      id="riwayat"
      className="rounded-[18px] bg-white p-6 shadow-xs border border-slate-200/80 scroll-mt-20 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[8px] bg-blue-50 flex items-center justify-center text-[#3D77EE]">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111827]">Riwayat Tagihan &amp; Pembayaran</h3>
            <p className="text-xs text-slate-500">
              Transaksi tercatat otomatis via NICEPAY SNAP BI Gateway
            </p>
          </div>
        </div>
        <Link
          href="/paket-iklan"
          className="text-xs font-bold text-[#3D77EE] hover:underline"
        >
          + Beli Kuota Baru
        </Link>
      </div>

      {payments.length > 0 ? (
        <div className="divide-y divide-slate-100 text-xs">
          {payments.map((p) => {
            const isSettled = p.status === "SETTLED";
            return (
              <div
                key={p.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isSettled
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {isSettled ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#111827]">{p.order_id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isSettled
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{p.payment_method}</span>
                      <span>&bull;</span>
                      <span>{new Date(p.created_at).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right pl-11 sm:pl-0">
                  <span className="font-black text-sm text-[#111827] block">
                    {formatRupiah(Number(p.amount))}
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      isSettled ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {isSettled ? "Lunas Otomatis" : "Menunggu Pembayaran"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 text-xs">
          <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p>Belum ada riwayat transaksi yang tercatat.</p>
        </div>
      )}
    </div>
  );
}
