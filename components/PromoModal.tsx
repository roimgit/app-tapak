"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PromoAd {
  id: number;
  slug: string;
  title: string;
  imageSrc: string;
}

const PROMO_ADS: PromoAd[] = [
  {
    id: 1,
    slug: "the-pakubuwono-signature-3br-full-furnished",
    title: "Promo Spesial Cashback Sewa Rp 3 Juta - The Pakubuwono Signature",
    imageSrc: "/promos/promo-pakubuwono.jpg",
  },
  {
    id: 2,
    slug: "modern-minimalist-villa-sanur-tropical-sanctuary",
    title: "Sanur Promo Vila Diskon Sewa 15% - Modern Minimalist Villa Sanur",
    imageSrc: "/promos/promo-sanur.jpg",
  },
  {
    id: 3,
    slug: "district-8-scbd-studio-suite-high-floor",
    title: "District 8 SCBD Gratis Biaya IPL 3 Bulan",
    imageSrc: "/promos/promo-scbd.jpg",
  },
];

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // State touch gesture untuk swipe touchscreen di mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    // Muncul otomatis setiap kali halaman di-refresh setelah jeda singkat
    const timer = setTimeout(() => setIsOpen(true), 350);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isOpen) return null;

  const current = PROMO_ADS[currentIndex];

  const nextPromo = () => {
    setCurrentIndex((prev) => (prev + 1) % PROMO_ADS.length);
  };

  const prevPromo = () => {
    setCurrentIndex((prev) => (prev - 1 + PROMO_ADS.length) % PROMO_ADS.length);
  };

  // Handler touch swipe untuk smartphone / tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextPromo(); // Geser ke kiri -> Iklan berikutnya
    } else if (distance < -minSwipeDistance) {
      prevPromo(); // Geser ke kanan -> Iklan sebelumnya
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      {/* Container Banner Iklan Full Image 16:9 yang Presisi & Konsisten */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-2xl sm:max-w-3xl aspect-[16/9] rounded-[24px] shadow-2xl overflow-hidden border border-white/25 animate-in zoom-in-95 duration-200 select-none bg-slate-950 group"
      >
        {/* Tombol Tutup X di Sudut Kanan Atas */}
        <button
          onClick={() => setIsOpen(false)}
          type="button"
          aria-label="Tutup iklan promo"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white transition-all backdrop-blur-md shadow-lg"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Tombol Panah Navigasi Kiri */}
        <button
          onClick={prevPromo}
          type="button"
          aria-label="Iklan sebelumnya"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all active:scale-90"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Tombol Panah Navigasi Kanan */}
        <button
          onClick={nextPromo}
          type="button"
          aria-label="Iklan selanjutnya"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all active:scale-90"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Full Image Banner: Klik di mana saja langsung menuju properti yang sedang promo */}
        <Link
          href={`/property/${current.slug}`}
          onClick={() => setIsOpen(false)}
          title={`Lihat detail penawaran ${current.title}`}
          className="relative w-full h-full block cursor-pointer"
        >
          <Image
            src={current.imageSrc}
            alt={current.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Indikator Titik / Lingkaran Pagination di Bagian Bawah Modal */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-auto">
          {PROMO_ADS.map((item, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Lihat iklan promo ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-7 sm:w-8 h-2.5 sm:h-3 bg-white shadow-lg shadow-white/50 ring-2 ring-white/60"
                    : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white/50 hover:bg-white/80 shadow-xs"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
