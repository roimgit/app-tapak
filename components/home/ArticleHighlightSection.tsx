"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Clock, Calendar } from "lucide-react";
import { getFeaturedArticles } from "@/lib/articles-data";
import { useLanguage } from "@/context/LanguageContext";

export default function ArticleHighlightSection() {
  const { t } = useLanguage();
  const featuredArticles = getFeaturedArticles();

  return (
    <section className="py-12 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3D77EE] mb-1.5">
            <BookOpen className="w-4 h-4 text-[#3D77EE]" />
            <span>{t("art.badge", "Wawasan & Panduan Tapak.")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            {t("art.title", "Artikel Pilihan & Tren Hunian")}
          </h2>
          <p className="text-sm text-[#687280] mt-1">
            {t(
              "art.subtitle",
              "Tips praktis sewa, panduan legalitas kontrak, dan kalkulasi biaya riil dari para ahli"
            )}
          </p>
        </div>
        <Link
          href="/artikel"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3D77EE] hover:text-[#2B55AB] transition-colors group shrink-0"
        >
          <span>{t("art.see_all", "Lihat Seluruh Artikel")}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid 3 Kartu Artikel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredArticles.map((article) => (
          <article
            key={article.id}
            className="group bg-white rounded-[18px] border border-[#E2E8F0] hover:border-[#3D77EE] shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Gambar Cover */}
              <Link href={`/artikel/${article.slug}`} className="block relative w-full h-48 overflow-hidden bg-slate-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 bg-white/95 backdrop-blur-xs text-[#3D77EE] text-[11px] font-bold rounded-md shadow-2xs border border-[#E2E8F0]/60 uppercase tracking-wide">
                    {article.category}
                  </span>
                </div>
              </Link>

              {/* Konten Teks */}
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-[#687280] mb-2.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {article.publishedAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#111827] group-hover:text-[#3D77EE] transition-colors leading-snug line-clamp-2 mb-2">
                  <Link href={`/artikel/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="text-xs text-[#687280] leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </div>

            {/* Footer Penulis */}
            <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-200 shrink-0">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#111827] leading-tight">
                    {article.author.name}
                  </div>
                  <div className="text-[10px] text-[#687280]">
                    {article.author.role}
                  </div>
                </div>
              </div>

              <Link
                href={`/artikel/${article.slug}`}
                className="text-xs font-bold text-[#3D77EE] hover:text-[#2B55AB] flex items-center gap-1"
                aria-label={`Baca artikel ${article.title}`}
              >
                <span>{t("art.read", "Baca")}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
