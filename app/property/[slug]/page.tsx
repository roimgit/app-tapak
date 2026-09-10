import React from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CostCalculatorWidget from "@/components/CostCalculatorWidget";
import PropertyHeader from "@/components/property/PropertyHeader";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertySpecs from "@/components/property/PropertySpecs";
import PropertyLegalSection from "@/components/property/PropertyLegalSection";
import PropertyCostBreakdown from "@/components/property/PropertyCostBreakdown";
import PropertyAgentSidebar from "@/components/property/PropertyAgentSidebar";
import { getListingBySlug } from "@/lib/listings";
import NearbyAmenities from "@/components/property/NearbyAmenities";


interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Properti Tidak Ditemukan — Tapak." };

  return {
    title: `${listing.title} — Tapak.`,
    description: listing.description.slice(0, 160),
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-8">
        <PropertyHeader listing={listing} />
        <PropertyGallery images={listing.images} title={listing.title} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <PropertySpecs listing={listing} />
            <PropertyLegalSection listing={listing} />
            <PropertyCostBreakdown listing={listing} />
            {listing.transaction_type === "DISEWAKAN" && (
              <CostCalculatorWidget
                title={`Simulasi Biaya Kontrak: ${listing.title}`}
                initialRent={listing.price}
                initialMaintenance={listing.maintenance_fee}
                initialUtility={listing.utility_estimate}
                initialDeposit={listing.deposit}
              />
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <PropertyAgentSidebar listing={listing} />
          </div>
        </div>

        {/* Fasilitas Sekitar & Aksesibilitas Lingkungan (Leaflet + OpenStreetMap) */}
        <NearbyAmenities
          latitude={listing.latitude}
          longitude={listing.longitude}
          propertyTitle={listing.title}
          listingCode={`TPK-${listing.id.slice(-4).toUpperCase()}`}
        />
      </main>
      <Footer />
    </div>
  );
}
