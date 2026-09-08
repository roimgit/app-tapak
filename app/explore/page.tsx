import React from "react";
import Navbar from "@/components/Navbar";
import ExploreClient from "@/components/ExploreClient";
import { getListings } from "@/lib/listings";
import { VerificationTier } from "@/lib/types";

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    tier?: string;
    city?: string;
  }>;
}

export const metadata = {
  title: "Peta Explore Hunian — Tapak.",
  description:
    "Jelajahi peta interaktif hunian terverifikasi di Jabodetabek & kota besar Indonesia dengan pin tetes air biru Tapak.",
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  const type = resolvedParams.type || "";
  const tier = (resolvedParams.tier as VerificationTier) || undefined;
  const city = resolvedParams.city || "";

  const listings = await getListings({
    query: q,
    property_type: type,
    verification_tier: tier,
    city: city,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB]">
      <Navbar />
      <main className="flex-1">
        <ExploreClient
          initialListings={listings}
          initialQuery={q}
          initialType={type}
          initialTier={resolvedParams.tier || ""}
        />
      </main>
    </div>
  );
}
