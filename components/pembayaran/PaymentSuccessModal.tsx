"use client";

import React from "react";
import Link from "next/link";
import { X, CheckCircle2, ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";
import { PlanPricing } from "./PaymentOrderSummary";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanPricing;
}

export default function PaymentSuccessModal({
  isOpen,
  onClose,
  plan,
}: PaymentSuccessModalProps) {
  if (!isOpen) return null;

  const invoiceNumber = "TPK-INV-" + Math.floor(100000 + Math.random() * 900000);

  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(plan.total);

  const waMessage = `Halo Admin Tapak, saya telah melakukan pembayaran sewa lapak:\n\n- No. Faktur: ${invoiceNumber}\n- Paket: ${plan.name}\n- Total: ${formattedTotal}\n- Durasi: ${plan.durationText}\n\nMohon bantu verifikasi dan aktivasi slot listing saya. Terima kasih!`;
  const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Transaksi Terverifikasi</span>
        </span>

        <h3 className="text-xl font-bold text-[#111827] mt-3">
          Pembayaran Sedang Diproses
        </h3>
        <p className="text-xs text-[#687280] mt-1.5 leading-relaxed">
          Sistem gateway sedang memvalidasi dana Anda secara real-time. Kuota listing akan langsung aktif otomatis.
        </p>

        {/* Invoice Summary Box */}
        <div className="mt-5 p-4 rounded-[14px] bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Nomor Faktur:</span>
            <span className="font-mono font-bold text-[#111827]">{invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Paket:</span>
            <span className="font-semibold text-[#111827]">{plan.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Masa Aktif:</span>
            <span className="font-semibold text-[#111827]">{plan.durationText}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200">
            <span className="text-slate-600 font-bold">Total Pembayaran:</span>
            <span className="font-black text-[#3D77EE] text-sm">{formattedTotal}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-[10px] bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim Bukti ke WhatsApp CS</span>
          </a>

          <Link
            href="/explore"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-[#111827] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Kembali ke Beranda Tapak</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
