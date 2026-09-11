import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tapak. — Platform Properti Terverifikasi & Transparan",
  description:
    "Temukan hunian sewa dan beli dengan transparansi total, verifikasi legalitas berlapis, dan rincian biaya lengkap di Tapak.",
  keywords: ["sewa apartemen", "sewa rumah", "kost eksklusif", "tapak", "properti indonesia"],
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import PageLoadingIndicator from "@/components/PageLoadingIndicator";
import DynamicFavicon from "@/components/DynamicFavicon";
import GoogleTranslateProvider from "@/components/GoogleTranslateProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-[#F3F6FB] text-[#111827] font-sans antialiased selection:bg-[#3D77EE] selection:text-white">
        <AuthProvider>
          <LanguageProvider>
            <SiteSettingsProvider>
              <GoogleTranslateProvider />
              <DynamicFavicon />
              <PageLoadingIndicator />
              {children}
            </SiteSettingsProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
