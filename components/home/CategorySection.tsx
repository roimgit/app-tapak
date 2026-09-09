"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, Home, Compass, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatCategoryUnitCount } from "@/lib/utils";

interface CategorySectionProps {
  initialCounts?: Record<string, number>;
}

export default function CategorySection({ initialCounts }: CategorySectionProps) {
  const { t } = useLanguage();
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts || {});

  useEffect(() => {
    // Ambil data terkini dari database melalui API jika initialCounts belum ada atau untuk sinkronisasi
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data?.counts) {
          setCounts(data.counts);
        }
      })
      .catch(() => {
        // Fallback aman menggunakan initialCounts jika koneksi terhambat
      });
  }, []);

  const categories = [
    {
      key: "Apartemen",
      label: t("search.apartment", "Apartemen"),
      icon: Building2,
      desc: t("cat.apart_desc", "Unit vertikal modern di pusat bisnis"),
      href: "/explore?type=Apartemen",
      count: formatCategoryUnitCount(counts["Apartemen"] ?? 0, "Unit"),
    },
    {
      key: "Rumah",
      label: t("search.house", "Rumah Tapak"),
      icon: Home,
      desc: t("cat.house_desc", "Hunian asri keluarga dengan taman & garasi"),
      href: "/explore?type=Rumah",
      count: formatCategoryUnitCount(counts["Rumah"] ?? 0, "Unit"),
    },
    {
      key: "Kost",
      label: t("search.kost", "Kost & Co-Living"),
      icon: Compass,
      desc: t("cat.kost_desc", "Kamar sewa fleksibel berfasilitas lengkap"),
      href: "/explore?type=Kost",
      count: formatCategoryUnitCount(counts["Kost"] ?? 0, "Kamar"),
    },
    {
      key: "Vila",
      label: t("cat.villa_title", "Vila Tropis"),
      icon: Sparkles,
      desc: t("cat.villa_desc", "Vila liburan privat dengan kolam renang"),
      href: "/explore?type=Vila",
      count: formatCategoryUnitCount(counts["Vila"] ?? 0, "Vila"),
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              {t("cat.title", "Pilih Kategori Sesuai Gaya Hidup")}
            </h2>
            <p className="text-sm text-[#687280] mt-1">
              {t("cat.subtitle", "Mulai dari apartemen komuter hingga vila tropis privat")}
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3D77EE] hover:text-[#2B55AB]"
          >
            <span>{t("cat.see_all", "Lihat Seluruh Listing")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="p-6 rounded-[18px] bg-[#F3F6FB] border border-slate-200/60 hover:border-[#3D77EE] hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-[10px] bg-white group-hover:bg-[#3D77EE] group-hover:text-white text-[#3D77EE] border border-slate-200 flex items-center justify-center transition-colors shadow-xs mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#111827] group-hover:text-[#3D77EE] transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-[#687280] mt-1.5 line-clamp-2">{cat.desc}</p>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-[#3D77EE]">
                  <span>{cat.count}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
