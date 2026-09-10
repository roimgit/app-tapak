import React from "react";
import type { Metadata } from "next";
import SupportSettingsClient from "@/components/admin/SupportSettingsClient";

export const metadata: Metadata = {
  title: "Pengaturan Kontak Bantuan & Dukungan Owner — Tapak.",
  description: "Kelola saluran kontak resmi, WhatsApp CS, email helpdesk, dan jam operasional dukungan mitra owner.",
};

export default function AdminSupportContactPage() {
  return <SupportSettingsClient />;
}
