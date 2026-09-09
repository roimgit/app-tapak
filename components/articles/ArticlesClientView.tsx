"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { ArticleItem } from "@/lib/articles-data";

interface ArticlesClientViewProps {
  articles: ArticleItem[];
}

const CATEGORIES = [
  "Semua",
  "Panduan Sewa",
  "Tips Finansial",
  "Tren Properti",
  "Legalitas & Biaya",
];

export default function ArticlesClientView({ articles }: ArticlesClientViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Hero / Featured Article (first featured item or first article)
  const heroArticle = useMemo(() => {
    return articles.find((a) => a.isFeatured) || articles[0];
  }, [articles]);

  // Filtered articles (excluding hero from grid if viewing "Semua", or all matching)
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      if (selectedCategory !== "Semua" && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchExcerpt = item.excerpt.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchExcerpt && !matchCategory && !matchTag) return false;
      }
      return true;
    });
  }, [articles, selectedCategory, searchQuery]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
  };

  return (
    <div className="w-full">
      {/* 1. Header Hero Section (Reference Image 1) */}
      <section className="pt-10 pb-12 sm:pt-16 sm:pb-16 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#3D77EE] text-xs font-bold mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#3D77EE]" />
          <span>Artikel & Wawasan</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight leading-[1.15] mb-4">
          Wawasan & Tren Properti Masa Kini
        </h1>

        <p className="text-sm sm:text-base text-[#687280] max-w-2xl mx-auto leading-relaxed">
          Dapatkan pembaruan terkini seputar panduan sewa hunian, analisis biaya riil IPL, strategi finansial cerdas, dan tren properti dari kurator Tapak.
        </p>
      </section>

      {/* 2. Featured / Hero Article Card (Reference Image 1) */}
      {heroArticle && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all overflow-hidden p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              {/* Gambar Hero */}
              <div className="lg:col-span-6 relative w-full h-[240px] sm:h-[320px] lg:h-[380px] rounded-[18px] overflow-hidden bg-slate-100">
                <Image
                  src={heroArticle.image}
                  alt={heroArticle.title}
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Konten Hero */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="text-xs font-bold uppercase tracking-wider text-[#3D77EE] mb-2.5">
                  {heroArticle.category}
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] leading-tight mb-3 hover:text-[#3D77EE] transition-colors">
                  <Link href={`/artikel/${heroArticle.slug}`}>
                    {heroArticle.title}
                  </Link>
                </h2>

                <p className="text-sm text-[#687280] leading-relaxed mb-6 line-clamp-3">
                  {heroArticle.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                      <Image
                        src={heroArticle.author.avatar}
                        alt={heroArticle.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#111827]">
                        {heroArticle.author.name}
                      </div>
                      <div className="text-xs text-[#687280] flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{heroArticle.publishedAt}</span>
                        <span>•</span>
                        <span>{heroArticle.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/artikel/${heroArticle.slug}`}
                    className="px-4 py-2 bg-[#3D77EE] hover:bg-[#2B55AB] text-white text-xs font-bold rounded-[10px] shadow-sm transition-colors"
                  >
                    Baca Artikel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Section Articles + Category Tabs + Search (Reference Image 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#3D77EE] text-xs font-bold mb-2">
            Articles
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            Jelajahi Artikel & Panduan Terbaru
          </h2>
        </div>

        {/* Filter Bar & Search Input */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
          {/* Category Tabs */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#3D77EE] text-white shadow-xs font-bold"
                      : "bg-white text-[#687280] hover:text-[#111827] hover:bg-slate-100 border border-[#E2E8F0]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel, kata kunci..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#E2E8F0] rounded-[10px] focus:outline-none focus:border-[#3D77EE] focus:ring-1 focus:ring-[#3D77EE] shadow-2xs text-[#111827] placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* 3-Column Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-[18px] border border-[#E2E8F0] hover:border-[#3D77EE] shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <Link href={`/artikel/${article.slug}`} className="block relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </Link>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="text-xs font-bold text-[#3D77EE] mb-2">
                      {article.category}
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

                {/* Author & Date Footer */}
                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#111827]">
                        {article.author.name}
                      </div>
                      <div className="text-[10px] text-[#687280]">
                        {article.publishedAt}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {article.readTime}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-[18px] border border-[#E2E8F0]">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-[#111827]">Artikel Tidak Ditemukan</h4>
            <p className="text-xs text-[#687280] mt-1 max-w-sm mx-auto">
              Tidak ada artikel yang cocok dengan kata kunci &quot;{searchQuery}&quot;. Coba gunakan kata kunci lain atau pilih kategori Semua.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("Semua");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-[#3D77EE] text-white text-xs font-bold rounded-[10px]"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </section>

      {/* 4. Newsletter CTA Banner (Reference Image 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-[24px] bg-[#3D77EE] text-white overflow-hidden p-8 sm:p-12 lg:p-14 shadow-lg shadow-blue-500/15">
          {/* Subtle geometric pattern overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none rounded-r-[24px]" />

          <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-3">
              Berlangganan Newsletter Tapak.
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed mb-6 font-medium">
              Dapatkan kurasi mingguan panduan sewa hunian, analisis pasar, tips legalitas kontrak, dan penawaran unit terbaik langsung ke kotak masuk email Anda.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-white/15 backdrop-blur-xs rounded-[10px] text-xs font-bold text-white border border-white/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Terima kasih! Anda telah terdaftar dalam newsletter Tapak.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Masukkan alamat email Anda"
                  required
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/30 rounded-[10px] text-xs sm:text-sm text-white placeholder:text-blue-200 focus:outline-none focus:bg-white focus:text-[#111827] focus:placeholder:text-slate-400 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-[#3D77EE] font-bold text-xs sm:text-sm rounded-[10px] shadow-sm transition-all hover:scale-[1.02] active:scale-95 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Langganan</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <p className="text-[10px] text-blue-200 mt-3">
              Bebas spam. Anda dapat berhenti berlangganan kapan saja dengan 1 klik.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
