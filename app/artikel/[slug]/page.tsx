import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleDetailView from "@/components/articles/ArticleDetailView";
import { getArticleBySlug, getArticles } from "@/lib/articles-data";

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan — Tapak.",
    };
  }

  return {
    title: `${article.title} — Tapak. Artikel`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = getArticles();
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const recommendations = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB]">
      <Navbar />
      <main className="flex-1">
        <ArticleDetailView
          article={article}
          relatedArticles={relatedArticles}
          recommendations={recommendations}
        />
      </main>
      <Footer />
    </div>
  );
}
