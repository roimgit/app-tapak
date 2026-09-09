import React from "react";
import { MessageCircle, ArrowRight, Building2, Home } from "lucide-react";

interface LeadItem {
  name: string;
  tag: string;
  timeAgo: string;
  message: string;
  propertyTitle: string;
  propertyType: "apartment" | "house";
  phone: string;
}

const LEADS_DATA: LeadItem[] = [
  {
    name: "Hendra Wijaya",
    tag: "#JadwalSurvei",
    timeAgo: "12m lalu",
    message: "Ingin survei unit Senopati Suites besok sore, apakah bisa didampingi?",
    propertyTitle: "Senopati Suites 2BR",
    propertyType: "apartment",
    phone: "6281234567890",
  },
  {
    name: "Dr. Anita Salim",
    tag: "#Inquiry",
    timeAgo: "45m lalu",
    message: "Tanya ketersediaan slot parkir mobil & biaya IPL bulanan di BSD Sky House.",
    propertyTitle: "Studio Sky House",
    propertyType: "apartment",
    phone: "6281234567890",
  },
  {
    name: "Budi Santoso",
    tag: "#HotLead",
    timeAgo: "2j lalu",
    message: "Negosiasi cash bertahap untuk pembelian unit Rumah Sudirman Park.",
    propertyTitle: "Sudirman Park Modern",
    propertyType: "house",
    phone: "6281234567890",
  },
  {
    name: "Farhan Pratama",
    tag: "#VideoTour",
    timeAgo: "4j lalu",
    message: "Minta foto video walkthrough 360° balkon unit Senopati Suites.",
    propertyTitle: "Senopati Suites 2BR",
    propertyType: "apartment",
    phone: "6281234567890",
  },
];

export default function RecentLeadsFeed() {
  return (
    <div
      id="feed-wa"
      className="rounded-[18px] bg-white p-6 shadow-xs border border-slate-200/80 flex flex-col gap-4 scroll-mt-20"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3D77EE] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3D77EE]" />
          </span>
          <h2 className="text-base font-bold text-[#111827]">Prospek &amp; WA Terkini</h2>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#3D77EE] font-bold text-[10px]">
          Live Feed
        </span>
      </div>

      {/* Leads List */}
      <div className="flex flex-col gap-3">
        {LEADS_DATA.map((lead) => (
          <div
            key={lead.name}
            className="p-3.5 rounded-xl bg-slate-50/80 hover:bg-blue-50/40 border border-slate-100 transition-colors flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#111827]">{lead.name}</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-100/70 text-[#3D77EE] font-bold text-[10px]">
                  {lead.tag}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">{lead.timeAgo}</span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 italic">
              &ldquo;{lead.message}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
                {lead.propertyType === "apartment" ? (
                  <Building2 className="w-3.5 h-3.5 text-[#3D77EE]" />
                ) : (
                  <Home className="w-3.5 h-3.5 text-[#3D77EE]" />
                )}
                <span>{lead.propertyTitle}</span>
              </span>

              <a
                href={`https://wa.me/${lead.phone}?text=Halo%20${encodeURIComponent(
                  lead.name
                )},%20terima%20kasih%20telah%20menghubungi%20kami%20terkait%20${encodeURIComponent(
                  lead.propertyTitle
                )}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[11px] text-[#3D77EE] hover:underline flex items-center gap-0.5"
              >
                <span>Balas WA</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to WA Inbox */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] bg-blue-50 hover:bg-blue-100 text-[#3D77EE] font-bold text-xs transition-all group"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Buka Kotak Masuk WhatsApp (3 Belum Dibalas)</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  );
}
