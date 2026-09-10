import React from "react";
import type { Metadata } from "next";
import UserManagementClient from "@/components/admin/UserManagementClient";

export const metadata: Metadata = {
  title: "Manajemen Akun & Hak Akses Administrator — Tapak.",
  description: "Kelola akun pengguna, mitra owner, dan berikan hak akses Administrator Super Admin Studio.",
};

export default function AdminUsersPage() {
  return <UserManagementClient />;
}
