import React from "react";
import { Building2, Headphones } from "lucide-react";

export default function EnterpriseBanner() {
  const waBusinessUrl =
    "https://wa.me/6281234567890?text=Halo%20Tim%20Bisnis%20Tapak,%20saya%20ingin%20berdiskusi%20mengenai%20paket%20iklan%20korporasi%20/%20portofolio%20besar.";

  return (
    <section className="mt-16 bg-blue-50/80 border border-blue-100 rounded-[18px] p-6 lg:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#3D77EE] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#111827]">
              Memiliki lebih dari 50 properti atau butuh paket kustom korporasi?
            </h4>
            <p className="text-xs text-[#687280] mt-0.5 leading-relaxed">
              Dapatkan paket integrasi API, multi-user sub-akun agen, dan skema pembayaran korporat fleksibel.
            </p>
          </div>
        </div>

        <a
          href={waBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] bg-[#3D77EE] text-white hover:bg-[#2B55AB] text-sm font-bold shadow-md shadow-blue-500/20 shrink-0 transition-all active:scale-[0.98]"
        >
          <Headphones className="w-4 h-4" />
          <span>Hubungi Tim Bisnis Tapak</span>
        </a>
      </div>
    </section>
  );
}
