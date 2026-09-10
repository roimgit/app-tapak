import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import PropertyTopHeader from "@/components/owner/properties/PropertyTopHeader";
import PropertyListClient from "@/components/owner/properties/PropertyListClient";
import type { PropertyData } from "@/components/owner/properties/PropertyCardRow";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Daftar Properti Saya — Tapak. Owner Studio",
  description:
    "Kelola portofolio unit properti, pantau status kurasi verifikasi, performa tayangan, dan prospek leads masuk secara real-time di Tapak.",
};

export default async function OwnerPropertiesPage() {
  let dbListings: any[] = [];
  try {
    dbListings = await prisma.listing.findMany({
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Gagal mengambil data listing owner:", error);
  }

  const formattedProperties: PropertyData[] = dbListings.map((item, index) => {
    const isAvailable = item.is_available;
    const isPending = item.approval_status === "PENDING";
    const isRejected = item.approval_status === "REJECTED";
    const status: PropertyData["status"] = isRejected
      ? "ditolak"
      : isPending
      ? "review"
      : !isAvailable
      ? "tersewa"
      : "aktif";
    const statusText = isRejected
      ? "Ditolak Admin"
      : isPending
      ? "Menunggu Kurasi"
      : !isAvailable
      ? "Tersewa (Off-Market)"
      : "Aktif / Tayang";

    const pType =
      item.property_type === "Rumah" || item.property_type === "Ruko"
        ? item.property_type
        : "Apartemen";

    return {
      id: item.id,
      code: `#TPK-${(1001 + index).toString()}`,
      type: pType,
      title: item.title,
      location: `${item.district}, ${item.city} • ${item.area_sqm} m²`,
      imageUrl:
        item.images?.[0] ||
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
      photoCount: item.images?.length || 1,
      schemaType: "SEWA BULANAN",
      price: formatRupiah(Number(item.price)),
      pricePeriod: "/ bln",
      priceNote: `Deposit: ${item.deposit ? formatRupiah(Number(item.deposit)) : "-"} • IPL: ${
        item.maintenance_fee ? formatRupiah(Number(item.maintenance_fee)) : "-"
      }`,
      status,
      statusText,
      statusNote: `Diperbarui ${new Date(item.updated_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`,
      tier: (item.verification_tier as PropertyData["tier"]) || "SILVER",
      views: 120 + ((index * 37) % 800),
      leads: 4 + ((index * 7) % 25),
      score: 85 + (index % 12),
      scoreLabel: "Optimal",
      curatorNote: item.rejection_reason || undefined,
      slug: item.slug,
    };
  });

  return (
    <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* 1. Breadcrumb, Header & Action Buttons */}
      <PropertyTopHeader />

      {/* 2. Interactive Property List with Dynamic Metrics Ribbon, Filters & Pagination */}
      <PropertyListClient initialProperties={formattedProperties} />
    </main>
  );
}
