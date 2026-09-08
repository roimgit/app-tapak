import React from "react";
import { ShieldCheck } from "lucide-react";

export default function PaymentFooter() {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 py-6 mt-16 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-[#687280]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#3D77EE] shrink-0" />
          <p>
            © {new Date().getFullYear()} PT Tapak Properti Digital. Seluruh transaksi dijamin aman via Rekening Bersama Escrow &amp; Bank Partner Terlisensi OJK.
          </p>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 text-[11px] font-medium text-slate-500">
          <span>ISO 27001 Certified</span>
          <span>PCI-DSS Compliant</span>
          <span>Asosiasi Real Estate Indonesia (REI)</span>
        </div>
      </div>
    </footer>
  );
}
