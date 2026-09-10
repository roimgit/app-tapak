"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

interface BannerItem {
  id: string;
  tag: string;
  partnerName: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  link: string;
}

const DEFAULT_BANNER_ADS: BannerItem[] = [
  {
    id: "ad-kpr-mandiri",
    tag: "MITRA FINANSIAL",
    partnerName: "KPR Bunga Spesial",
    title: "Program Sewa & Bunga KPR Spesial 3.25% Bebas Biaya Admin",
    subtitle: "Dapatkan kemudahan fasilitas pembiayaan sewa dan kepemilikan bersama mitra perbankan terverifikasi Tapak.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
    ctaText: "Pelajari Program",
    link: "/explore?tier=GOLD",
  },
  {
    id: "ad-navapark-bsd",
    tag: "DEVELOPER RESMI",
    partnerName: "Navapark BSD City",
    title: "Cluster Lancewood Navapark — Hunian Resort Botanikal Eksklusif",
    subtitle: "Bebas iuran pemeliharaan (IPL) 6 bulan pertama & voucher perabot untuk penyewa terverifikasi.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    ctaText: "Lihat Unit Tersedia",
    link: "/explore?q=Navapark",
  },
  {
    id: "ad-dekoruma-living",
    tag: "PARTNER EKSKLUSIF",
    partnerName: "Dekoruma Home Living",
    title: "Voucher Styling Interior & Furnitur Senilai Rp 5.000.000",
    subtitle: "Khusus kontrak sewa minimum 1 tahun di apartemen dan rumah terverifikasi Gold & Silver.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    ctaText: "Klaim Voucher",
    link: "/paket-iklan",
  },
  {
    id: "ad-district-scbd",
    tag: "PREMIUM LIVING",
    partnerName: "District 8 SCBD Suites",
    title: "Suite Mewah SCBD Senopati — Akses Langsung Ashta Mall",
    subtitle: "Pilihan unit sewa eksekutif di jantung kawasan finansial Jakarta dengan layanan concierge 24 jam.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
    ctaText: "Eksplorasi Unit",
    link: "/explore?q=SCBD",
  },
];

export default function HomeBillboardBanner() {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeBookings, setActiveBookings] = useState<BannerItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/ads/bookings?status=ACTIVE_TODAY&slotType=BILLBOARD_HOME")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: BannerItem[] = data.data.map((b: any) => ({
            id: b.id,
            tag: b.tag || "DEVELOPER RESMI",
            partnerName: b.ownerName,
            title: b.title,
            subtitle: b.subtitle || "",
            image: b.imageUrl,
            ctaText: b.ctaText || "Lihat Unit",
            link: b.targetUrl || "/explore",
          }));
          setActiveBookings(mapped);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const bannerList: BannerItem[] = useMemo(() => {
    if (activeBookings.length > 0) {
      return activeBookings;
    }
    if (settings?.billboard && settings.billboard.length > 0) {
      const active = settings.billboard.filter((b) => b.isActive);
      if (active.length > 0) return active;
    }
    return DEFAULT_BANNER_ADS;
  }, [activeBookings, settings?.billboard]);

  const totalBanners = bannerList.length;

  const handleNext = useCallback(() => {
    if (totalBanners === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalBanners);
  }, [totalBanners]);

  const handlePrev = () => {
    if (totalBanners === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalBanners) % totalBanners);
  };

  useEffect(() => {
    if (currentIndex >= totalBanners) {
      setCurrentIndex(0);
    }
  }, [totalBanners, currentIndex]);

  useEffect(() => {
    if (isPaused || totalBanners <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, handleNext, totalBanners]);

  if (totalBanners === 0) return null;

  return (
    <section className="pt-4 pb-2 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
      <div
        className="relative w-full h-[140px] sm:h-[160px] md:h-[180px] rounded-[18px] overflow-hidden border border-[#E2E8F0] shadow-xs group bg-slate-900"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Banner Images with Crossfade */}
        {bannerList.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority={index === 0}
                className="object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000"
                sizes="(max-width: 1440px) 100vw, 1440px"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/20 sm:to-transparent" />

              {/* Content Overlay */}
              <div className="relative h-full z-20 flex flex-col justify-center px-5 sm:px-8 md:px-12 max-w-2xl text-white">
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#3D77EE] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {item.tag}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-300">
                    {item.partnerName}
                  </span>
                  <span className="ml-auto hidden sm:inline-block px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs border border-white/20 text-[9px] uppercase tracking-widest text-slate-300">
                    {t("nav.verified_badge", "Terverifikasi")}
                  </span>
                </div>

                <h3 className="text-sm sm:text-lg md:text-xl font-extrabold text-white leading-tight line-clamp-1 mb-1 sm:mb-1.5">
                  {item.title}
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-1 sm:line-clamp-2 max-w-lg mb-2 sm:mb-3 font-medium">
                  {item.subtitle}
                </p>

                <div className="flex items-center gap-3">
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-[#3D77EE] hover:bg-[#2B55AB] text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-[0.98]"
                  >
                    <span>{item.ctaText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {totalBanners > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Banner Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Banner Berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicator Dots */}
        {totalBanners > 1 && (
          <div className="absolute bottom-3 right-5 z-30 flex items-center gap-1.5">
            {bannerList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? "w-6 bg-[#3D77EE]" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Pilih Banner ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
