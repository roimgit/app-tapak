"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Sliders,
  Tag,
  FileText,
  Building2,
  Globe,
  CheckCircle2,
  ArrowRight,
  Image as ImageIcon,
  ShieldCheck,
  Megaphone,
  Users,
  Headphones,
} from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function AdminDashboardPage() {
  const { settings } = useSiteSettings();

  const activeBannersCount = settings.billboard.filter((b) => b.isActive).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-blue-50 to-transparent pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#3D77EE] border border-blue-200 mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Studio Kontrol Utama Tapak.</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Selamat Datang, Super Admin 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#687280] mt-1.5 max-w-2xl">
              Kelola identitas logo, teks hero beranda, banner promosi berputar, paket iklan, dan seluruh aset konten website Tapak secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/admin/branding"
              className="px-4 py-2.5 rounded-[10px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] shadow-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Atur Logo &amp; Brand</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="px-4 py-2.5 rounded-[10px] text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Pratinjau Web</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Logo & Brand */}
        <div className="p-5 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#687280]">Mode Logo Website</span>
            <div className="w-8 h-8 rounded-[8px] bg-blue-50 text-[#3D77EE] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#111827] flex items-center gap-1.5">
              <span>{settings.branding.logoType === "image" ? "Gambar Logo" : "Teks Wordmark"}</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              &quot;{settings.branding.logoText}.&quot; aktif di Navbar
            </span>
          </div>
        </div>

        {/* Metric 2: Banner Billboard */}
        <div className="p-5 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#687280]">Banner Beranda Aktif</span>
            <div className="w-8 h-8 rounded-[8px] bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#111827]">
              {activeBannersCount} dari {settings.billboard.length} Banner
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Berotasi otomatis di halaman beranda
            </span>
          </div>
        </div>

        {/* Metric 3: Promo Modal Popup */}
        <div className="p-5 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#687280]">Popup Iklan Beranda</span>
            <div className="w-8 h-8 rounded-[8px] bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#111827]">
              {settings.promoModal.isActive ? (
                <span className="text-emerald-600">Tayang Aktif</span>
              ) : (
                <span className="text-slate-400">Dinonaktifkan</span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block truncate">
              &quot;{settings.promoModal.title}&quot;
            </span>
          </div>
        </div>

        {/* Metric 4: Properti Terdaftar */}
        <div className="p-5 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#687280]">Total Listing Publik</span>
            <div className="w-8 h-8 rounded-[8px] bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#111827]">
              12 Unit Hunian
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              100% Terverifikasi PostGIS &amp; IPL
            </span>
          </div>
        </div>
      </div>

      {/* Main CMS Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Logo & Branding */}
        <div className="p-6 rounded-[18px] bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#3D77EE] transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-[12px] bg-blue-50 text-[#3D77EE] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#111827]">
              Pengaturan Logo &amp; Identitas Brand
            </h2>
            <p className="text-xs text-[#687280] mt-1.5 leading-relaxed">
              Pilih antara logo teks wordmark atau upload gambar logo resmi Tapak., sesuaikan warna aksen titik (bullet dot), teks badge navbar, dan favicon situs.
            </p>

            <div className="mt-4 p-3 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-xs">
              <span className="text-slate-500 block mb-1 font-medium">Pratinjau Wordmark Saat Ini:</span>
              <span className="font-black text-xl text-[#111827] tracking-tight">
                {settings.branding.logoText}
                <span style={{ color: settings.branding.logoDotColor }}>.</span>
              </span>
            </div>
          </div>

          <Link
            href="/admin/branding"
            className="mt-6 inline-flex items-center justify-between px-4 py-2.5 rounded-[10px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] transition-colors"
          >
            <span>Buka Pengaturan Logo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 2: Konten Beranda & Hero */}
        <div className="p-6 rounded-[18px] bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#3D77EE] transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-[12px] bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Sliders className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#111827]">
              Pengaturan Konten Beranda &amp; Hero
            </h2>
            <p className="text-xs text-[#687280] mt-1.5 leading-relaxed">
              Atur headline utama pencarian, deskripsi sub-headline, placeholder form pencarian, counter statistik terverifikasi, banner billboard, dan popup iklan promo.
            </p>

            <div className="mt-4 p-3 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-xs">
              <span className="text-slate-500 block mb-1 font-medium">Headline Beranda Saat Ini:</span>
              <p className="font-bold text-slate-800 line-clamp-1">
                &quot;{settings.hero.headline}&quot;
              </p>
            </div>
          </div>

          <Link
            href="/admin/beranda"
            className="mt-6 inline-flex items-center justify-between px-4 py-2.5 rounded-[10px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] transition-colors"
          >
            <span>Buka Pengaturan Beranda</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 3: Paket Iklan & Slot */}
        <div className="p-6 rounded-[18px] bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#3D77EE] transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-[12px] bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Tag className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#111827]">
              Paket Iklan &amp; Slot Tayang
            </h2>
            <p className="text-xs text-[#687280] mt-1.5 leading-relaxed">
              Pantau status ketersediaan slot banner iklan di halaman beranda, dan tentukan penawaran paket sewa slot bagi mitra developer / perbankan.
            </p>
          </div>

          <Link
            href="/admin/paket-iklan"
            className="mt-6 inline-flex items-center justify-between px-4 py-2.5 rounded-[10px] text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <span>Kelola Slot Iklan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 4: Artikel & Berita */}
        <div className="p-6 rounded-[18px] bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#3D77EE] transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-[12px] bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#111827]">
              Artikel &amp; Edukasi Properti
            </h2>
            <p className="text-xs text-[#687280] mt-1.5 leading-relaxed">
              Tulis panduan legalitas sewa-beli, tips inspeksi IPL, dan berita pasar properti terkini untuk menjaring ribuan pengunjung organik.
            </p>
          </div>

          <Link
            href="/admin/artikel"
            className="mt-6 inline-flex items-center justify-between px-4 py-2.5 rounded-[10px] text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <span>Kelola Artikel</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 5: Manajemen Akun & Hak Akses */}
        <div className="p-6 rounded-[18px] bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#3D77EE] transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-[12px] bg-blue-50 text-[#3D77EE] flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#111827]">
              Manajemen Akun &amp; Hak Akses
            </h2>
            <p className="text-xs text-[#687280] mt-1.5 leading-relaxed">
              Cek daftar seluruh pengguna dan mitra terdaftar di sistem, verifikasi akun, dan berikan atau cabut hak akses Administrator Studio secara fleksibel.
            </p>
          </div>

          <Link
            href="/admin/pengguna"
            className="mt-6 inline-flex items-center justify-between px-4 py-2.5 rounded-[10px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] transition-colors shadow-xs"
          >
            <span>Kelola Akun &amp; Akses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 6: Kontak Bantuan & Dukungan Owner */}
        <div className="p-6 rounded-[18px] bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#3D77EE] transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-[12px] bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Headphones className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#111827]">
              Kontak Bantuan &amp; Dukungan Owner
            </h2>
            <p className="text-xs text-[#687280] mt-1.5 leading-relaxed">
              Kelola nomor WhatsApp CS, email helpdesk resmi, jam operasional, dan pesan konsultasi yang tampil otomatis pada modal popup bantuan di portal mitra owner.
            </p>
          </div>

          <Link
            href="/admin/kontak"
            className="mt-6 inline-flex items-center justify-between px-4 py-2.5 rounded-[10px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] transition-colors shadow-xs"
          >
            <span>Atur Kontak Bantuan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
