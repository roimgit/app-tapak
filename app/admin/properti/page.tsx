import React from "react";
import type { Metadata } from "next";
import ListingModerationClient from "@/components/admin/ListingModerationClient";

export const metadata: Metadata = {
  title: "Pusat Moderasi Listing Properti — Super Admin Tapak.",
  description:
    "Kurasi dan validasi listing hunian yang diposting oleh mitra pemilik/agen sebelum tayang di publik.",
};

export default function AdminPropertiPage() {
  return <ListingModerationClient />;
}
