import React from "react";
import { MessageCircle, Phone, Calendar, CheckCircle2, ShieldCheck } from "lucide-react";
import { ListingItem } from "@/lib/types";
import { formatRupiah, formatWhatsAppUrl } from "@/lib/utils";

interface PropertyAgentSidebarProps {
  listing: ListingItem;
}

export default function PropertyAgentSidebar({ listing }: PropertyAgentSidebarProps) {
  const waMessage = `Halo ${listing.agent_name}, saya melihat listing "${listing.title}" di Tapak. (https://tapak.id/property/${listing.slug}). Saya ingin menanyakan ketersediaan dan menjadwalkan survey lokasi.`;
  const waLink = formatWhatsAppUrl(listing.agent_phone, waMessage);

  return (
    <div className="sticky top-28 bg-white rounded-[18px] p-6 border border-slate-200 shadow-md">
      <div className="mb-5 pb-5 border-b border-slate-100">
        <span className="text-xs font-semibold text-[#687280] block">Harga Sewa Pokok</span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            {formatRupiah(listing.price)}
          </span>
          <span className="text-xs text-[#687280] font-normal">/bulan</span>
        </div>
        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          IPL {formatRupiah(listing.maintenance_fee)}/bln Transparan
        </span>
      </div>

      <div className="flex items-center gap-3.5 mb-6 p-3.5 rounded-[12px] bg-slate-50 border border-slate-200">
        <div className="w-12 h-12 rounded-full bg-[#3D77EE] text-white font-bold flex items-center justify-center text-base shadow-sm">
          {listing.agent_name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-[#111827]">{listing.agent_name}</span>
            <ShieldCheck className="w-4 h-4 text-[#3D77EE]" />
          </div>
          <span className="text-xs text-[#687280] block">Agen Properti Terlisensi Tapak.</span>
          <span className="text-[11px] text-emerald-600 font-medium">● Respons cepat &lt;5 mnt</span>
        </div>
      </div>

      <div className="space-y-3">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm rounded-[10px] shadow-sm transition-all active:scale-[0.98]"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>Chat WhatsApp Agen</span>
        </a>

        <a
          href={`tel:${listing.agent_phone}`}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-sm rounded-[10px] shadow-sm transition-all"
        >
          <Phone className="w-4 h-4" />
          <span>Telepon Langsung</span>
        </a>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-[10px] transition-colors"
        >
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>Jadwalkan Survey Lokasi</span>
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
        <div className="flex items-start gap-2 text-xs text-[#687280]">
          <CheckCircle2 className="w-4 h-4 text-[#3D77EE] shrink-0 mt-0.5" />
          <span>Inspeksi fisik telah disetujui kurator independen</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-[#687280]">
          <CheckCircle2 className="w-4 h-4 text-[#3D77EE] shrink-0 mt-0.5" />
          <span>Garansi dana aman melalui proteksi Tapak</span>
        </div>
      </div>
    </div>
  );
}
