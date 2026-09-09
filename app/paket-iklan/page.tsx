import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingSection from "@/components/paket-iklan/PricingSection";
import TrustAndPaymentSection from "@/components/paket-iklan/TrustAndPaymentSection";
import ComparisonDataSection from "@/components/paket-iklan/ComparisonDataSection";
import FaqSection from "@/components/paket-iklan/FaqSection";
import EnterpriseBanner from "@/components/paket-iklan/EnterpriseBanner";

export const metadata: Metadata = {
  title: "Paket Iklan Properti — Tapak.",
  description:
    "Pilihan paket pasang iklan sewa & jual properti transparan di Tapak. Jangkau ribuan calon penyewa langsung ke WhatsApp tanpa perantara.",
};

export default function PublicPaketIklanPage() {
  return (
    <div className="min-h-screen bg-[#F3F6FB] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="w-full max-w-[1440px] mx-auto space-y-16">
          <PricingSection />
          <TrustAndPaymentSection />
          <ComparisonDataSection />
          <FaqSection />
          <EnterpriseBanner />
        </div>
      </main>

      <Footer />
    </div>
  );
}
