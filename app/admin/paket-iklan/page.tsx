import React from "react";
import type { Metadata } from "next";
import PackageSettingsClient from "@/components/admin/PackageSettingsClient";

export const metadata: Metadata = {
  title: "Pengaturan Paket Langganan — Super Admin Tapak.",
  description:
    "Konfigurasi tarif paket sewa lapak listing dan benefit bonus slot iklan beranda untuk mitra pemilik properti.",
};

export default function AdminPaketIklanPage() {
  return <PackageSettingsClient />;
}
