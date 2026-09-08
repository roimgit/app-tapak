import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OwnerSubNav from "@/components/paket-iklan/OwnerSubNav";
import PricingSection from "@/components/paket-iklan/PricingSection";
import TrustAndPaymentSection from "@/components/paket-iklan/TrustAndPaymentSection";
import ComparisonDataSection from "@/components/paket-iklan/ComparisonDataSection";
import FaqSection from "@/components/paket-iklan/FaqSection";
import EnterpriseBanner from "@/components/paket-iklan/EnterpriseBanner";

export const metadata: Metadata = {
  title: "Pilih Paket Sewa Lapak Iklan — Tapak.",
  description:
    "Pasang properti Anda di Tapak dan jangkau ribuan calon pembeli langsung ke WhatsApp Anda tanpa perantara rumit. Verifikasi instan & transparan.",
};

export default function PaketIklanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB]">
      <Navbar />
      <OwnerSubNav />

      <main className="flex-1 w-full bg-[#F3F6FB] relative overflow-hidden py-10 sm:py-14">
        {/* Ambient Gradient Glow Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[320px] bg-gradient-to-b from-blue-500/10 via-blue-200/20 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-96 right-[-100px] w-80 h-80 bg-sky-400/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
