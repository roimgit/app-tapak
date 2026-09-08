"use client";

import React from "react";
import Link from "next/link";
import { Map, PlusCircle, LucideIcon } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  activeHref?: string;
  onSelectLink?: (href: string) => void;
}

export default function MobileNavDrawer({
  isOpen,
  onClose,
  navLinks,
  activeHref,
  onSelectLink,
}: MobileNavDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-x-0 top-20 bg-white border-b border-gray-200 shadow-xl rounded-b-[24px] p-6 space-y-4 animate-in slide-in-from-top duration-200 z-40">
      <div className="flex flex-col space-y-2">
        {navLinks.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => {
                onSelectLink?.(item.href);
                onClose();
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-[10px] text-base font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-[#3D77EE] font-semibold"
                  : "text-gray-700 hover:bg-blue-50/60 hover:text-[#3D77EE]"
              }`}
            >
              {item.icon && (
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-[#3D77EE]" : "text-gray-500"}`}
                />
              )}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
        <Link
          href="/explore"
          onClick={() => {
            onSelectLink?.("/explore");
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] text-sm font-semibold text-[#3D77EE] bg-blue-50 hover:bg-blue-100/70 transition-colors"
        >
          <Map className="w-4 h-4" />
          <span>Buka Peta Interaktif</span>
        </Link>
        <Link
          href="/paket-iklan"
          onClick={() => {
            onSelectLink?.("/paket-iklan");
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] text-sm font-semibold text-white bg-[#3D77EE] hover:bg-[#2B55AB] transition-colors active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Pasang Listing Properti</span>
        </Link>
      </div>
    </div>
  );
}
