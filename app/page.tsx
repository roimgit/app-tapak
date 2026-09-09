import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoModal from "@/components/PromoModal";
import HeroSearchSection from "@/components/home/HeroSearchSection";
import HomeBillboardBanner from "@/components/home/HomeBillboardBanner";
import CategorySection from "@/components/home/CategorySection";
import ArticleHighlightSection from "@/components/home/ArticleHighlightSection";
import PromoSection from "@/components/home/PromoSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import PillarsSection from "@/components/home/PillarsSection";
import { getListings } from "@/lib/listings";

export default async function HomePage() {
  const listings = await getListings();
  const featuredListings = listings.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB]">
      <Navbar />
      <PromoModal />
      <main className="flex-1">
        <HomeBillboardBanner />
        <HeroSearchSection />
        <CategorySection />
        <ArticleHighlightSection />
        <PromoSection />
        <FeaturedSection listings={featuredListings} />
        <PillarsSection />
      </main>
      <Footer />
    </div>
  );
}
