"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Type,
  ImageIcon,
  Globe,
} from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import ImageUploadDropzone from "@/components/ui/ImageUploadDropzone";

export default function BrandingSettingsClient() {
  const { settings, updateSettings, resetSettings, isLoading } = useSiteSettings();

  const [logoType, setLogoType] = useState<"text" | "image">(settings.branding.logoType);
  const [logoText, setLogoText] = useState(settings.branding.logoText);
  const [logoDotColor, setLogoDotColor] = useState(settings.branding.logoDotColor);
  const [logoImageUrl, setLogoImageUrl] = useState(settings.branding.logoImageUrl);
  const [tagline, setTagline] = useState(settings.branding.tagline);
  const [badgeText, setBadgeText] = useState(settings.branding.badgeText);
  const [faviconUrl, setFaviconUrl] = useState(settings.branding.faviconUrl);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setLogoType(settings.branding.logoType);
        setLogoText(settings.branding.logoText);
        setLogoDotColor(settings.branding.logoDotColor);
        setLogoImageUrl(settings.branding.logoImageUrl);
        setTagline(settings.branding.tagline);
        setBadgeText(settings.branding.badgeText);
        setFaviconUrl(settings.branding.faviconUrl);
      }, 0);
    }
  }, [settings, isLoading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const ok = await updateSettings({
      branding: {
        logoType,
        logoText,
        logoDotColor,
        logoImageUrl,
        tagline,
        badgeText,
        faviconUrl,
      },
    });

    setSaving(false);
    if (ok) {
      setSuccessMessage("Pengaturan logo dan branding berhasil disimpan & diterapkan ke seluruh situs!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      setErrorMessage("Gagal menyimpan pengaturan. Silakan coba lagi.");
    }
  };

  const handleReset = async () => {
    if (!confirm("Apakah Anda yakin ingin mengembalikan logo dan branding ke pengaturan standar Tapak.?")) {
      return;
    }
    setSaving(true);
    const ok = await resetSettings();
    setSaving(false);
    if (ok) {
      setSuccessMessage("Pengaturan telah dikembalikan ke standar Tapak.");
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-[8px] bg-blue-50 text-[#3D77EE]">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Pengaturan Logo &amp; Identitas Brand
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#687280] mt-1">
            Konfigurasi logo utama website, warna aksen titik, badge navigasi, dan identitas brand Tapak.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="px-3.5 py-2 rounded-[10px] text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>
        </div>
      </div>

      {/* Alert Notifications */}
      {successMessage && (
        <div className="p-4 rounded-[12px] bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs sm:text-sm font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-[12px] bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs sm:text-sm font-semibold text-rose-800 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Preview Navbar Card */}
      <div className="bg-white rounded-[18px] p-5 sm:p-6 border border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#3D77EE]" />
            <h3 className="font-bold text-sm text-[#111827]">
              Pratinjau Interaktif Navbar (Live Preview)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Tampilan seketika di website publik
          </span>
        </div>

        {/* Mockup Navbar Box */}
        <div className="p-4 sm:p-5 rounded-[12px] bg-slate-50 border border-slate-200">
          <div className="h-16 px-4 sm:px-6 rounded-[10px] bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            {/* Logo Preview */}
            <div className="flex items-center gap-3">
              {logoType === "image" && logoImageUrl ? (
                <div className="relative h-9 w-36">
                  <Image
                    src={logoImageUrl}
                    alt={logoText}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <span className="font-bold text-2xl tracking-tight text-[#111827]">
                  {logoText}
                  <span style={{ color: logoDotColor }}>.</span>
                </span>
              )}

              {badgeText && (
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10.5px] font-semibold tracking-wider uppercase text-[#3D77EE] bg-blue-50 border border-blue-100 rounded-md">
                  {badgeText}
                </span>
              )}
            </div>

            {/* Dummy Nav Links */}
            <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
              <span className="text-[#3D77EE] border-b-2 border-[#3D77EE] pb-0.5">Beranda</span>
              <span>Explore Peta</span>
              <span>Artikel</span>
              <span>Paket Iklan</span>
            </div>

            {/* Dummy CTA */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-[8px] bg-[#3D77EE] text-white text-xs font-bold shadow-xs">
                Pasang Iklan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-[18px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-6">
          <h3 className="font-bold text-base text-[#111827] pb-3 border-b border-[#E2E8F0]">
            Format &amp; Tampilan Logo
          </h3>

          {/* Opsi Tipe Logo */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-2">
              Tipe Logo Website
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              <button
                type="button"
                onClick={() => setLogoType("text")}
                className={`p-3.5 rounded-[12px] border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  logoType === "text"
                    ? "border-[#3D77EE] bg-blue-50/40 ring-1 ring-[#3D77EE]/20"
                    : "border-[#E2E8F0] hover:border-slate-300 bg-white"
                }`}
              >
                <div className={`p-2 rounded-[8px] ${logoType === "text" ? "bg-[#3D77EE] text-white" : "bg-slate-100 text-slate-600"}`}>
                  <Type className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-[#111827] block">
                    Teks Wordmark (Rekomendasi)
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Sesuai identitas brand: Arial/Helvetica Bold + aksen titik
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLogoType("image")}
                className={`p-3.5 rounded-[12px] border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  logoType === "image"
                    ? "border-[#3D77EE] bg-blue-50/40 ring-1 ring-[#3D77EE]/20"
                    : "border-[#E2E8F0] hover:border-slate-300 bg-white"
                }`}
              >
                <div className={`p-2 rounded-[8px] ${logoType === "image" ? "bg-[#3D77EE] text-white" : "bg-slate-100 text-slate-600"}`}>
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-[#111827] block">
                    Gambar Logo (PNG/SVG)
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Gunakan file logo grafis atau lambang khusus
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Pengaturan Teks Wordmark */}
          {logoType === "text" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1.5">
                  Teks Nama Brand
                </label>
                <input
                  type="text"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  placeholder="Tapak"
                  required
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-sm font-bold text-[#111827] focus:outline-none focus:border-[#3D77EE] focus:bg-white"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Tanda titik di akhir (.) otomatis disertakan sesuai sistem direktif brand Tapak.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1.5">
                  Warna Titik Aksen (Accent Dot)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={logoDotColor}
                    onChange={(e) => setLogoDotColor(e.target.value)}
                    className="w-11 h-11 rounded-[8px] border border-[#E2E8F0] cursor-pointer p-1 bg-white"
                  />
                  <input
                    type="text"
                    value={logoDotColor}
                    onChange={(e) => setLogoDotColor(e.target.value)}
                    className="w-32 px-3 py-2.5 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-xs font-mono font-bold text-[#111827] focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5">
                    {["#3D77EE", "#10B981", "#6366F1", "#1E3A8A", "#111827"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setLogoDotColor(color)}
                        style={{ backgroundColor: color }}
                        className="w-6 h-6 rounded-full border border-white/50 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pengaturan Gambar Logo */}
          {logoType === "image" && (
            <div className="pt-2 space-y-3">
              <ImageUploadDropzone
                folder="branding"
                initialUrl={logoImageUrl}
                label="Unggah File Logo Resmi (Supabase Storage)"
                aspectRatioLabel="PNG Transparan / SVG • Maks 5MB"
                helpText="File diunggah langsung ke Supabase Storage tanpa membebani server atau database Tapak."
                onUploadSuccess={(url) => setLogoImageUrl(url)}
              />

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1.5">
                  Path File / URL Logo (Otomatis Terisi dari Unggahan)
                </label>
                <input
                  type="text"
                  value={logoImageUrl}
                  onChange={(e) => setLogoImageUrl(e.target.value)}
                  placeholder="/uploads/branding/logo.webp atau https://..."
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-xs sm:text-sm font-mono text-[#111827] focus:outline-none focus:border-[#3D77EE] focus:bg-white"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Kolom ini otomatis terisi saat Anda mengunggah file dari folder di atas. Bisa juga diisi URL gambar eksternal.
                </span>
              </div>
            </div>
          )}

          {/* Badge Navbar & Tagline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E2E8F0]">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5">
                Teks Badge Samping Logo (Navbar)
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="Verified Homes"
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-sm text-[#111827] focus:outline-none focus:border-[#3D77EE] focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Badge kecil di sebelah kanan logo (misal: &quot;Verified Homes&quot;, &quot;Hunian Resmi&quot;).
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5">
                Tagline Utama Platform
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Platform Properti Terverifikasi & Transparan"
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-sm text-[#111827] focus:outline-none focus:border-[#3D77EE] focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Ditampilkan pada meta deskripsi dan footer situs.
              </span>
            </div>
          </div>
        </div>

        {/* Card: Logo & Ikon Tab Halaman Peramban (Favicon) */}
        <div className="bg-white rounded-[18px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold text-base text-[#111827] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#3D77EE]" />
                <span>Logo &amp; Ikon Tab Halaman (Favicon Browser Tab)</span>
              </h3>
              <p className="text-xs text-[#687280] mt-0.5">
                Ikon lambang situs yang tampil di tab peramban (Chrome, Edge, Safari, Firefox) dan penanda bookmark pengguna.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 w-fit">
              Mendukung format .ico, .png, .svg
            </span>
          </div>

          {/* Interactive Browser Tab Mockup */}
          <div className="p-4 sm:p-5 rounded-[12px] bg-slate-100 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Pratinjau Tab Peramban (Live Tab Preview)
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-t-[10px] border-t-2 border-t-[#3D77EE] border-x border-slate-200 shadow-xs max-w-sm w-full">
                <div className="w-4 h-4 rounded-xs flex items-center justify-center shrink-0 overflow-hidden bg-blue-50 border border-blue-100">
                  {faviconUrl && (faviconUrl.startsWith("http") || faviconUrl.startsWith("/") || faviconUrl.startsWith("data:")) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-[#3D77EE] text-white text-[9px] font-black flex items-center justify-center">
                      T
                    </div>
                  )}
                </div>
                <span className="text-xs font-semibold text-[#111827] truncate">
                  {logoText}. — {tagline}
                </span>
                <span className="text-slate-400 hover:text-slate-600 ml-auto text-xs shrink-0 cursor-default">
                  ×
                </span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-2">
              Pilihan Cepat Ikon Standar Tapak.
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFaviconUrl("/favicon.ico")}
                className={`p-3 rounded-[10px] border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  faviconUrl === "/favicon.ico"
                    ? "border-[#3D77EE] bg-blue-50/50 ring-1 ring-[#3D77EE]/20"
                    : "border-[#E2E8F0] hover:border-slate-300 bg-white"
                }`}
              >
                <div className="w-7 h-7 rounded-[6px] bg-[#3D77EE] text-white flex items-center justify-center font-black text-xs">
                  T
                </div>
                <div>
                  <span className="text-xs font-bold text-[#111827] block">Ikon Huruf &quot;T&quot; Biru</span>
                  <span className="text-[10.5px] text-slate-500 block">Standar Tapak. (#3D77EE)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFaviconUrl("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%233D77EE'/><circle cx='16' cy='16' r='6' fill='%23FFFFFF'/></svg>")}
                className={`p-3 rounded-[10px] border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  faviconUrl.includes("<circle")
                    ? "border-[#3D77EE] bg-blue-50/50 ring-1 ring-[#3D77EE]/20"
                    : "border-[#E2E8F0] hover:border-slate-300 bg-white"
                }`}
              >
                <div className="w-7 h-7 rounded-[6px] bg-[#3D77EE] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#111827] block">Titik Aksen Bulat</span>
                  <span className="text-[10.5px] text-slate-500 block">Modern Minimalis SVG</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFaviconUrl("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233D77EE' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg>")}
                className={`p-3 rounded-[10px] border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  faviconUrl.includes("<path")
                    ? "border-[#3D77EE] bg-blue-50/50 ring-1 ring-[#3D77EE]/20"
                    : "border-[#E2E8F0] hover:border-slate-300 bg-white"
                }`}
              >
                <div className="w-7 h-7 rounded-[6px] bg-blue-50 text-[#3D77EE] flex items-center justify-center font-bold text-sm">
                  🏠
                </div>
                <div>
                  <span className="text-xs font-bold text-[#111827] block">Ikon Rumah Hunian</span>
                  <span className="text-[10.5px] text-slate-500 block">Simbol Properti Terverifikasi</span>
                </div>
              </button>
            </div>
          </div>

          {/* Favicon Upload to Supabase Storage */}
          <div className="pt-2">
            <ImageUploadDropzone
              folder="branding"
              initialUrl={faviconUrl.startsWith("http") ? faviconUrl : ""}
              label="Unggah File Favicon Kustom (Supabase Storage)"
              aspectRatioLabel="Rasio 1:1 • .PNG, .ICO, .SVG • Maks 5MB"
              helpText="Unggah lambang tab peramban persegi. File diunggah ke Supabase Storage."
              onUploadSuccess={(url) => setFaviconUrl(url)}
            />
          </div>

          {/* Favicon URL Input */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1.5">
              Atau Input Manual URL / Preset Favicon
            </label>
            <input
              type="text"
              value={faviconUrl}
              onChange={(e) => setFaviconUrl(e.target.value)}
              placeholder="/favicon.ico atau https://example.com/icon.png"
              className="w-full px-3.5 py-2.5 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-xs sm:text-sm font-mono text-[#111827] focus:outline-none focus:border-[#3D77EE] focus:bg-white"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Mendukung URL file gambar (.ico, .png, .svg) atau SVG Data URI. Ikon tab browser akan otomatis berubah secara langsung saat disimpan.
            </span>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-[10px] text-xs sm:text-sm font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan..." : "Simpan Pengaturan Logo"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
