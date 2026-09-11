export interface BillboardItem {
  id: string;
  tag: string;
  partnerName: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  link: string;
  isActive: boolean;
}

export interface SupportContactItem {
  id: string;
  name: string;
  type: "whatsapp" | "email" | "phone";
  value: string;
  actionUrl: string;
  description: string;
  badge?: string;
  isActive: boolean;
}

export interface SupportSettings {
  title: string;
  subtitle: string;
  workingHours: string;
  emergencyNote: string;
  contacts: SupportContactItem[];
}

export interface SiteSettings {
  branding: {
    logoType: "text" | "image";
    logoText: string;
    logoDotColor: string;
    logoImageUrl: string;
    tagline: string;
    badgeText: string;
    faviconUrl: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    searchPlaceholder: string;
    stats: Array<{
      value: string;
      label: string;
    }>;
  };
  billboard: BillboardItem[];
  promoModal: {
    isActive: boolean;
    badge: string;
    title: string;
    subtitle: string;
    image: string;
    ctaText: string;
    link: string;
  };
  support: SupportSettings;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  branding: {
    logoType: "text",
    logoText: "Tapak",
    logoDotColor: "#3D77EE",
    logoImageUrl: "",
    tagline: "Platform Properti Terverifikasi & Transparan",
    badgeText: "",
    faviconUrl: "/favicon.ico",
  },
  hero: {
    headline: "Temukan Hunian Terverifikasi Tanpa Biaya Tersembunyi",
    subheadline:
      "Jelajahi ribuan pilihan apartemen, rumah, vila, dan ruko dengan transparansi biaya IPL, sertifikat resmi, dan jaminan lokasi akurat.",
    searchPlaceholder: "Contoh: SCBD, Kebayoran Baru, BSD City...",
    stats: [
      { value: "1.200+", label: "Hunian Terverifikasi" },
      { value: "100%", label: "Transparansi Biaya & Legalitas" },
      { value: "4.9/5", label: "Rating Kepuasan Mitra & Penyewa" },
    ],
  },
  billboard: [
    {
      id: "ad-kpr-mandiri",
      tag: "MITRA FINANSIAL",
      partnerName: "KPR Bunga Spesial",
      title: "Program Sewa & Bunga KPR Spesial 3.25% Bebas Biaya Admin",
      subtitle:
        "Dapatkan kemudahan fasilitas pembiayaan sewa dan kepemilikan bersama mitra perbankan terverifikasi Tapak.",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Pelajari Program",
      link: "/explore?tier=GOLD",
      isActive: true,
    },
    {
      id: "ad-navapark-bsd",
      tag: "DEVELOPER RESMI",
      partnerName: "Navapark BSD City",
      title: "Cluster Lancewood Navapark — Hunian Resort Botanikal Eksklusif",
      subtitle:
        "Bebas iuran pemeliharaan (IPL) 6 bulan pertama & voucher perabot untuk penyewa terverifikasi.",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Lihat Unit Tersedia",
      link: "/explore?q=Navapark",
      isActive: true,
    },
    {
      id: "ad-dekoruma-living",
      tag: "PARTNER EKSKLUSIF",
      partnerName: "Dekoruma Home Living",
      title: "Voucher Styling Interior & Furnitur Senilai Rp 5.000.000",
      subtitle:
        "Khusus kontrak sewa minimum 1 tahun di apartemen dan rumah terverifikasi Gold & Silver.",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Klaim Voucher",
      link: "/paket-iklan",
      isActive: true,
    },
    {
      id: "ad-district-scbd",
      tag: "PREMIUM LIVING",
      partnerName: "District 8 SCBD Suites",
      title: "Suite Mewah SCBD Senopati — Akses Langsung Ashta Mall",
      subtitle:
        "Pilihan unit sewa eksekutif di jantung kawasan finansial Jakarta dengan layanan concierge 24 jam.",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Eksplorasi Unit",
      link: "/explore?q=SCBD",
      isActive: true,
    },
  ],
  promoModal: {
    isActive: true,
    badge: "PROMO TERBATAS",
    title: "Bonus Iklan Multi-Lapak & Diskon Listing 35%",
    subtitle:
      "Tingkatkan jangkauan calon penyewa dan pembeli potensial properti Anda di seluruh Jabodetabek dan kota besar lainnya.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    ctaText: "Gunakan Promo Sekarang",
    link: "/paket-iklan",
  },
  support: {
    title: "Pusat Bantuan & Dukungan Mitra Tapak.",
    subtitle:
      "Tim konsultan dan dukungan teknis Tapak. siap membantu Anda mengelola listing, kendala teknis, serta verifikasi legalitas properti.",
    workingHours: "Senin – Minggu: 08.00 – 22.00 WIB",
    emergencyNote: "Layanan konsultasi darurat transaksi tetap dilayani 24/7 melalui WhatsApp resmi.",
    contacts: [
      {
        id: "contact-cs-wa",
        name: "Layanan Pelanggan & CS WhatsApp",
        type: "whatsapp",
        value: "0812-3456-7890",
        actionUrl: "https://wa.me/6281234567890?text=Halo%20Tim%20Tapak,%20saya%20memerlukan%20bantuan%20terkait%20portal%20properti.",
        description: "Dukungan chat cepat, panduan listing, dan verifikasi akun.",
        badge: "Paling Cepat",
        isActive: true,
      },
      {
        id: "contact-email",
        name: "Helpdesk & Email Resmi",
        type: "email",
        value: "bantuan@tapak.id",
        actionUrl: "mailto:bantuan@tapak.id?subject=Bantuan%20Portal%20Mitra%20Tapak",
        description: "Kirim pertanyaan legalitas, bukti dokumen, atau kerjasama developer.",
        badge: "Resmi",
        isActive: true,
      },
      {
        id: "contact-phone",
        name: "Hotline Panggilan Langsung",
        type: "phone",
        value: "+62 21 5088 1234",
        actionUrl: "tel:+622150881234",
        description: "Panggilan suara untuk kebutuhan darurat operasional & transaksi.",
        badge: "Hotline",
        isActive: true,
      },
    ],
  },
};

