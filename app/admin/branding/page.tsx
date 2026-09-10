import React from "react";
import type { Metadata } from "next";
import BrandingSettingsClient from "@/components/admin/BrandingSettingsClient";

export const metadata: Metadata = {
  title: "Pengaturan Logo & Branding — Super Admin Tapak.",
  description: "Kelola logo website, aksen warna, badge navbar, dan identitas brand Tapak.",
};

export default function BrandingSettingsPage() {
  return <BrandingSettingsClient />;
}
