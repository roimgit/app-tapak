"use client";

import React, { useState } from "react";
import OwnerSidebar from "./OwnerSidebar";
import OwnerHeader from "./OwnerHeader";

interface OwnerLayoutShellProps {
  children: React.ReactNode;
}

export default function OwnerLayoutShell({ children }: OwnerLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#111C2D]">
      {/* Sidebar Navigasi Kiri */}
      <OwnerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Wrapper with offset for sidebar */}
      <div className="pl-0 md:pl-[260px] flex flex-col min-h-screen">
        {/* Header Atas */}
        <OwnerHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Area with top padding for header */}
        <div className="pt-16 flex-1 w-full">{children}</div>
      </div>
    </div>
  );
}
