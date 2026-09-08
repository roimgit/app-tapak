import React from "react";
import type { Metadata } from "next";
import OwnerLayoutShell from "@/components/owner/OwnerLayoutShell";

export const metadata: Metadata = {
  title: "Owner Studio — Tapak.",
  description: "Portal khusus mitra pemilik properti untuk kelola kuota, iklan, dan listing terverifikasi di Tapak.",
};

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OwnerLayoutShell>{children}</OwnerLayoutShell>;
}
