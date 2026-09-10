"use client";

import React, { useEffect } from "react";
import {
  X,
  Headphones,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { SupportContactItem } from "@/lib/site-settings";

interface OwnerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OwnerSupportModal({ isOpen, onClose }: OwnerSupportModalProps) {
  const { settings } = useSiteSettings();
  const support = settings?.support;

  // Tutup popup dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeContacts = support?.contacts?.filter((c) => c.isActive) || [];

  const getContactIcon = (type: SupportContactItem["type"]) => {
    switch (type) {
      case "whatsapp":
        return <MessageCircle className="w-5 h-5 text-emerald-600" />;
      case "email":
        return <Mail className="w-5 h-5 text-[#3D77EE]" />;
      case "phone":
        return <Phone className="w-5 h-5 text-amber-600" />;
      default:
        return <Headphones className="w-5 h-5 text-[#3D77EE]" />;
    }
  };

  const getActionLabel = (type: SupportContactItem["type"]) => {
    switch (type) {
      case "whatsapp":
        return "Chat WhatsApp";
      case "email":
        return "Kirim Email";
      case "phone":
        return "Panggil CS";
      default:
        return "Hubungi";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-[24px] border border-[#E2E8F0] shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Section */}
        <div className="px-6 pt-6 pb-4 border-b border-[#E2E8F0] relative bg-gradient-to-b from-blue-50/50 to-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Tutup jendela bantuan"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-[10px] bg-[#3D77EE] text-white flex items-center justify-center shadow-xs">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tim Dukungan Siap Membantu</span>
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-[#111827] tracking-tight">
            {support?.title || "Pusat Bantuan & Dukungan Mitra Tapak."}
          </h2>
          <p className="text-xs text-[#687280] mt-1 leading-relaxed">
            {support?.subtitle ||
              "Konsultasikan kendala akun, pembayaran paket iklan, atau panduan verifikasi properti bersama konsultan resmi kami."}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-5 overflow-y-auto space-y-4">
          {/* Jam Operasional Banner */}
          <div className="p-3.5 rounded-[14px] bg-slate-50 border border-slate-200 flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#3D77EE] mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-[#111827] block">Jam Operasional Layanan:</span>
              <p className="text-slate-600 mt-0.5">
                {support?.workingHours || "Senin – Minggu: 08.00 – 22.00 WIB"}
              </p>
            </div>
          </div>

          {/* List Saluran Kontak */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-0.5">
              Pilih Saluran Komunikasi
            </span>

            {activeContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-[16px] bg-white border border-[#E2E8F0] hover:border-[#3D77EE] hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-[12px] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getContactIcon(contact.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-[#111827] truncate">
                        {contact.name}
                      </span>
                      {contact.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase bg-blue-50 text-[#3D77EE] border border-blue-100">
                          {contact.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-700 block mt-0.5">
                      {contact.value}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {contact.description}
                    </p>
                  </div>
                </div>

                <a
                  href={contact.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-[10px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] transition-all shrink-0 inline-flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{getActionLabel(contact.type)}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          {/* Emergency Note */}
          {support?.emergencyNote && (
            <div className="p-3 rounded-[12px] bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11.5px] leading-relaxed">
                {support.emergencyNote}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Layanan Terverifikasi Tapak.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-[8px] font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
