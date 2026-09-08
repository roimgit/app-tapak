"use client";

import React, { useState } from "react";
import {
  Check,
  QrCode,
  Landmark,
  Wallet,
  Copy,
  Download,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

interface PaymentChannelsProps {
  amount: number;
  onCheckStatus?: () => void;
}

export default function PaymentChannels({
  amount,
  onCheckStatus,
}: PaymentChannelsProps) {
  const [selectedChannel, setSelectedChannel] = useState<string>("qris");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const vaNumbers: Record<string, { bank: string; va: string; code: string }> = {
    bca_va: { bank: "Bank BCA", va: "8277 0812 3456 7890", code: "014" },
    mandiri_va: { bank: "Bank Mandiri", va: "8960 0812 3456 7890", code: "008" },
    bri_va: { bank: "Bank BRI", va: "1028 0812 3456 7890", code: "002" },
    bni_va: { bank: "Bank BNI", va: "9880 0812 3456 7890", code: "009" },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Kanal */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          Pilih Metode Pembayaran
        </h1>
        <p className="text-sm text-[#687280] mt-1 leading-relaxed">
          Pilih kanal transaksi resmi terpercaya untuk mengaktifkan kuota listing properti Anda secara instan dan otomatis.
        </p>
      </div>

      {/* Copy Toast Notification */}
      {copiedText && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-2.5 rounded-[10px] shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{copiedText} berhasil disalin!</span>
        </div>
      )}

      {/* ================= METHOD 1: QRIS INDONESIA ================= */}
      <div
        className={`bg-white rounded-[18px] border transition-all duration-200 overflow-hidden ${
          selectedChannel === "qris"
            ? "border-[#3D77EE] shadow-md ring-2 ring-blue-100"
            : "border-slate-200/80 shadow-xs hover:border-slate-300"
        }`}
      >
        {/* Accordion Header */}
        <div
          onClick={() => setSelectedChannel("qris")}
          className="p-5 sm:p-6 cursor-pointer flex items-start justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                selectedChannel === "qris"
                  ? "bg-[#3D77EE] text-white"
                  : "border-2 border-slate-300 text-transparent"
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-base font-bold text-[#111827]">
                  QRIS Nasional (Semua Bank &amp; E-Wallet)
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Otomatis Terverifikasi
                </span>
              </div>
              <p className="text-xs text-[#687280] mt-1">
                Bisa dibayar dari BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, LinkAja, ShopeePay &amp; Livin'.
              </p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {["QRIS", "BCA", "GOPAY", "OVO", "DANA", "SHOPEEPAY"].map((brand) => (
                  <span
                    key={brand}
                    className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="p-2 rounded-[10px] bg-blue-50 text-[#3D77EE] shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
        </div>

        {/* Expanded QRIS Content */}
        {selectedChannel === "qris" && (
          <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
            <div className="bg-white rounded-[14px] p-5 sm:p-6 border border-slate-200/80 flex flex-col md:flex-row items-center gap-6">
              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-[14px] shadow-sm border border-slate-200 flex flex-col items-center shrink-0">
                <div className="flex items-center justify-between w-full pb-2 mb-2 border-b border-slate-100 text-[10px]">
                  <span className="font-bold uppercase tracking-wider text-[#111827]">
                    QRIS STANDAR BI
                  </span>
                  <span className="font-mono font-bold text-[#3D77EE] bg-blue-50 px-1.5 py-0.5 rounded">
                    NMID: ID1024398124
                  </span>
                </div>

                {/* SVG QR Code */}
                <div className="relative w-44 h-44 bg-white p-2 rounded flex items-center justify-center">
                  <svg className="w-full h-full text-slate-900" fill="currentColor" viewBox="0 0 100 100">
                    <rect fill="currentColor" height="28" rx="2" width="28" x="0" y="0" />
                    <rect fill="white" height="20" rx="1" width="20" x="4" y="4" />
                    <rect fill="currentColor" height="12" rx="1" width="12" x="8" y="8" />
                    <rect fill="currentColor" height="28" rx="2" width="28" x="72" y="0" />
                    <rect fill="white" height="20" rx="1" width="20" x="76" y="4" />
                    <rect fill="currentColor" height="12" rx="1" width="12" x="80" y="8" />
                    <rect fill="currentColor" height="28" rx="2" width="28" x="0" y="72" />
                    <rect fill="white" height="20" rx="1" width="20" x="4" y="76" />
                    <rect fill="currentColor" height="12" rx="1" width="12" x="8" y="80" />
                    <rect fill="currentColor" height="4" width="4" x="34" y="6" />
                    <rect fill="currentColor" height="4" width="6" x="44" y="6" />
                    <rect fill="currentColor" height="4" width="4" x="56" y="6" />
                    <rect fill="currentColor" height="4" width="6" x="34" y="16" />
                    <rect fill="currentColor" height="4" width="4" x="46" y="16" />
                    <rect fill="currentColor" height="4" width="6" x="58" y="16" />
                    <rect fill="currentColor" height="4" width="4" x="6" y="34" />
                    <rect fill="currentColor" height="6" width="4" x="6" y="44" />
                    <rect fill="currentColor" height="4" width="4" x="6" y="58" />
                    <rect fill="currentColor" height="6" width="4" x="16" y="34" />
                    <rect fill="currentColor" height="4" width="4" x="16" y="48" />
                    <rect fill="currentColor" height="4" width="4" x="16" y="60" />
                    <rect fill="currentColor" height="6" width="6" x="30" y="30" />
                    <rect fill="currentColor" height="4" width="4" x="40" y="32" />
                    <rect fill="currentColor" height="4" width="6" x="52" y="30" />
                    <rect fill="currentColor" height="6" width="4" x="64" y="32" />
                    <rect fill="currentColor" height="4" width="6" x="74" y="34" />
                    <rect fill="currentColor" height="4" width="6" x="88" y="34" />
                    <rect fill="currentColor" height="6" width="4" x="32" y="44" />
                    <rect fill="currentColor" height="4" width="4" x="64" y="44" />
                    <rect fill="currentColor" height="4" width="8" x="72" y="46" />
                    <rect fill="currentColor" height="6" width="6" x="86" y="44" />
                    <rect fill="currentColor" height="4" width="6" x="32" y="56" />
                    <rect fill="currentColor" height="6" width="4" x="42" y="54" />
                    <rect fill="currentColor" height="4" width="8" x="52" y="56" />
                    <rect fill="currentColor" height="4" width="4" x="66" y="56" />
                    <rect fill="currentColor" height="6" width="6" x="78" y="56" />
                    <rect fill="currentColor" height="4" width="4" x="90" y="56" />
                    <rect fill="currentColor" height="6" width="4" x="32" y="70" />
                    <rect fill="currentColor" height="4" width="6" x="42" y="68" />
                    <rect fill="currentColor" height="6" width="4" x="54" y="70" />
                    <rect fill="currentColor" height="4" width="8" x="64" y="68" />
                    <rect fill="currentColor" height="6" width="4" x="76" y="70" />
                    <rect fill="currentColor" height="4" width="8" x="86" y="72" />
                    <rect fill="currentColor" height="4" width="6" x="34" y="82" />
                    <rect fill="currentColor" height="6" width="4" x="46" y="80" />
                    <rect fill="currentColor" height="4" width="6" x="56" y="84" />
                    <rect fill="currentColor" height="4" width="4" x="68" y="82" />
                    <rect fill="currentColor" height="4" width="6" x="78" y="84" />
                    <rect fill="currentColor" height="6" width="4" x="88" y="82" />
                  </svg>
                  <div className="absolute inset-0 m-auto w-8 h-8 rounded-md bg-[#3D77EE] flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xs">TPK</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-2 text-[#687280] text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3D77EE]" />
                  <span>GPN &amp; BI Verified</span>
                </div>
              </div>

              {/* Detail Pembayaran & Aksi */}
              <div className="flex-1 w-full flex flex-col justify-between">
                <div>
                  <span className="text-xs text-[#687280]">Total Nominal Transfer:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-[#3D77EE] tracking-tight">
                      {formattedAmount}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(amount.toString(), "Nominal transfer")}
                      className="p-1.5 bg-slate-100 hover:bg-blue-50 text-[#687280] hover:text-[#3D77EE] rounded-[8px] transition-colors"
                      title="Salin Nominal"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-[8px] inline-block mt-2">
                    *Harap transfer tepat sampai 3 digit terakhir untuk validasi otomatis.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Penerima Resmi (Merchant):
                    </span>
                    <div className="font-bold text-[#111827] mt-0.5">
                      PT TAPAK TEKNOLOGI PROPERTI INDONESIA
                    </div>
                    <div className="text-[#687280] text-[11px]">
                      Kota Adm. Jakarta Selatan • Platform Real Estate
                    </div>
                  </div>
                </div>

                {/* Tombol QR Actions */}
                <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => alert("Kode QR berhasil diunduh ke perangkat Anda.")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#111827] text-xs font-bold rounded-[10px] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Kode QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={onCheckStatus}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#3D77EE] hover:bg-[#2B55AB] text-white text-xs font-bold rounded-[10px] shadow-sm transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Cek Status Pembayaran</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Langkah Panduan */}
            <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#3D77EE] text-[11px] flex items-center justify-center font-bold shrink-0">
                  1
                </span>
                <p className="text-[#687280]">Buka aplikasi mobile banking atau e-wallet pilihan Anda.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#3D77EE] text-[11px] flex items-center justify-center font-bold shrink-0">
                  2
                </span>
                <p className="text-[#687280]">
                  Pilih menu <strong>Scan QRIS</strong> dan arahkan kamera ke barcode.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#3D77EE] text-[11px] flex items-center justify-center font-bold shrink-0">
                  3
                </span>
                <p className="text-[#687280]">Pastikan nama merchant sesuai dan konfirmasi nominal pembayaran.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= METHOD 2: VIRTUAL ACCOUNT BANK ================= */}
      <div className="bg-white rounded-[18px] border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[#687280]">
              <Landmark className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                Virtual Account Bank (Konfirmasi Otomatis)
              </h3>
              <p className="text-xs text-[#687280]">
                Transfer dari ATM, Internet Banking, atau Mobile Banking tanpa upload bukti.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#3D77EE] bg-blue-50 px-2.5 py-1 rounded-full">
            Bebas Biaya Admin
          </span>
        </div>

        {/* VA Radio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {Object.entries(vaNumbers).map(([id, info]) => {
            const isSelected = selectedChannel === id;
            return (
              <label
                key={id}
                onClick={() => setSelectedChannel(id)}
                className={`relative flex items-center justify-between p-4 rounded-[12px] border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-blue-50/50 border-[#3D77EE] ring-1 ring-[#3D77EE]"
                    : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_channel"
                    checked={isSelected}
                    onChange={() => setSelectedChannel(id)}
                    className="w-4 h-4 text-[#3D77EE] accent-[#3D77EE]"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#111827]">{info.bank}</span>
                    <span className="text-[11px] text-[#687280]">Kode Bank: {info.code}</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-[#3D77EE] border border-slate-200 shadow-2xs">
                  {id.replace("_va", "").toUpperCase()} VA
                </span>
              </label>
            );
          })}
        </div>

        {/* Selected VA Details Display */}
        {selectedChannel.endsWith("_va") && vaNumbers[selectedChannel] && (
          <div className="mt-2 p-4 rounded-[12px] bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
            <div>
              <span className="text-[11px] text-[#687280] font-medium block">
                Nomor Virtual Account {vaNumbers[selectedChannel].bank}:
              </span>
              <span className="font-mono text-lg font-black text-[#111827] tracking-wider">
                {vaNumbers[selectedChannel].va}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(vaNumbers[selectedChannel].va.replace(/\s/g, ""), "Nomor VA")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] bg-white hover:bg-slate-50 text-[#3D77EE] text-xs font-bold border border-blue-200 shadow-2xs transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Nomor VA</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= METHOD 3: E-WALLET DIRECT ================= */}
      <div className="bg-white rounded-[18px] border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[#687280]">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">E-Wallet Instan (Deep Link)</h3>
              <p className="text-xs text-[#687280]">
                Langsung dialihkan ke aplikasi smartphone Anda dalam 1 klik.
              </p>
            </div>
          </div>
          <span className="bg-blue-50 text-[#3D77EE] text-[11px] px-2.5 py-1 rounded-full font-bold">
            1-Click
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* GoPay */}
          <label
            onClick={() => setSelectedChannel("gopay")}
            className={`flex items-center justify-between p-4 rounded-[12px] border cursor-pointer transition-all ${
              selectedChannel === "gopay"
                ? "bg-blue-50/50 border-[#3D77EE] ring-1 ring-[#3D77EE]"
                : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment_channel"
                checked={selectedChannel === "gopay"}
                onChange={() => setSelectedChannel("gopay")}
                className="w-4 h-4 text-[#3D77EE] accent-[#3D77EE]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#111827]">GoPay</span>
                <span className="text-[11px] text-[#687280]">Buka aplikasi Gojek</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Instan
            </span>
          </label>

          {/* ShopeePay */}
          <label
            onClick={() => setSelectedChannel("shopeepay")}
            className={`flex items-center justify-between p-4 rounded-[12px] border cursor-pointer transition-all ${
              selectedChannel === "shopeepay"
                ? "bg-blue-50/50 border-[#3D77EE] ring-1 ring-[#3D77EE]"
                : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment_channel"
                checked={selectedChannel === "shopeepay"}
                onChange={() => setSelectedChannel("shopeepay")}
                className="w-4 h-4 text-[#3D77EE] accent-[#3D77EE]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#111827]">ShopeePay</span>
                <span className="text-[11px] text-[#687280]">Buka aplikasi Shopee</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
              Instan
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
