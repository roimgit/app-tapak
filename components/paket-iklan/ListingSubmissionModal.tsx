"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export interface PackageData {
  id: string;
  name: string;
  price: string;
  period: string;
  quota: string;
  features: string[];
}

interface ListingSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: PackageData;
}

export default function ListingSubmissionModal({
  isOpen,
  onClose,
  selectedPackage,
}: ListingSubmissionModalProps) {
  const [formData, setFormData] = useState({
    ownerName: "",
    phone: "",
    propertyTitle: "",
    propertyType: "Apartemen",
    city: "Jakarta Selatan",
    priceEstimate: "",
    paymentMethod: "QRIS",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const message = `Halo Admin Tapak, saya ingin pasang listing baru:\n\n*Detail Paket:*\n- Paket: ${selectedPackage.name} (${selectedPackage.price} ${selectedPackage.period})\n- Kuota: ${selectedPackage.quota}\n\n*Data Properti:*\n- Pemilik: ${formData.ownerName}\n- No. WhatsApp: ${formData.phone}\n- Judul: ${formData.propertyTitle}\n- Kategori: ${formData.propertyType}\n- Kota: ${formData.city}\n- Estimasi Harga: ${formData.priceEstimate}\n- Pembayaran: ${formData.paymentMethod}\n\nMohon petunjuk invoice dan verifikasi lapak. Terima kasih!`;
    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Formulir"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#3D77EE] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pasang Listing Baru</span>
              </span>
              <h3 className="text-xl font-bold text-[#111827] mt-2">
                Konfirmasi Paket & Data Properti
              </h3>
              <p className="text-xs text-[#687280] mt-1">
                Lengkapi formulir singkat ini. Iklan Anda akan diverifikasi dalam hitungan jam.
              </p>
            </div>

            {/* Ringkasan Paket Terpilih */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-[14px] p-4 mb-6 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D77EE]">
                  Paket Terpilih
                </span>
                <h4 className="text-base font-bold text-[#111827]">{selectedPackage.name}</h4>
                <p className="text-xs text-[#687280]">{selectedPackage.quota} Aktif</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-[#3D77EE]">
                  {selectedPackage.price}
                </span>
                <p className="text-[11px] text-[#687280]">{selectedPackage.period}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Nama Lengkap Pemilik / Agen *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[10px] border border-slate-200 text-sm focus:outline-hidden focus:border-[#3D77EE] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[10px] border border-slate-200 text-sm focus:outline-hidden focus:border-[#3D77EE] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Judul Properti yang Diiklankan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rumah Minimalis 2 Lantai Dekat MRT Fatmawati"
                  value={formData.propertyTitle}
                  onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-slate-200 text-sm focus:outline-hidden focus:border-[#3D77EE] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-[10px] border border-slate-200 text-sm focus:outline-hidden focus:border-[#3D77EE]"
                  >
                    <option value="Apartemen">Apartemen</option>
                    <option value="Rumah">Rumah</option>
                    <option value="Kost">Kost</option>
                    <option value="Vila">Vila</option>
                    <option value="Ruko">Ruko</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Kota / Wilayah *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jakarta Selatan"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-[10px] border border-slate-200 text-sm focus:outline-hidden focus:border-[#3D77EE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Perkiraan Harga
                  </label>
                  <input
                    type="text"
                    placeholder="Rp 12.000.000 / bln"
                    value={formData.priceEstimate}
                    onChange={(e) => setFormData({ ...formData, priceEstimate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-[10px] border border-slate-200 text-sm focus:outline-hidden focus:border-[#3D77EE]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Metode Pembayaran Pilihan
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["QRIS", "BCA", "Mandiri", "GoPay"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method })}
                      className={`py-2 px-2 text-xs font-bold rounded-[10px] border transition-all text-center ${
                        formData.paymentMethod === method
                          ? "bg-blue-50 border-[#3D77EE] text-[#3D77EE] shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-[10px] bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Kirim Data & Dapatkan Invoice WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Setelah kirim, WhatsApp Tapak Support akan otomatis terbuka untuk konfirmasi.
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">
              Permintaan Listing Diterima!
            </h3>
            <p className="text-sm text-[#687280] max-w-sm mx-auto mt-2 leading-relaxed">
              Tim Tapak sedang menyiapkan invoice resmi dan tautan upload foto untuk properti <strong>{formData.propertyTitle}</strong>.
            </p>

            <div className="mt-6 p-4 rounded-[14px] bg-slate-50 border border-slate-200 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Nomor Referensi:</span>
                <span className="font-mono font-bold text-[#111827]">TPK-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Paket Terpilih:</span>
                <span className="font-semibold text-[#111827]">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-600 font-bold">Total Tagihan:</span>
                <span className="font-black text-[#3D77EE]">{selectedPackage.price}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href={`/pembayaran?plan=${selectedPackage.id}`}
                onClick={onClose}
                className="w-full py-3 rounded-[10px] bg-[#3D77EE] hover:bg-[#2B55AB] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
              >
                <span>Bayar Online Sekarang (QRIS / VA)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-[10px] bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Tutup &amp; Tunggu Kontak Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
