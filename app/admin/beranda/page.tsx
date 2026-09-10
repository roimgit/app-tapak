import React from "react";
import type { Metadata } from "next";
import HomeContentSettingsClient from "@/components/admin/HomeContentSettingsClient";

export const metadata: Metadata = {
  title: "Pengaturan Konten Beranda — Super Admin Tapak.",
  description: "Kelola teks hero, form pencarian, counter statistik, billboard banner, dan popup promo Tapak.",
};

export default function HomeContentSettingsPage() {
  return <HomeContentSettingsClient />;
}
