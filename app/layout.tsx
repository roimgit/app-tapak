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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-[#F3F6FB] text-[#111827] font-sans antialiased selection:bg-[#3D77EE] selection:text-white">
        {children}
      </body>
    </html>
  );
}
