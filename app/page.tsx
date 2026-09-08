import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoModal from "@/components/PromoModal";
import HeroSearchSection from "@/components/home/HeroSearchSection";
import PromoSection from "@/components/home/PromoSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedSection from "@/components/home/FeaturedSection";
import PillarsSection from "@/components/home/PillarsSection";
import CostCalculatorWidget from "@/components/CostCalculatorWidget";
import { getListings } from "@/lib/listings";

export default async function HomePage() {
  const listings = await getListings();
  const featuredListings = listings.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB]">
      <Navbar />
      <PromoModal />
      <main className="flex-1">
        <HeroSearchSection />
        <PromoSection />
        <CategorySection />
        <FeaturedSection listings={featuredListings} />
        <PillarsSection />

        <section id="kalkulator" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
              Simulasi & Kalkulator Biaya Nyata
            </h2>
            <p className="text-sm text-[#687280] mt-2">
              Ketahui rincian uang sewa, dana cadangan deposit, dan biaya rutin bulanan sebelum memutuskan untuk menyewa
            </p>
          </div>
          <CostCalculatorWidget />
        </section>
      </main>
      <Footer />
    </div>
  );
}
