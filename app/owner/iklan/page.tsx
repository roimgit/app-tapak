import React from "react";
import type { Metadata } from "next";
import OwnerAdBookingClient from "@/components/owner/OwnerAdBookingClient";

export const metadata: Metadata = {
  title: "Pasang Slot Iklan & Banner — Tapak. Owner Studio",
  description:
    "Pesan slot banner beranda dan pop-up promo eksklusif untuk melipatgandakan kunjungan calon penyewa ke listing properti Anda di Tapak.",
};

export default function OwnerIklanPage() {
  return (
    <div className="w-full min-h-screen bg-[#F3F6FB] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <OwnerAdBookingClient />
      </div>
    </div>
  );
}
