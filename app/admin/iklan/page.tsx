import React from "react";
import type { Metadata } from "next";
import AdSlotManagementClient from "@/components/admin/AdSlotManagementClient";

export const metadata: Metadata = {
  title: "Slot Iklan Beranda & Moderasi — Super Admin Tapak.",
  description:
    "Atur kuota dan tarif sewa slot iklan Billboard dan Popup Modal Beranda, serta kurasi pengajuan materi iklan dari mitra pemilik.",
};

export default function AdminAdSlotsPage() {
  return <AdSlotManagementClient />;
}
