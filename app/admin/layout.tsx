import React from "react";
import type { Metadata } from "next";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";

export const metadata: Metadata = {
  title: "Super Admin Studio — Tapak.",
  description: "Pusat kendali konten, logo, branding, slot iklan, dan manajemen situs Tapak.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
