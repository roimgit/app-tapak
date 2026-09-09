"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Share2,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { ArticleItem } from "@/lib/articles-data";

interface ArticleDetailViewProps {
  article: ArticleItem;
  relatedArticles: ArticleItem[];
  recommendations: ArticleItem[];
}

export default function ArticleDetailView({
  article,
  relatedArticles,
  recommendations,
}: ArticleDetailViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Baca artikel menarik "${article.title}" di Tapak:\n${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Baca "${article.title}" di Tapak.`);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    }
  };

  return (
    <article className="w-full pb-16">
      {/* 1. Breadcrumb / Back Link */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <Link
          href="/artikel"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3D77EE] hover:text-[#2B55AB] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Seluruh Artikel</span>
        </Link>
      </div>

      {/* 2. Top Large Hero Image Banner (Reference Image 2) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative w-full h-[260px] sm:h-[380px] md:h-[460px] rounded-[20px] sm:rounded-[24px] overflow-hidden bg-slate-900 border border-[#E2E8F0] shadow-sm">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      </div>

      {/* 3. Article Header & Meta (Reference Image 2) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#3D77EE] mb-2">
          <span>{article.category}</span>
          <span className="text-slate-300">•</span>
          <span className="text-[#687280] font-semibold">{article.publishedAt}</span>
          <span className="text-slate-300">•</span>
          <span className="text-[#687280] font-semibold">{article.readTime}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] leading-tight mb-6">
          {article.title}
        </h1>

        {/* Share Bar (Reference Image 2) */}
        <div className="flex items-center flex-wrap gap-3 pb-6 border-b border-slate-200 text-xs">
          <span className="font-bold text-[#111827] flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-[#3D77EE]" />
            Bagikan:
          </span>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleShareTwitter}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Twitter / X</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-full font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
              copied
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white hover:bg-slate-50 text-[#111827] border-[#E2E8F0]"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tautan Disalin!</span>
              </>
            ) : (
              <span>Salin Tautan</span>
            )}
          </button>
        </div>
      </div>

      {/* 4. Main 2-Column Content + Sidebar Layout (Reference Image 2) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Article Content (Left Column ~68%) */}
          <div className="lg:col-span-8">
            <div
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-sans text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* In-Content Secondary Image (Reference Image 2) */}
            {article.secondaryImage && (
              <div className="my-8">
                <div className="relative w-full h-[240px] sm:h-[340px] rounded-[18px] overflow-hidden bg-slate-100 border border-[#E2E8F0]">
                  <Image
                    src={article.secondaryImage}
                    alt={`${article.title} - Ilustrasi`}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 text-center italic">
                  Dokumentasi kurasi hunian terverifikasi tim analis Tapak.
                </p>
              </div>
            )}

            {/* Author Box at Bottom of Article */}
            <div className="mt-10 p-6 rounded-[18px] bg-white border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-200 shrink-0">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-[#3D77EE] mb-0.5">
                  Penulis Artikel
                </div>
                <h4 className="text-base font-bold text-[#111827]">
                  {article.author.name}
                </h4>
                <div className="text-xs font-medium text-[#687280] mb-2">
                  {article.author.role}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {article.author.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar (Right Column ~32%) (Reference Image 2) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-24">
            {/* Related Topics (Topik Terkait) */}
            <div className="bg-white rounded-[18px] p-5 border border-[#E2E8F0] shadow-2xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827] mb-3 pb-2 border-b border-slate-100">
                Topik Terkait
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/artikel`}
                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#3D77EE] text-xs font-semibold text-slate-700 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Articles (Artikel Terkait) */}
            <div className="bg-white rounded-[18px] p-5 border border-[#E2E8F0] shadow-2xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827] mb-4 pb-2 border-b border-slate-100">
                Artikel Terkait
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((item) => (
                  <Link
                    key={item.id}
                    href={`/artikel/${item.slug}`}
                    className="group flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="relative w-18 h-18 rounded-[10px] overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-[#3D77EE] mb-0.5">
                        {item.category} • {item.publishedAt}
                      </div>
                      <h4 className="text-xs font-bold text-[#111827] group-hover:text-[#3D77EE] transition-colors leading-snug line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <span className="text-[11px] font-semibold text-[#3D77EE] inline-flex items-center gap-1">
                        <span>Baca</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Follow Us / Ikuti Kami */}
            <div className="bg-white rounded-[18px] p-5 border border-[#E2E8F0] shadow-2xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827] mb-3 pb-2 border-b border-slate-100">
                Ikuti Media Sosial Tapak.
              </h3>
              <p className="text-xs text-[#687280] mb-3">
                Dapatkan update harian seputar listing hunian terverifikasi dan tips sewa terkini.
              </p>
              <div className="space-y-2 text-xs font-semibold">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-[8px] bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#3D77EE] transition-colors"
                >
                  <span>Instagram @tapak.homes</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-[8px] bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#3D77EE] transition-colors"
                >
                  <span>Twitter / X @tapak_id</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 5. Recommendation Articles Section (Reference Image 2) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pt-12 border-t border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Rekomendasi Artikel Pilihan
            </h2>
            <p className="text-xs sm:text-sm text-[#687280] mt-0.5">
              Jelajahi panduan bermanfaat lainnya untuk pengalaman sewa terbaik
            </p>
          </div>
          <Link
            href="/artikel"
            className="text-xs sm:text-sm font-bold text-[#3D77EE] hover:text-[#2B55AB] inline-flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Grid items (Reference Image 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.map((item) => (
            <Link
              key={item.id}
              href={`/artikel/${item.slug}`}
              className="group bg-white rounded-[16px] border border-[#E2E8F0] hover:border-[#3D77EE] p-3.5 shadow-2xs hover:shadow-sm transition-all flex items-start gap-3.5"
            >
              <div className="relative w-22 h-22 rounded-[12px] overflow-hidden bg-slate-100 shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-[#3D77EE] mb-0.5">
                  {item.category} • {item.publishedAt}
                </div>
                <h4 className="text-xs font-bold text-[#111827] group-hover:text-[#3D77EE] transition-colors leading-snug line-clamp-2 mb-2">
                  {item.title}
                </h4>
                <span className="text-[11px] font-semibold text-[#3D77EE] inline-flex items-center gap-1">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Bottom Promo CTA Banner (Reference Image 2) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[24px] bg-[#111827] text-white p-8 sm:p-12 overflow-hidden relative shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-[#3D77EE] border border-blue-500/30 text-xs font-bold mb-3 inline-block">
              Peta Interaktif Tapak.
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-2">
              Temukan Hunian Impian Anda Tanpa Biaya Siluman
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-medium">
              Jelajahi peta interaktif hunian terverifikasi dengan rincian biaya IPL dan kalkulasi utilitas transparan.
            </p>
            <div className="flex items-center flex-wrap gap-3">
              <Link
                href="/explore"
                className="px-5 py-2.5 bg-[#3D77EE] hover:bg-[#2B55AB] text-white font-bold text-xs sm:text-sm rounded-[10px] shadow-sm transition-all"
              >
                Buka Explore
              </Link>
              <Link
                href="/paket-iklan"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-[10px] border border-white/20 transition-all"
              >
                Pasang Iklan Sewa
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center relative w-48 h-48 bg-gradient-to-br from-[#3D77EE]/30 to-transparent rounded-full border border-white/10 p-6 shrink-0">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#3D77EE] text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-white">Tapak. Map</div>
              <div className="text-[10px] text-slate-400">Verified Units</div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
