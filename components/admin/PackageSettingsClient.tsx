"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tag,
  CheckCircle2,
  AlertCircle,
  Save,
  Megaphone,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { PackageDefinition } from "@/lib/package-settings";

export default function PackageSettingsClient() {
  const [packages, setPackages] = useState<PackageDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4500);
  };

  useEffect(() => {
    let isMounted = true;
    fetch("/api/packages")
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        if (json.success && Array.isArray(json.data)) {
          setPackages(json.data);
        }
      })
      .catch(() => {
        if (isMounted) showToast("error", "Gagal memuat paket iklan.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePackageChange = <K extends keyof PackageDefinition>(
    index: number,
    field: K,
    val: PackageDefinition[K]
  ) => {
    const updated = [...packages];
    updated[index] = { ...updated[index], [field]: val };
    setPackages(updated);
  };

  const handleFeatureChange = (pkgIndex: number, featIndex: number, text: string) => {
    const updated = [...packages];
    updated[pkgIndex].features[featIndex] = text;
    setPackages(updated);
  };

  const handleAddFeature = (pkgIndex: number) => {
    const updated = [...packages];
    updated[pkgIndex].features.push("Keuntungan paket baru...");
    setPackages(updated);
  };

  const handleRemoveFeature = (pkgIndex: number, featIndex: number) => {
    const updated = [...packages];
    updated[pkgIndex].features = updated[pkgIndex].features.filter((_, i) => i !== featIndex);
    setPackages(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packages }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Pengaturan harga dan benefit paket langganan berhasil disimpan!");
      } else {
        showToast("error", data.error || "Gagal menyimpan paket.");
      }
    } catch {
      showToast("error", "Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-[8px] bg-amber-50 text-amber-600">
              <Tag className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Pengaturan Tarif Paket Langganan Mitra
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#687280] mt-1">
            Atur harga sewa kuota listing, paket hemat, dan integrasikan benefit bonus slot iklan beranda untuk paket tertinggi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/iklan"
            className="px-3.5 py-2 rounded-[10px] text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <Megaphone className="w-3.5 h-3.5 text-[#3D77EE]" />
            <span>Kelola Slot Iklan</span>
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-[10px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Menyimpan..." : "Simpan Paket"}</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-4 rounded-[12px] border text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in ${
            toastMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-[18px] border border-[#E2E8F0]">
          Memuat konfigurasi paket...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className={`rounded-[18px] border p-6 bg-white shadow-2xs space-y-5 flex flex-col justify-between ${
                pkg.recommended
                  ? "border-[#3D77EE] ring-1 ring-[#3D77EE]/30"
                  : "border-[#E2E8F0]"
              }`}
            >
              <div className="space-y-4">
                {/* Header Paket */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-base text-[#111827]">{pkg.name}</span>
                  {pkg.recommended && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3D77EE] text-white">
                      Paling Populer
                    </span>
                  )}
                </div>

                {/* Input Harga Standar */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Harga Standar (Rp) &amp; Periode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step={10000}
                        value={pkg.standardPrice}
                        onChange={(e) => handlePackageChange(idx, "standardPrice", Number(e.target.value))}
                        className="px-3 py-1.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#111827]"
                      />
                      <input
                        type="text"
                        value={pkg.standardPeriod}
                        onChange={(e) => handlePackageChange(idx, "standardPeriod", e.target.value)}
                        placeholder="/ 30 Hari"
                        className="px-3 py-1.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-xs font-semibold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Input Harga Hemat */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Harga Paket Hemat (Rp) &amp; Periode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step={10000}
                        value={pkg.discountPrice}
                        onChange={(e) => handlePackageChange(idx, "discountPrice", Number(e.target.value))}
                        className="px-3 py-1.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-emerald-700"
                      />
                      <input
                        type="text"
                        value={pkg.discountPeriod}
                        onChange={(e) => handlePackageChange(idx, "discountPeriod", e.target.value)}
                        placeholder="/ 90 Hari"
                        className="px-3 py-1.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-xs font-semibold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Kuota Listing */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Kuota Listing Aktif
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={pkg.quotaListing}
                      onChange={(e) => handlePackageChange(idx, "quotaListing", Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-xs font-extrabold text-[#3D77EE]"
                    />
                  </div>
                </div>

                {/* Sakelar Include Slot Iklan Beranda */}
                <div className="p-3 rounded-[12px] bg-blue-50/60 border border-blue-100 space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#111827] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(pkg.includeAdSlot)}
                      onChange={(e) => handlePackageChange(idx, "includeAdSlot", e.target.checked)}
                      className="w-4 h-4 accent-[#3D77EE] rounded"
                    />
                    <span>Include Slot Iklan Beranda Gratis</span>
                  </label>
                  {pkg.includeAdSlot && (
                    <span className="text-[11px] text-[#3D77EE] font-semibold block leading-tight">
                      Owner yang berlangganan paket ini otomatis berhak mengklaim 1x slot Billboard Beranda tanpa biaya tambahan.
                    </span>
                  )}
                </div>

                {/* Daftar Fitur / Poin Keuntungan */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700">Poin Keuntungan:</label>
                    <button
                      type="button"
                      onClick={() => handleAddFeature(idx)}
                      className="text-[10.5px] font-bold text-[#3D77EE] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Poin</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {pkg.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleFeatureChange(idx, fIdx, e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-700 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx, fIdx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer status */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Status Paket:</span>
                <span className="font-bold text-emerald-600">Aktif Dijual ke Owner</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
