"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Sparkles,
  Search,
  Plus,
  Trash2,
} from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { BillboardItem } from "@/lib/site-settings";

export default function HomeContentSettingsClient() {
  const { settings, updateSettings, resetSettings, isLoading } = useSiteSettings();

  // Hero section states
  const [headline, setHeadline] = useState(settings.hero.headline);
  const [subheadline, setSubheadline] = useState(settings.hero.subheadline);
  const [searchPlaceholder, setSearchPlaceholder] = useState(settings.hero.searchPlaceholder);
  const [stats, setStats] = useState(settings.hero.stats);

  // Billboard banners
  const [billboard, setBillboard] = useState<BillboardItem[]>(settings.billboard);

  // Promo modal
  const [promoActive, setPromoActive] = useState(settings.promoModal.isActive);
  const [promoBadge, setPromoBadge] = useState(settings.promoModal.badge);
  const [promoTitle, setPromoTitle] = useState(settings.promoModal.title);
  const [promoSubtitle, setPromoSubtitle] = useState(settings.promoModal.subtitle);
  const [promoImage, setPromoImage] = useState(settings.promoModal.image);
  const [promoCtaText, setPromoCtaText] = useState(settings.promoModal.ctaText);
  const [promoLink, setPromoLink] = useState(settings.promoModal.link);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setHeadline(settings.hero.headline);
        setSubheadline(settings.hero.subheadline);
        setSearchPlaceholder(settings.hero.searchPlaceholder);
        setStats(settings.hero.stats);
        setBillboard(settings.billboard);
        setPromoActive(settings.promoModal.isActive);
        setPromoBadge(settings.promoModal.badge);
        setPromoTitle(settings.promoModal.title);
        setPromoSubtitle(settings.promoModal.subtitle);
        setPromoImage(settings.promoModal.image);
        setPromoCtaText(settings.promoModal.ctaText);
        setPromoLink(settings.promoModal.link);
      }, 0);
    }
  }, [settings, isLoading]);

  const handleStatChange = (index: number, field: "value" | "label", val: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: val };
    setStats(updated);
  };

  const handleBannerChange = (index: number, field: keyof BillboardItem, val: unknown) => {
    const updated = [...billboard];
    updated[index] = { ...updated[index], [field]: val };
    setBillboard(updated);
  };

  const handleAddBanner = () => {
    const newId = `ad-custom-${Date.now()}`;
    const newBanner: BillboardItem = {
      id: newId,
      tag: "PROMO MITRA",
      partnerName: "Nama Pengiklan / Mitra",
      title: "Judul Promo Banner Baru",
      subtitle: "Deskripsi penawaran istimewa properti terverifikasi di Tapak.",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Lihat Penawaran",
      link: "/explore",
      isActive: true,
    };
    setBillboard([newBanner, ...billboard]);
  };

  const handleDeleteBanner = (index: number) => {
    if (billboard.length <= 1) {
      alert("Harus ada minimal 1 banner billboard.");
      return;
    }
    const updated = billboard.filter((_, i) => i !== index);
    setBillboard(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const ok = await updateSettings({
      hero: {
        headline,
        subheadline,
        searchPlaceholder,
        stats,
      },
      billboard,
      promoModal: {
        isActive: promoActive,
        badge: promoBadge,
        title: promoTitle,
        subtitle: promoSubtitle,
        image: promoImage,
        ctaText: promoCtaText,
        link: promoLink,
      },
    });

    setSaving(false);
    if (ok) {
      setSuccessMessage("Konten beranda, banner billboard, dan promo berhasil diperbarui!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      setErrorMessage("Gagal menyimpan pengaturan. Silakan coba lagi.");
    }
  };

  const handleReset = async () => {
    if (!confirm("Kembalikan seluruh teks hero dan banner beranda ke default?")) return;
    setSaving(true);
    const ok = await resetSettings();
    setSaving(false);
    if (ok) {
      setSuccessMessage("Konten beranda berhasil direset ke standar.");
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-[8px] bg-emerald-50 text-emerald-600">
              <Sliders className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Pengaturan Konten Beranda &amp; Hero
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#687280] mt-1">
            Sesuaikan teks utama pencarian hero, banner iklan billboard berputar, popup promosi, dan statistik beranda.
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: Hero & Search Form */}
        <div className="bg-white rounded-[18px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <h2 className="font-bold text-base text-[#111827] flex items-center gap-2">
              <Search className="w-4 h-4 text-[#3D77EE]" />
              <span>Teks Bagian Hero &amp; Pencarian</span>
            </h2>
            <span className="text-[11px] text-slate-400">Tampil di area paling atas beranda</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1.5">
              Judul Utama Hero (Headline)
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Temukan Hunian Terverifikasi Tanpa Biaya Tersembunyi"
              required
              className="w-full px-3.5 py-2.5 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-sm font-bold text-[#111827] focus:outline-none focus:border-[#3D77EE] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1.5">
              Deskripsi Sub-Headline
            </label>
            <textarea
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              rows={2}
              placeholder="Jelajahi ribuan pilihan apartemen, rumah, vila, dan ruko..."
              className="w-full px-3.5 py-2.5 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-xs sm:text-sm text-[#111827] focus:outline-none focus:border-[#3D77EE] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1.5">
              Placeholder Input Pencarian
            </label>
            <input
              type="text"
              value={searchPlaceholder}
              onChange={(e) => setSearchPlaceholder(e.target.value)}
              placeholder="Contoh: SCBD, Kebayoran Baru, BSD City..."
              className="w-full px-3.5 py-2.5 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-sm text-[#111827] focus:outline-none focus:border-[#3D77EE] focus:bg-white"
            />
          </div>

          {/* Stats Counters */}
          <div className="pt-3 border-t border-[#E2E8F0]">
            <label className="block text-xs font-bold text-[#111827] mb-2.5">
              Poin Statistik / Kepercayaan Beranda (3 Kolom)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stats.map((item, idx) => (
                <div key={idx} className="p-3 rounded-[10px] bg-slate-50 border border-[#E2E8F0] space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                      Angka / Nilai #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-[6px] bg-white border border-[#E2E8F0] text-xs font-extrabold text-[#3D77EE] focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                      Label Keterangan
                    </span>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-[6px] bg-white border border-[#E2E8F0] text-[11px] font-medium text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: Billboard Banners Manager */}
        <div className="bg-white rounded-[18px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="font-bold text-base text-[#111827] flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-600" />
                <span>Slot Iklan Billboard Beranda</span>
              </h2>
              <p className="text-xs text-[#687280] mt-0.5">
                Banner berjalan otomatis di atas beranda untuk promosi mitra bank, perumahan developer, atau penawaran khusus.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddBanner}
              className="px-3 py-1.5 rounded-[8px] text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Banner</span>
            </button>
          </div>

          <div className="space-y-4">
            {billboard.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-[14px] bg-slate-50 border border-[#E2E8F0] space-y-4 relative"
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#111827] text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-[#111827]">
                      {item.partnerName || "Banner Iklan"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={(e) => handleBannerChange(idx, "isActive", e.target.checked)}
                        className="w-4 h-4 accent-[#3D77EE] rounded"
                      />
                      <span className={item.isActive ? "text-emerald-600" : "text-slate-400"}>
                        {item.isActive ? "Aktif Tayang" : "Nonaktif"}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleDeleteBanner(idx)}
                      className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                      title="Hapus Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Kategori Tag (Badge)
                    </label>
                    <input
                      type="text"
                      value={item.tag}
                      onChange={(e) => handleBannerChange(idx, "tag", e.target.value)}
                      placeholder="DEVELOPER RESMI"
                      className="w-full px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Mitra / Pengiklan
                    </label>
                    <input
                      type="text"
                      value={item.partnerName}
                      onChange={(e) => handleBannerChange(idx, "partnerName", e.target.value)}
                      placeholder="Navapark BSD City"
                      className="w-full px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Judul Banner Iklan
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleBannerChange(idx, "title", e.target.value)}
                      placeholder="Cluster Lancewood Navapark — Hunian Resort Botanikal"
                      className="w-full px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Sub-judul / Deskripsi Banner
                    </label>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => handleBannerChange(idx, "subtitle", e.target.value)}
                      placeholder="Bebas iuran pemeliharaan (IPL) 6 bulan pertama..."
                      className="w-full px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-xs text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      URL Gambar Banner (16:9 disarankan)
                    </label>
                    <input
                      type="url"
                      value={item.image}
                      onChange={(e) => handleBannerChange(idx, "image", e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-xs text-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Teks Tombol CTA
                      </label>
                      <input
                        type="text"
                        value={item.ctaText}
                        onChange={(e) => handleBannerChange(idx, "ctaText", e.target.value)}
                        placeholder="Lihat Unit"
                        className="w-full px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        URL Tujuan
                      </label>
                      <input
                        type="text"
                        value={item.link}
                        onChange={(e) => handleBannerChange(idx, "link", e.target.value)}
                        placeholder="/explore"
                        className="w-full px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-xs text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Promo Modal Popup */}
        <div className="bg-white rounded-[18px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="font-bold text-base text-[#111827] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Popup Iklan / Promo Beranda (Modal Iklan)</span>
              </h2>
              <p className="text-xs text-[#687280] mt-0.5">
                Modal dialog yang otomatis berganti dan tampil saat pengguna mengunjungi beranda.
              </p>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={promoActive}
                onChange={(e) => setPromoActive(e.target.checked)}
                className="w-4 h-4 accent-[#3D77EE] rounded"
              />
              <span className={promoActive ? "text-emerald-600" : "text-slate-400"}>
                {promoActive ? "Popup Aktif" : "Popup Mati"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Teks Badge Promo
              </label>
              <input
                type="text"
                value={promoBadge}
                onChange={(e) => setPromoBadge(e.target.value)}
                placeholder="PROMO TERBATAS"
                className="w-full px-3.5 py-2 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-xs font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Teks Tombol Aksi
              </label>
              <input
                type="text"
                value={promoCtaText}
                onChange={(e) => setPromoCtaText(e.target.value)}
                placeholder="Gunakan Promo Sekarang"
                className="w-full px-3.5 py-2 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-xs font-semibold text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Judul Utama Promo
              </label>
              <input
                type="text"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
                placeholder="Bonus Iklan Multi-Lapak & Diskon Listing 35%"
                className="w-full px-3.5 py-2 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-xs sm:text-sm font-bold text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Deskripsi Promo
              </label>
              <textarea
                value={promoSubtitle}
                onChange={(e) => setPromoSubtitle(e.target.value)}
                rows={2}
                placeholder="Tingkatkan jangkauan calon penyewa..."
                className="w-full px-3.5 py-2 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-xs text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                URL Gambar Promo
              </label>
              <input
                type="url"
                value={promoImage}
                onChange={(e) => setPromoImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-xs text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Link Tujuan Promo
              </label>
              <input
                type="text"
                value={promoLink}
                onChange={(e) => setPromoLink(e.target.value)}
                placeholder="/paket-iklan"
                className="w-full px-3.5 py-2 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-xs text-slate-800"
              />
            </div>
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
            <span>{saving ? "Menyimpan..." : "Simpan Pengaturan Beranda"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
