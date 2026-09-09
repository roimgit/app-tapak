"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Check,
  QrCode,
  Landmark,
  Wallet,
  Copy,
  Download,
  RefreshCw,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface PaymentChannelsProps {
  amount: number;
  orderId?: string;
  qrContent?: string;
  vaNumber?: string;
  selectedChannel?: string;
  onSelectChannel?: (channel: string) => void;
  onCheckStatus?: () => void;
  onSimulateSuccess?: () => void;
  isLoading?: boolean;
}

export default function PaymentChannels({
  amount,
  orderId = "INV-2026-04819",
  qrContent,
  vaNumber,
  selectedChannel = "qris",
  onSelectChannel,
  onCheckStatus,
  onSimulateSuccess,
  isLoading = false,
}: PaymentChannelsProps) {
  const [internalChannel, setInternalChannel] = useState<string>(selectedChannel);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const activeChannel = onSelectChannel ? selectedChannel : internalChannel;
  const handleSelect = (ch: string) => {
    if (onSelectChannel) {
      onSelectChannel(ch);
    } else {
      setInternalChannel(ch);
    }
  };

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

  // Nomor VA dinamis per bank
  const getBankVa = (bankKey: string, code: string) => {
    if (vaNumber && activeChannel === bankKey) return vaNumber;
    const prefixMap: Record<string, string> = {
      bca_va: "8277",
      mandiri_va: "8960",
      bri_va: "1028",
      bni_va: "9880",
    };
    const prefix = prefixMap[bankKey] || "8277";
    const suffix = orderId.replace(/\D/g, "").slice(-4) || "4819";
    return `${prefix} 0812 3456 ${suffix}`;
  };

  const vaNumbers: Record<string, { bank: string; va: string; code: string }> = {
    bca_va: { bank: "Bank BCA", va: getBankVa("bca_va", "014"), code: "014" },
    mandiri_va: { bank: "Bank Mandiri", va: getBankVa("mandiri_va", "008"), code: "008" },
    bri_va: { bank: "Bank BRI", va: getBankVa("bri_va", "002"), code: "002" },
    bni_va: { bank: "Bank BNI", va: getBankVa("bni_va", "009"), code: "009" },
  };

  const [qrMode, setQrMode] = useState<"emv" | "scanner_hp">("scanner_hp");

  // URL Simulator yang bisa dibuka langsung oleh kamera smartphone di jaringan yang sama
  const simulationUrl = `/sandbox/bayar?orderId=${encodeURIComponent(orderId)}`;
  const phoneScanQrUrl = `http://192.168.234.63:3000/sandbox/bayar?orderId=${encodeURIComponent(orderId)}`;

  // Default fallback payload QRIS jika belum dimuat dari gateway
  const emvQrPayload =
    qrContent ||
    `00020101021226670016ID.CO.NICEPAY.WWW0118936009180000${orderId.replace(/\D/g, "").slice(-4)}51440014ID.LINKAJA.WWW0215081234567890123520458125303360540${amount.toFixed(0).length}${amount.toFixed(0)}5802ID5925PT TAPAK TEKNOLOGI PROPERTI6013JAKARTA SELATAN62300126${orderId}6304ABCD`;

  const effectiveQr = qrMode === "scanner_hp" ? phoneScanQrUrl : emvQrPayload;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Kanal */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          Pilih Metode Pembayaran
        </h1>
        <p className="text-sm text-[#687280] mt-1 leading-relaxed">
          Pilih kanal transaksi resmi SNAP BI NICEPAY untuk mengaktifkan kuota listing properti Anda secara instan dan otomatis.
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
          activeChannel === "qris"
            ? "border-[#3D77EE] shadow-md ring-2 ring-blue-100"
            : "border-slate-200/80 shadow-xs hover:border-slate-300"
        }`}
      >
        {/* Accordion Header */}
        <div
          onClick={() => handleSelect("qris")}
          className="p-5 sm:p-6 cursor-pointer flex items-start justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                activeChannel === "qris"
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
                  SNAP BI Terverifikasi Otomatis
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
        {activeChannel === "qris" && (
          <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
            <div className="bg-white rounded-[14px] p-5 sm:p-6 border border-slate-200/80 flex flex-col md:flex-row items-center gap-6">
              {/* QR Code Container menggunakan qrcode.react */}
              <div className="bg-white p-4 rounded-[14px] shadow-sm border border-slate-200 flex flex-col items-center shrink-0">
                {/* Toggle Mode QR */}
                <div className="flex items-center justify-between w-full pb-2 mb-2 border-b border-slate-100 text-[10px]">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setQrMode("scanner_hp")}
                      className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                        qrMode === "scanner_hp"
                          ? "bg-[#3D77EE] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Scan Kamera HP
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrMode("emv")}
                      className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                        qrMode === "emv"
                          ? "bg-[#3D77EE] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Baku EMV
                    </button>
                  </div>
                  <span className="font-mono font-bold text-[#3D77EE] bg-blue-50 px-1.5 py-0.5 rounded">
                    NMID: ID1024398124
                  </span>
                </div>

                {/* Dynamic QRIS Rendering with qrcode.react */}
                <div className="relative w-44 h-44 bg-white p-2 rounded flex items-center justify-center shadow-2xs">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#3D77EE]" />
                      <span>Memuat QRIS...</span>
                    </div>
                  ) : (
                    <>
                      <QRCodeSVG
                        value={effectiveQr}
                        size={168}
                        level="M"
                        includeMargin={false}
                        className="w-full h-full"
                      />
                      {/* Brand Logo Center Insignia */}
                      <div className="absolute inset-0 m-auto w-8 h-8 rounded-md bg-[#3D77EE] flex items-center justify-center shadow-md border-2 border-white pointer-events-none">
                        <span className="text-white font-black text-[10px]">TPK</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-2 text-[#687280] text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3D77EE]" />
                  <span>
                    {qrMode === "scanner_hp"
                      ? "Bisa discan pakai kamera HP"
                      : "GPN & SNAP BI Verified"}
                  </span>
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
                      className="p-1.5 bg-slate-100 hover:bg-blue-50 text-[#687280] hover:text-[#3D77EE] rounded-[8px] transition-colors cursor-pointer"
                      title="Salin Nominal"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sandbox Guide Notice */}
                  <div className="mt-2.5 p-3 rounded-[10px] bg-blue-50/70 border border-blue-100 text-xs text-[#111827] space-y-1">
                    <div className="font-bold text-[#3D77EE] flex items-center gap-1">
                      <span>💡 Cara Uji Coba Scan &amp; Verifikasi:</span>
                    </div>
                    <p className="text-[11px] text-[#687280] leading-relaxed">
                      1. Arahkan <strong>kamera smartphone</strong> Anda ke QR Code untuk membuka Simulator Pembayaran m-Banking di ponsel, atau
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <a
                        href={simulationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-200 text-[#3D77EE] font-bold text-[11px] rounded-[6px] hover:bg-blue-50 transition-colors"
                      >
                        <span>Buka Simulator di Tab Baru &rarr;</span>
                      </a>
                    </div>
                  </div>

                  <div className="mt-3 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Penerima Resmi (Merchant):
                    </span>
                    <div className="font-bold text-[#111827] mt-0.5">
                      PT TAPAK TEKNOLOGI PROPERTI INDONESIA
                    </div>
                  </div>
                </div>

                {/* Tombol QR Actions */}
                <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => alert("Kode QRIS resmi tersimpan di perangkat Anda.")}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#111827] text-xs font-bold rounded-[10px] transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={onCheckStatus}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3D77EE] hover:bg-[#2B55AB] text-white text-xs font-bold rounded-[10px] shadow-sm transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Cek Status Pembayaran</span>
                  </button>
                  {onSimulateSuccess && (
                    <button
                      type="button"
                      onClick={onSimulateSuccess}
                      className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[10px] transition-colors cursor-pointer shadow-xs"
                      title="Simulasi pelunasan instan untuk pengujian sandbox"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>⚡ Simulasi Bayar Lunas</span>
                    </button>
                  )}
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
            const isSelected = activeChannel === id;
            return (
              <label
                key={id}
                onClick={() => handleSelect(id)}
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
                    onChange={() => handleSelect(id)}
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
        {activeChannel.endsWith("_va") && vaNumbers[activeChannel] && (
          <div className="mt-2 p-4 rounded-[12px] bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
            <div>
              <span className="text-[11px] text-[#687280] font-medium block">
                Nomor Virtual Account {vaNumbers[activeChannel].bank} (SNAP BI):
              </span>
              <span className="font-mono text-lg font-black text-[#111827] tracking-wider">
                {vaNumbers[activeChannel].va}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(vaNumbers[activeChannel].va.replace(/\s/g, ""), "Nomor VA")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-white hover:bg-slate-50 text-[#3D77EE] text-xs font-bold border border-blue-200 shadow-2xs transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Nomor VA</span>
              </button>
              {onSimulateSuccess && (
                <button
                  type="button"
                  onClick={onSimulateSuccess}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[8px] text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  title="Simulasi transfer lunas via VA"
                >
                  Bayar VA
                </button>
              )}
            </div>
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
            onClick={() => handleSelect("gopay")}
            className={`flex items-center justify-between p-4 rounded-[12px] border cursor-pointer transition-all ${
              activeChannel === "gopay"
                ? "bg-blue-50/50 border-[#3D77EE] ring-1 ring-[#3D77EE]"
                : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment_channel"
                checked={activeChannel === "gopay"}
                onChange={() => handleSelect("gopay")}
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
            onClick={() => handleSelect("shopeepay")}
            className={`flex items-center justify-between p-4 rounded-[12px] border cursor-pointer transition-all ${
              activeChannel === "shopeepay"
                ? "bg-blue-50/50 border-[#3D77EE] ring-1 ring-[#3D77EE]"
                : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment_channel"
                checked={activeChannel === "shopeepay"}
                onChange={() => handleSelect("shopeepay")}
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
