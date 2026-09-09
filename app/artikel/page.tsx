import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticlesClientView from "@/components/articles/ArticlesClientView";
import { getArticles } from "@/lib/articles-data";

export const metadata = {
  title: "Artikel & Wawasan Properti — Tapak.",
  description:
    "Panduan cerdas sewa properti, tips finansial hunian, regulasi kontrak sewa, dan wawasan tren arsitektur terkini dari kurator Tapak.",
};

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB]">
      <Navbar />
      <main className="flex-1">
        <ArticlesClientView articles={articles} />
      </main>
      <Footer />
    </div>
  );
}
