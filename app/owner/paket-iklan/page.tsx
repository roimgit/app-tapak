import React from "react";
import type { Metadata } from "next";
import PricingSection from "@/components/paket-iklan/PricingSection";
import TrustAndPaymentSection from "@/components/paket-iklan/TrustAndPaymentSection";
import ComparisonDataSection from "@/components/paket-iklan/ComparisonDataSection";
import FaqSection from "@/components/paket-iklan/FaqSection";
import EnterpriseBanner from "@/components/paket-iklan/EnterpriseBanner";

export const metadata: Metadata = {
  title: "Pilih Paket Sewa Lapak Iklan — Tapak. Owner Studio",
  description:
    "Pasang properti Anda di Tapak dan jangkau ribuan calon penyewa langsung ke WhatsApp Anda tanpa perantara rumit. Kuota fleksibel & verifikasi instan.",
};

export default function OwnerPaketIklanPage() {
  return (
    <div className="w-full bg-[#F9F9FF] min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <PricingSection />
        <TrustAndPaymentSection />
        <ComparisonDataSection />
        <FaqSection />
        <EnterpriseBanner />
      </div>
    </div>
  );
}
