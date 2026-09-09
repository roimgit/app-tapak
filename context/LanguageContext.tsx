"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ID" | "KOR" | "ENG";

interface Translations {
  [key: string]: {
    ID: string;
    KOR: string;
    ENG: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Navigation
  "nav.home": {
    ID: "Beranda",
    KOR: "홈",
    ENG: "Home",
  },
  "nav.explore": {
    ID: "Explore",
    KOR: "탐색",
    ENG: "Explore",
  },
  "nav.articles": {
    ID: "Artikel",
    KOR: "아티클",
    ENG: "Articles",
  },
  "nav.verification": {
    ID: "Verifikasi Tapak.",
    KOR: "Tapak 인증",
    ENG: "Verification",
  },
  "nav.pricing": {
    ID: "Paket Iklan",
    KOR: "광고 패키지",
    ENG: "Pricing",
  },
  "nav.login": {
    ID: "Masuk",
    KOR: "로그인",
    ENG: "Sign In",
  },
  "nav.post_listing": {
    ID: "Pasang Listing",
    KOR: "매물 등록",
    ENG: "Post Listing",
  },
  "nav.verified_badge": {
    ID: "Verified Homes",
    KOR: "검증 매물",
    ENG: "Verified Homes",
  },
  "nav.owner_studio": {
    ID: "Studio Pemilik",
    KOR: "소유자 스튜디오",
    ENG: "Owner Studio",
  },

  // Billboard Banner
  "banner.kpr_title": {
    ID: "Program Sewa & Bunga KPR Spesial 3.25% Bebas Biaya Admin",
    KOR: "임대 & 주택담보대출 특판 3.25% 수수료 면제 프로모션",
    ENG: "Rental & Mortgage Special 3.25% Zero Admin Fee Program",
  },
  "banner.kpr_sub": {
    ID: "Dapatkan kemudahan fasilitas pembiayaan sewa dan kepemilikan bersama mitra perbankan terverifikasi Tapak.",
    KOR: "Tapak 인증 은행 파트너와 함께 임대 및 주택 자금 혜택을 누려보세요.",
    ENG: "Enjoy flexible rental and ownership financing with Tapak's verified banking partners.",
  },
  "banner.cta_learn": {
    ID: "Pelajari Program",
    KOR: "자세히 보기",
    ENG: "Learn More",
  },
  "banner.cta_view": {
    ID: "Lihat Unit Tersedia",
    KOR: "매물 보기",
    ENG: "View Units",
  },
  "banner.cta_claim": {
    ID: "Klaim Voucher",
    KOR: "쿠폰 받기",
    ENG: "Claim Voucher",
  },
  "banner.cta_explore": {
    ID: "Eksplorasi Unit",
    KOR: "유닛 탐색",
    ENG: "Explore Units",
  },

  // Hero & Search
  "hero.badge": {
    ID: "Platform Properti Terverifikasi Bebas Biaya Siluman",
    KOR: "숨겨진 비용 없는 100% 검증 부동산 플랫폼",
    ENG: "Verified Rental Platform with Zero Hidden Fees",
  },
  "hero.title_1": {
    ID: "Temukan Hunian Sewa Idaman",
    KOR: "안심하고 입주하는 프리미엄 렌탈",
    ENG: "Find Your Dream Rental Home",
  },
  "hero.title_2": {
    ID: "Transparan & Terverifikasi Legalitasnya.",
    KOR: "투명하고 법적으로 검증된 완벽한 공간.",
    ENG: "Transparent & Legally Verified with Confidence.",
  },
  "hero.subtitle": {
    ID: "Ribuan apartemen, rumah tapak, dan kost eksklusif dengan audit fisik langsung, transparansi IPL, dan lokasi titik koordinat presisi.",
    KOR: "현장 실사와 관리비 투명성, 정확한 위치 좌표를 갖춘 수천 개의 아파트, 단독주택 및 고급 코리빙 매물.",
    ENG: "Thousands of verified apartments, landed houses, and co-living spaces with physical inspection, transparent IPL fees, and exact GPS coordinates.",
  },
  "search.placeholder": {
    ID: "Contoh: SCBD, Kebayoran, BSD City...",
    KOR: "예: SCBD, 강남, 분당, 센트럴...",
    ENG: "E.g.: SCBD, Kebayoran, BSD City...",
  },
  "search.location": {
    ID: "Lokasi / Area",
    KOR: "위치 / 지역",
    ENG: "Location / Area",
  },
  "search.housing_type": {
    ID: "Tipe Hunian",
    KOR: "주거 유형",
    ENG: "Property Type",
  },
  "search.popular": {
    ID: "Pencarian Populer:",
    KOR: "인기 검색어:",
    ENG: "Popular Searches:",
  },
  "search.all_categories": {
    ID: "Semua Kategori",
    KOR: "모든 카테고리",
    ENG: "All Categories",
  },
  "search.apartment": {
    ID: "Apartemen",
    KOR: "아파트",
    ENG: "Apartment",
  },
  "search.house": {
    ID: "Rumah Tapak",
    KOR: "단독주택",
    ENG: "Landed House",
  },
  "search.kost": {
    ID: "Kost & Co-Living",
    KOR: "코리빙 / 원룸",
    ENG: "Co-Living",
  },
  "search.villa": {
    ID: "Vila",
    KOR: "빌라",
    ENG: "Villa",
  },
  "search.commercial": {
    ID: "Ruko Komersial",
    KOR: "상가",
    ENG: "Commercial",
  },
  "search.button": {
    ID: "Cari Hunian",
    KOR: "매물 검색",
    ENG: "Search Properties",
  },

  // Category Section
  "cat.title": {
    ID: "Pilih Kategori Sesuai Gaya Hidup",
    KOR: "라이프스타일별 카테고리 선택",
    ENG: "Choose Category by Lifestyle",
  },
  "cat.subtitle": {
    ID: "Mulai dari apartemen komuter hingga vila tropis privat",
    KOR: "도심 속 아파트부터 프라이빗 열대 빌라까지",
    ENG: "From commuter apartments to private tropical villas",
  },
  "cat.see_all": {
    ID: "Lihat Seluruh Listing",
    KOR: "전체 매물 보기",
    ENG: "View All Listings",
  },
  "cat.apart_desc": {
    ID: "Unit vertikal modern di pusat bisnis",
    KOR: "비즈니스 중심가의 모던 고층 아파트",
    ENG: "Modern vertical residences in CBD areas",
  },
  "cat.house_desc": {
    ID: "Hunian asri keluarga dengan taman & garasi",
    KOR: "정원과 주차장을 갖춘 쾌적한 단독주택",
    ENG: "Cozy family homes with private garden & garage",
  },
  "cat.kost_desc": {
    ID: "Kamar sewa fleksibel berfasilitas lengkap",
    KOR: "풀옵션 시설을 갖춘 유연한 코리빙",
    ENG: "Fully furnished flexible co-living suites",
  },
  "cat.villa_desc": {
    ID: "Vila liburan privat dengan kolam renang",
    KOR: "전용 수영장이 완비된 프라이빗 휴양 빌라",
    ENG: "Private holiday villas with private pool",
  },

  // Article Highlight Section
  "art.badge": {
    ID: "Wawasan & Panduan Tapak.",
    KOR: "Tapak 인사이트 & 가이드",
    ENG: "Tapak Insights & Guides",
  },
  "art.title": {
    ID: "Artikel Pilihan & Tren Hunian",
    KOR: "추천 기사 & 최신 주거 트렌드",
    ENG: "Featured Articles & Housing Trends",
  },
  "art.subtitle": {
    ID: "Tips praktis sewa, panduan legalitas kontrak, dan kalkulasi biaya riil dari para ahli",
    KOR: "전문가가 전하는 실전 임대 팁, 계약서 법률 검토, 실제 관리비 분석",
    ENG: "Rental tips, contract legal guides, and transparent cost insights from verified experts",
  },
  "art.see_all": {
    ID: "Lihat Seluruh Artikel",
    KOR: "모든 기사 보기",
    ENG: "View All Articles",
  },
  "art.read": {
    ID: "Baca",
    KOR: "읽기",
    ENG: "Read",
  },

  // Promo Section
  "promo.badge": {
    ID: "Promo Eksklusif",
    KOR: "단독 프로모션",
    ENG: "Exclusive Deals",
  },
  "promo.title": {
    ID: "Promo Terbatas & Iklan Terverifikasi",
    KOR: "기간 한정 특가 & 인증 혜택",
    ENG: "Limited Offers & Verified Deals",
  },
  "promo.subtitle": {
    ID: "Nikmati potongan deposit sewa, subsidi IPL hingga 6 bulan, dan voucher furnitur mitra resmi.",
    KOR: "보증금 할인, 최대 6개월 관리비 지원, 공식 파트너 가구 바우처 혜택을 누려보세요.",
    ENG: "Enjoy rental deposit discounts, up to 6 months IPL subsidies, and official furniture vouchers.",
  },

  // Featured Section
  "feat.badge": {
    ID: "Pilihan Kurator Tapak.",
    KOR: "Tapak 큐레이터 추천",
    ENG: "Tapak Curated Picks",
  },
  "feat.title": {
    ID: "Hunian Rekomendasi Terverifikasi",
    KOR: "엄선된 추천 검증 매물",
    ENG: "Recommended Verified Properties",
  },
  "feat.subtitle": {
    ID: "Audit fisik komprehensif, kepemilikan terjamin, dan tanpa mark-up IPL",
    KOR: "종합 현장 실사 완료, 확실한 소유권 검증, 관리비 부풀림 제로",
    ENG: "Comprehensive on-site inspection, guaranteed ownership, zero IPL markup",
  },
  "feat.explore_all": {
    ID: "Explore Semua Properti",
    KOR: "모든 매물 탐색",
    ENG: "Explore All Properties",
  },

  // Pillars Section
  "pillar.title": {
    ID: "Mengapa Memilih Melalui Tapak.?",
    KOR: "왜 Tapak을 선택해야 할까요?",
    ENG: "Why Choose Tapak.?",
  },
  "pillar.subtitle": {
    ID: "Kami menghapus keraguan dalam menyewa properti di Indonesia dengan 4 pilar jaminan baku",
    KOR: "4대 표준 보증 시스템으로 인도네시아 임대차 계약의 불투명성을 해소합니다",
    ENG: "We eliminate uncertainty in renting properties in Indonesia with 4 standard assurance pillars",
  },
  "pillar.1_title": {
    ID: "Verifikasi Berlapis 4-Tier",
    KOR: "4단계 다층 검증 시스템",
    ENG: "4-Tier Multi-Layer Verification",
  },
  "pillar.1_desc": {
    ID: "Tiap listing diperiksa melalui tier Bronze, Silver, hingga Gold dengan inspeksi fisik dan legalitas kepemilikan.",
    KOR: "브론즈부터 골드 티어까지 철저한 현장 실사와 법적 소유권 검증을 거칩니다.",
    ENG: "Every listing is verified from Bronze to Gold with physical inspection and ownership legality check.",
  },
  "pillar.2_title": {
    ID: "Biaya IPL & Utilitas Transparan",
    KOR: "관리비(IPL) & 공과금 완전 투명화",
    ENG: "Transparent IPL & Utilities Breakdown",
  },
  "pillar.2_desc": {
    ID: "Tidak ada lagi tagihan mendadak di akhir bulan. Biaya IPL gedung dan estimasi utilitas dijabarkan gamblang.",
    KOR: "기습적인 추가 청구서 걱정 없이, 건물 관리비와 공과금 예상액을 사전에 투명하게 공개합니다.",
    ENG: "No unexpected bills at month-end. Building maintenance (IPL) and estimated utilities are fully detailed.",
  },
  "pillar.3_title": {
    ID: "Titik Presisi Geospasial",
    KOR: "정밀 지리공간(GPS) 좌표",
    ENG: "Precise Geospatial GPS Pinpoint",
  },
  "pillar.3_desc": {
    ID: "Koordinat nyata di peta dengan sistem query PostGIS terintegrasi untuk akurasi navigasi dan fasilitas sekitar.",
    KOR: "PostGIS 공간 쿼리로 실제 위치와 주변 인프라(지하철, 마트, 학교)를 정확하게 안내합니다.",
    ENG: "Exact coordinates with integrated PostGIS queries for navigation accuracy and nearby amenities.",
  },
  "pillar.4_title": {
    ID: "Proteksi Hukum & Draft Kontrak",
    KOR: "법적 보호 & 표준 임대차 계약서",
    ENG: "Legal Protection & Standard Contract",
  },
  "pillar.4_desc": {
    ID: "Dukungan template surat perjanjian sewa menyewa yang melindungi hak penyewa serta kepastian uang jaminan kembali.",
    KOR: "임차인의 권리를 보호하고 보증금 반환을 확실히 보장하는 표준 임대 계약서를 제공합니다.",
    ENG: "Legally reviewed lease agreements safeguarding tenant rights and guaranteed security deposit return.",
  },

  // Footer
  "footer.desc": {
    ID: "Platform ekosistem properti terkurasi pertama di Indonesia dengan standar verifikasi legalitas berlapis dan transparansi biaya menyeluruh. Bebas biaya siluman, bebas sengketa.",
    KOR: "다층 법적 검증과 비용 투명성을 갖춘 인도네시아 최초의 큐레이션 부동산 플랫폼. 숨겨진 비용 없이 안전하게 계약하세요.",
    ENG: "Indonesia's premier verified property platform with rigorous legal verification and complete cost transparency. Zero hidden fees, zero disputes.",
  },
  "footer.prop_explore": {
    ID: "Jelajah Properti",
    KOR: "매물 둘러보기",
    ENG: "Explore Properties",
  },
  "footer.popular_areas": {
    ID: "Area Favorit",
    KOR: "인기 지역",
    ENG: "Popular Areas",
  },
  "footer.help_support": {
    ID: "Layanan Bantuan",
    KOR: "고객 지원",
    ENG: "Help & Support",
  },
  "footer.rights": {
    ID: "Seluruh hak cipta dilindungi.",
    KOR: "모든 권리 보유.",
    ENG: "All rights reserved.",
  },

  // Login Page
  "login.title": {
    ID: "Masuk ke Studio Pemilik",
    KOR: "소유자 스튜디오 로그인",
    ENG: "Sign In to Owner Studio",
  },
  "login.subtitle": {
    ID: "Kelola listing sewa, pantau leads prospek WhatsApp, dan perbarui paket iklan Anda.",
    KOR: "임대 매물 관리, WhatsApp 고객 문의 추적 및 광고 패키지를 관리하세요.",
    ENG: "Manage rental listings, track WhatsApp leads, and manage your ad packages.",
  },
  "login.quick_demo": {
    ID: "Akses Cepat Demo Mitra Pemilik",
    KOR: "원클릭 데모 파트너 로그인",
    ENG: "1-Click Demo Partner Access",
  },
  "login.quick_demo_sub": {
    ID: "1-Klik langsung masuk (sesi dihapus saat browser ditutup)",
    KOR: "1-클릭 즉시 접속 (브라우저 종료 시 세션 자동 삭제)",
    ENG: "1-Click instant access (session wiped when browser closes)",
  },
  "login.with_google": {
    ID: "Lanjutkan dengan Akun Google",
    KOR: "Google 계정으로 계속",
    ENG: "Continue with Google Account",
  },
  "login.or_email": {
    ID: "atau gunakan email",
    KOR: "또는 이메일로 로그인",
    ENG: "or continue with email",
  },
  "login.email_label": {
    ID: "Alamat Email Mitra",
    KOR: "파트너 이메일 주소",
    ENG: "Partner Email Address",
  },
  "login.password_label": {
    ID: "Kata Sandi",
    KOR: "비밀번호",
    ENG: "Password",
  },
  "login.forgot_password": {
    ID: "Lupa sandi?",
    KOR: "비밀번호 찾기",
    ENG: "Forgot password?",
  },
  "login.remember_until_close": {
    ID: "Ingat perangkat ini sampai browser ditutup",
    KOR: "브라우저 종료 시까지 로그인 상태 유지",
    ENG: "Remember this device until browser closes",
  },
  "login.submit_btn": {
    ID: "Masuk ke Dashboard Owner",
    KOR: "소유자 대시보드 입장",
    ENG: "Enter Owner Dashboard",
  },
  "login.not_registered": {
    ID: "Belum terdaftar sebagai pemilik properti?",
    KOR: "아직 매물 소유자로 등록하지 않으셨나요?",
    ENG: "Not yet registered as a property owner?",
  },
  "login.see_pricing": {
    ID: "Lihat Paket Iklan",
    KOR: "광고 패키지 확인",
    ENG: "View Ad Packages",
  },
  "login.security_note": {
    ID: "Keamanan Data & Privasi Terproteksi Enkripsi SSL 256-bit",
    KOR: "256비트 SSL 암호화로 데이터 및 개인정보가 안전하게 보호됩니다",
    ENG: "Data security and privacy protected by 256-bit SSL encryption",
  },

  // Pricing Page
  "pricing.title": {
    ID: "Pilih Paket Sewa Lapak Iklan",
    KOR: "부동산 광고 패키지 선택",
    ENG: "Choose Your Rental Listing Plan",
  },
  "pricing.subtitle": {
    ID: "Pasang properti Anda dan jangkau ribuan calon penyewa langsung ke WhatsApp Anda tanpa perantara rumit.",
    KOR: "Tapak에 매물을 등록하고 복잡한 중개인 없이 WhatsApp으로 잠재 임차인과 즉시 소통하세요.",
    ENG: "List your property on Tapak and connect directly with verified renters via WhatsApp with zero middlemen.",
  },

  // Common buttons
  "btn.see_all": {
    ID: "Lihat Semua",
    KOR: "전체 보기",
    ENG: "See All",
  },
  "btn.detail": {
    ID: "Lihat Detail",
    KOR: "상세보기",
    ENG: "View Details",
  },
  "btn.back": {
    ID: "Kembali",
    KOR: "뒤로가기",
    ENG: "Back",
  },
  "btn.back_to_web": {
    ID: "← Kembali ke Web",
    KOR: "← 웹사이트로 돌아가기",
    ENG: "← Back to Web",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "ID",
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ID");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tapak_language") as Language | null;
      if (saved && (saved === "ID" || saved === "KOR" || saved === "ENG")) {
        setLanguageState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("tapak_language", lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string, fallback?: string): string => {
    const entry = TRANSLATIONS[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
