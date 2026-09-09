"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-16 pb-12 text-[#687280]">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Kolom 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="brand-wordmark text-2xl font-black text-[#111827]">
                Tapak<span className="text-[#3D77EE]">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              {t(
                "footer.desc",
                "Platform ekosistem properti terkurasi pertama di Indonesia dengan standar verifikasi legalitas berlapis dan transparansi biaya menyeluruh. Bebas biaya siluman, bebas sengketa."
              )}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#3D77EE] bg-blue-50 py-2 px-3 rounded-[10px] w-fit border border-blue-100">
              <ShieldCheck className="w-4 h-4" />
              <span>{t("nav.verification", "Standar Verifikasi Berlapis Tapak.")}</span>
            </div>
          </div>

          {/* Kolom 2: Jelajah Properti */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
              {t("footer.prop_explore", "Jelajah Properti")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore?type=Apartemen" className="hover:text-[#3D77EE] transition-colors">
                  {t("search.apartment", "Sewa Apartemen")}
                </Link>
              </li>
              <li>
                <Link href="/explore?type=Rumah" className="hover:text-[#3D77EE] transition-colors">
                  {t("search.house", "Sewa Rumah Tapak")}
                </Link>
              </li>
              <li>
                <Link href="/explore?type=Kost" className="hover:text-[#3D77EE] transition-colors">
                  {t("search.kost", "Kost Eksklusif & Co-living")}
                </Link>
              </li>
              <li>
                <Link href="/explore?type=Vila" className="hover:text-[#3D77EE] transition-colors">
                  {t("search.villa", "Vila & Liburan")}
                </Link>
              </li>
              <li>
                <Link href="/explore?type=Ruko" className="hover:text-[#3D77EE] transition-colors">
                  {t("search.commercial", "Ruko & Komersial")}
                </Link>
              </li>
              <li>
                <Link href="/artikel" className="hover:text-[#3D77EE] transition-colors font-medium text-[#3D77EE]">
                  {t("nav.articles", "Artikel & Wawasan")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Area Populer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
              {t("footer.popular_areas", "Area Favorit")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore?city=Jakarta+Selatan" className="hover:text-[#3D77EE] transition-colors">
                  Jakarta Selatan (SCBD &amp; Senopati)
                </Link>
              </li>
              <li>
                <Link href="/explore?city=Tangerang+Selatan" className="hover:text-[#3D77EE] transition-colors">
                  BSD City &amp; Tangerang Selatan
                </Link>
              </li>
              <li>
                <Link href="/explore?city=Denpasar" className="hover:text-[#3D77EE] transition-colors">
                  Sanur &amp; Badung Bali
                </Link>
              </li>
              <li>
                <Link href="/explore?city=Tangerang" className="hover:text-[#3D77EE] transition-colors">
                  Gading Serpong
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Hubungi Kami */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
              {t("footer.help_support", "Layanan Bantuan")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#3D77EE]" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#3D77EE]" />
                <span>bantuan@tapak.id</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#3D77EE] shrink-0 mt-0.5" />
                <span>One Pacific Place, Lt. 15, SCBD, Jakarta Selatan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Baris Bawah Hak Cipta */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Tapak. {t("footer.rights", "Seluruh hak cipta dilindungi.")}</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-[#111827] transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="#" className="hover:text-[#111827] transition-colors">
              Syarat &amp; Ketentuan
            </Link>
            <Link href="#" className="hover:text-[#111827] transition-colors">
              Jaminan Transparansi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
