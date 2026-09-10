import React from "react";
import Navbar from "@/components/Navbar";
import ExploreClient from "@/components/ExploreClient";
import { getListings } from "@/lib/listings";

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    tier?: string;
    city?: string;
    transaction_type?: string;
    slug?: string;
    id?: string;
  }>;
}

export const metadata = {
  title: "Explore Hunian — Tapak.",
  description:
    "Jelajahi peta interaktif hunian terverifikasi di Jabodetabek & kota besar Indonesia dengan pin tetes air biru Tapak.",
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  const type = resolvedParams.type || "";
  const tier = resolvedParams.tier || "";
  const city = resolvedParams.city || "";
  const transaction_type = resolvedParams.transaction_type || "";
  const slug = resolvedParams.slug || "";
  const id = resolvedParams.id || "";

  // Ambil seluruh katalog listing agar client dapat memfilter dan mereset ke 'semua' secara instan
  const allListings = await getListings();

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB]">
      <Navbar />
      <main className="flex-1">
        <ExploreClient
          key={`${q}-${type}-${tier}-${city}-${transaction_type}-${slug}-${id}`}
          initialListings={allListings}
          initialQuery={q || city}
          initialType={type}
          initialTier={tier}
          initialTransactionType={transaction_type}
          initialSelectedSlug={slug}
          initialSelectedId={id}
        />
      </main>
    </div>
  );
}
