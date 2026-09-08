import React from "react";
import { ShieldCheck } from "lucide-react";

export default function TrustAndPaymentSection() {
  const paymentMethods = [
    { label: "QRIS", textClass: "text-[#111827]" },
    { label: "BCA", textClass: "text-[#0EA5E9]" },
    { label: "MANDIRI", textClass: "text-[#3D77EE]" },
    { label: "BRI", textClass: "text-[#0284C7]" },
    { label: "GOPAY", textClass: "text-[#111827]" },
    { label: "OVO", textClass: "text-[#6366F1]" },
    { label: "SHOPEEPAY", textClass: "text-[#EA580C]" },
  ];

  return (
    <section className="mt-12 bg-white rounded-[18px] p-6 lg:p-8 shadow-xs border border-slate-100">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Guarantee Info */}
        <div className="flex items-center gap-4 max-w-xl">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#3D77EE] shrink-0 shadow-xs border border-blue-100">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#111827]">
              Garansi Transaksi Aman &amp; Instan
            </h4>
            <p className="text-xs text-[#687280] mt-0.5 leading-relaxed">
              Akses listing langsung aktif seketika setelah pembayaran terverifikasi otomatis. Tanpa biaya admin tersembunyi.
            </p>
          </div>
        </div>

        {/* Right: Payment Provider Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {paymentMethods.map((pm) => (
            <div
              key={pm.label}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-[10px] text-center flex items-center justify-center min-w-[72px] shadow-xs"
            >
              <span className={`text-xs font-black tracking-wider ${pm.textClass}`}>
                {pm.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
