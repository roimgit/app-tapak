"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Building2,
  ArrowRight,
  Wallet,
  Smartphone,
  Lock,
  RefreshCw,
} from "lucide-react";

interface SandboxPayPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default function SandboxPayPage({ searchParams }: SandboxPayPageProps) {
  const resolvedParams = use(searchParams);
  const orderId = resolvedParams.orderId || "INV-2026-04819";

  const [paymentData, setPaymentData] = useState<{
    amount: number;
    paymentMethod: string;
    status: string;
  } | null>(null);

  const [selectedBank, setSelectedBank] = useState<string>("BCA");
  const [pin, setPin] = useState<string>("123456");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/payment/status?orderId=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPaymentData({
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            status: data.status,
          });
          if (data.status === "SETTLED") {
            setIsSuccess(true);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [orderId]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch("/api/payment/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (res.ok) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Payment failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const amount = paymentData?.amount || 220890;
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="min-h-screen bg-[#F3F6FB] flex flex-col items-center justify-center p-4">
      {/* Container Simulator Smartphone */}
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-2xl border border-slate-200/80 overflow-hidden">
        {/* Top Header Simulator */}
        <div className="bg-gradient-to-r from-[#2B55AB] to-[#3D77EE] p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Simulator Mobile Banking
              </span>
            </div>
            <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full font-bold">
              SNAP BI Sandbox
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs text-blue-100 block">Total Tagihan Pembayaran:</span>
            <div className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
              {formattedAmount}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!isSuccess ? (
            <form onSubmit={handlePay} className="space-y-5">
              {/* Info Merchant */}
              <div className="p-4 rounded-[14px] bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#687280]">Penerima (Merchant):</span>
                  <span className="font-bold text-[#111827] text-right">
                    PT TAPAK TEKNOLOGI PROPERTI
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#687280]">Nomor Referensi:</span>
                  <span className="font-mono font-bold text-[#3D77EE]">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#687280]">Gateway:</span>
                  <span className="font-semibold text-[#111827]">NICEPAY SNAP BI</span>
                </div>
              </div>

              {/* Pilihan Sumber Rekening Pengirim */}
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-2">
                  Pilih Sumber Rekening / Dompet:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "BCA", name: "BCA Mobile", saldo: "Rp 15.420.000" },
                    { id: "Mandiri", name: "Livin' Mandiri", saldo: "Rp 8.900.000" },
                    { id: "GoPay", name: "GoPay Saldo", saldo: "Rp 1.250.000" },
                    { id: "ShopeePay", name: "ShopeePay", saldo: "Rp 950.000" },
                  ].map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBank(bank.id)}
                      className={`p-3 rounded-[12px] border text-left transition-all ${
                        selectedBank === bank.id
                          ? "bg-blue-50/60 border-[#3D77EE] ring-1 ring-[#3D77EE]"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-[#3D77EE]" />
                        <span className="text-xs font-bold text-[#111827]">{bank.name}</span>
                      </div>
                      <span className="text-[10px] text-[#687280] block mt-0.5">
                        {bank.saldo}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input PIN Otorisasi */}
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  PIN Transaksi (Simulasi Otomatis):
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-[10px] border border-slate-200 text-sm font-mono tracking-widest text-center focus:outline-hidden focus:border-[#3D77EE]"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <span className="text-[10px] text-[#687280] mt-1 block text-center">
                  Gunakan PIN sembarang untuk pengujian sandbox.
                </span>
              </div>

              {/* Tombol Aksi Bayar */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-[10px] bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Transaksi...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Konfirmasi &amp; Bayar Sekarang</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Tampilan Sukses Pembayaran */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Pembayaran Berhasil!
                </span>
                <h3 className="text-xl font-bold text-[#111827] mt-2">
                  Transaksi Berhasil Dilunasi
                </h3>
                <p className="text-xs text-[#687280] mt-1">
                  Tagihan <strong>{orderId}</strong> sebesar <strong>{formattedAmount}</strong> telah berhasil diproses oleh gateway SNAP BI.
                </p>
              </div>

              <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200/80 text-xs text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-600">SETTLED (Lunas)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu:</span>
                  <span className="font-semibold text-slate-800">{new Date().toLocaleTimeString("id-ID")} WIB</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <p className="text-[11px] text-slate-500">
                  Periksa layar utama komputer Anda, status pembayaran akan otomatis terupdate ke <strong>Dashboard Owner</strong>.
                </p>

                <Link
                  href="/owner/dashboard?payment=success"
                  className="w-full py-3 rounded-[10px] bg-[#3D77EE] hover:bg-[#2B55AB] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Buka Dashboard Owner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
