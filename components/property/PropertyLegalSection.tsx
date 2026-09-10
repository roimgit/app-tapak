import React from "react";
import { ShieldCheck, FileText, Handshake, EyeOff } from "lucide-react";
import { ListingItem } from "@/lib/types";

interface PropertyLegalSectionProps {
  listing: ListingItem;
}

const CERTIFICATE_LABELS: Record<string, string> = {
  SHM: "SHM — Sertifikat Hak Milik",
  SHGB: "SHGB — Sertifikat Hak Guna Bangunan",
  HGB: "HGB — Hak Guna Bangunan",
  STRATA_TITLE: "Strata Title (PPJB)",
  GIRIK: "Girik / Letter C",
  BELUM_BERSERTIFIKAT: "Belum Bersertifikat",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BISA_KPR: "Bisa KPR",
  CASH_KERAS: "Cash Keras",
  CASH_BERTAHAP: "Cash Bertahap",
};

export default function PropertyLegalSection({ listing }: PropertyLegalSectionProps) {
  const isDijual = listing.transaction_type === "DIJUAL";

  if (!isDijual && !listing.certificate_type) return null;

  return (
    <div className="bg-white rounded-[10px] p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <FileText className="w-4 h-4 text-[#3D77EE]" />
        <h2 className="text-sm font-bold text-[#111827]">Legalitas & Status Properti</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {listing.certificate_type && (
          <div className="p-3.5 rounded-[8px] bg-[#F3F6FB] border border-slate-200/60">
            <span className="text-[11px] font-semibold text-[#687280] uppercase tracking-wide block mb-1">
              Jenis Sertifikat
            </span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#3D77EE]" />
              <span className="text-sm font-bold text-[#111827]">
                {CERTIFICATE_LABELS[listing.certificate_type] ?? listing.certificate_type}
              </span>
            </div>
          </div>
        )}

        {isDijual && listing.price_status && (
          <div className="p-3.5 rounded-[8px] bg-[#F3F6FB] border border-slate-200/60">
            <span className="text-[11px] font-semibold text-[#687280] uppercase tracking-wide block mb-1">
              Status Harga
            </span>
            <span
              className={`inline-flex px-2.5 py-1 rounded-[6px] text-xs font-bold ${
                listing.price_status === "NEGO"
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200"
              }`}
            >
              {listing.price_status === "NEGO" ? "Harga Nego" : "Harga Nett (Fixed)"}
            </span>
          </div>
        )}
      </div>

      {isDijual && listing.payment_methods && listing.payment_methods.length > 0 && (
        <div>
          <span className="text-[11px] font-semibold text-[#687280] uppercase tracking-wide block mb-2">
            Opsi Pembayaran
          </span>
          <div className="flex flex-wrap gap-2">
            {listing.payment_methods.map((method) => (
              <span
                key={method}
                className="px-3 py-1.5 rounded-[6px] text-xs font-bold bg-blue-50 text-[#3D77EE] border border-blue-200"
              >
                {PAYMENT_METHOD_LABELS[method] ?? method}
              </span>
            ))}
          </div>
        </div>
      )}

      {listing.is_private && (
        <div className="flex items-start gap-2 p-3 rounded-[8px] bg-slate-50 border border-slate-200 text-xs text-[#687280]">
          <EyeOff className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>Alamat tepat disembunyikan atas permintaan pemilik. Lokasi ditampilkan di tingkat kawasan.</span>
        </div>
      )}

      {listing.co_broking_enabled && listing.co_broking_commission && (
        <div className="flex items-start gap-2 p-3 rounded-[8px] bg-blue-50/60 border border-blue-100">
          <Handshake className="w-4 h-4 text-[#3D77EE] shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-[#111827] block">
              Co-Broking Terbuka — Komisi {listing.co_broking_commission}%
            </span>
            <span className="text-[11px] text-[#687280]">
              Agen lain dipersilakan membawa calon pembeli/penyewa dengan komisi yang telah disepakati.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
