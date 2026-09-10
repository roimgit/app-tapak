"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Sparkles,
  Check,
  CheckCircle2,
  RefreshCw,
  Info,
  DollarSign,
  Maximize2,
  Phone,
  Image as ImageIcon,
  ShieldCheck,
  EyeOff,
  Handshake,
  Video,
  Play,
  FileText,
  Sliders,
} from "lucide-react";
import type { AmenityPOI } from "@/app/api/properties/nearby-amenities/route";
import { TransactionType, CertificateType, PriceStatus, PaymentMethod } from "@/lib/types";

const DraggableLocationMap = dynamic(
  () => import("@/components/owner/properties/DraggableLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] rounded-[18px] bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 gap-2 border border-slate-200">
        <RefreshCw className="w-5 h-5 animate-spin text-[#3D77EE]" />
        <span className="text-xs font-semibold">Memuat Peta Interaktif...</span>
      </div>
    ),
  }
);

const AVAILABLE_AMENITIES = [
  "AC Dingin",
  "WiFi Cepat",
  "Kolam Renang",
  "Pusat Kebugaran / Gym",
  "Slot Parkir Mobil",
  "Kitchen Set",
  "Keamanan 24 Jam & CCTV",
  "Balkon",
  "Water Heater",
  "Mesin Cuci",
  "Kartu Akses Lift",
  "Smart Home System",
  "Rooftop Terrace",
  "Taman Pribadi",
];

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
];

export default function NewPropertyPage() {
  const router = useRouter();

  // Basic Form State
  const [transactionType, setTransactionType] = useState<TransactionType>("DISEWAKAN");
  const [formData, setFormData] = useState({
    title: "Apartemen Kalibata City Studio Full Furnished",
    property_type: "Apartemen",
    // Finansial Sewa
    rental_price: "4500000",
    deposit: "4500000",
    maintenance_fee: "450000",
    utility_estimate: "350000",
    // Finansial Jual
    sale_price: "1500000000",
    price_status: "NEGO" as PriceStatus,
    certificate_type: "SHM" as CertificateType,
    // Deskripsi & Alamat
    description:
      "Unit hunian terawat dengan pencahayaan alami optimal dan sirkulasi udara sejuk. Berlokasi sangat strategis dengan akses transportasi publik prima dan fasilitas lengkap siap huni.",
    address: "Jl. Raya Kalibata No. 1, Rawajati",
    city: "Jakarta Selatan",
    district: "Pancoran",
    // Dimensi
    area_sqm: 36,
    land_area_sqm: "",
    bedrooms: 1,
    bathrooms: 1,
    // Spesifikasi Teknis
    garage: "",
    carport: "",
    electricity: "2200W",
    facing: "Utara",
    furnishing: "Full-Furnished",
    water_source: "PAM",
    // Media Tambahan
    imageUrl: PRESET_IMAGES[0],
    virtual_tour_url: "",
    youtube_url: "",
    floor_plan_url: "",
    // Privasi & Co-Broking
    is_private: false,
    co_broking_enabled: false,
    co_broking_commission: "2.5",
    // Agen
    agent_name: "Mitra Pemilik Tapak",
    agent_phone: "6281234567890",
  });

  // Opsi Pembayaran untuk Listing DIJUAL
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    "BISA_KPR",
    "CASH_KERAS",
    "CASH_BERTAHAP",
  ]);

  // Fasilitas Unit
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "AC Dingin",
    "WiFi Cepat",
    "Kitchen Set",
    "Keamanan 24 Jam & CCTV",
  ]);

  // Koordinat Peta
  const [coords, setCoords] = useState({
    lat: -6.2558,
    lng: 106.8542,
  });

  // Deteksi Fasilitas OSM
  const [detectedAmenities, setDetectedAmenities] = useState<AmenityPOI[]>([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<Set<string>>(new Set());
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced fetch nearby amenities
  const fetchAmenitiesDebounced = useCallback((lat: number, lng: number) => {
    setIsDetecting(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/properties/nearby-amenities?lat=${lat}&lng=${lng}&radius=1000`
        );
        if (!res.ok) throw new Error("Gagal mendeteksi fasilitas");
        const data = await res.json();
        if (data.amenities) {
          setDetectedAmenities(data.amenities);
          setSelectedAmenityIds(new Set(data.amenities.map((a: AmenityPOI) => a.id)));
        }
      } catch (err) {
        console.error("Auto-detect amenities error:", err);
      } finally {
        setIsDetecting(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    fetchAmenitiesDebounced(coords.lat, coords.lng);
  }, [coords.lat, coords.lng, fetchAmenitiesDebounced]);

  const handleLocationChange = (lat: number, lng: number) => {
    setCoords({ lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) });
  };

  const togglePaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenityIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedAmenityIds.size === detectedAmenities.length) {
      setSelectedAmenityIds(new Set());
    } else {
      setSelectedAmenityIds(new Set(detectedAmenities.map((a) => a.id)));
    }
  };

  const toggleUnitAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const chosenAmenities = detectedAmenities.filter((a) => selectedAmenityIds.has(a.id));

      const isDijual = transactionType === "DIJUAL";
      const price = isDijual ? Number(formData.sale_price) : Number(formData.rental_price);

      // Construct specs JSON object
      const specs: Record<string, any> = {};
      if (formData.garage) specs.garage = Number(formData.garage);
      if (formData.carport) specs.carport = Number(formData.carport);
      if (formData.electricity) specs.electricity = formData.electricity;
      if (formData.facing) specs.facing = formData.facing;
      if (formData.furnishing) specs.furnishing = formData.furnishing;
      if (formData.water_source) specs.water_source = formData.water_source;
      if (formData.virtual_tour_url) specs.virtual_tour_url = formData.virtual_tour_url;
      if (formData.youtube_url) specs.youtube_url = formData.youtube_url;
      if (formData.floor_plan_url) specs.floor_plan_url = formData.floor_plan_url;

      const payload = {
        title: formData.title,
        description: formData.description,
        transaction_type: transactionType,
        price,
        deposit: !isDijual && formData.deposit ? Number(formData.deposit) : null,
        maintenance_fee: !isDijual && formData.maintenance_fee ? Number(formData.maintenance_fee) : null,
        utility_estimate: !isDijual && formData.utility_estimate ? Number(formData.utility_estimate) : null,
        certificate_type: isDijual ? formData.certificate_type : undefined,
        price_status: isDijual ? formData.price_status : undefined,
        payment_methods: isDijual ? paymentMethods : [],
        verification_tier: "SILVER",
        property_type: formData.property_type,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area_sqm: Number(formData.area_sqm),
        land_area_sqm: formData.land_area_sqm ? Number(formData.land_area_sqm) : null,
        address: formData.address,
        district: formData.district,
        city: formData.city,
        specs: Object.keys(specs).length > 0 ? specs : undefined,
        is_private: formData.is_private,
        co_broking_enabled: formData.co_broking_enabled,
        co_broking_commission:
          formData.co_broking_enabled && formData.co_broking_commission
            ? Number(formData.co_broking_commission)
            : null,
        latitude: coords.lat,
        longitude: coords.lng,
        images: [formData.imageUrl || PRESET_IMAGES[0]],
        amenities: selectedAmenities,
        agent_name: formData.agent_name,
        agent_phone: formData.agent_phone,
        nearby_amenities: chosenAmenities.map((a) => ({
          category: a.category,
          name: a.name,
          distance: a.distanceFormatted,
          duration: a.durationFormatted,
          latitude: a.latitude,
          longitude: a.longitude,
        })),
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan properti");
      }

      alert("Listing properti berhasil diterbitkan ke database Tapak!");
      router.push("/owner/properti");
    } catch (err: any) {
      console.error("Submit listing error:", err);
      alert(err.message || "Terjadi kendala saat menyimpan listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Form */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/owner/properti"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#111827] hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            Tambah Listing Properti Baru
          </h1>
          <p className="text-xs text-slate-500">
            Dukung transaksi Sewa maupun Jual-Beli dengan data legalitas transparan dan spesifikasi presisi.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Model Transaksi & Informasi Dasar */}
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-[#3D77EE]" />
            <h2 className="text-sm sm:text-base font-bold text-[#111827]">
              1. Model Transaksi &amp; Informasi Unit
            </h2>
          </div>

          {/* Sakelar Model Transaksi: DISEWAKAN vs DIJUAL */}
          <div>
            <label className="font-bold text-[#111827] block mb-2 text-xs">
              Pilih Model Transaksi *
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => {
                  setTransactionType("DISEWAKAN");
                  if (formData.title.includes("Rumah Mewah")) {
                    setFormData((prev) => ({
                      ...prev,
                      title: "Apartemen Kalibata City Studio Full Furnished",
                      property_type: "Apartemen",
                    }));
                  }
                }}
                className={`py-3 px-4 rounded-[10px] text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  transactionType === "DISEWAKAN"
                    ? "bg-blue-50 border-[#3D77EE] text-[#3D77EE] shadow-2xs ring-1 ring-[#3D77EE]"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    transactionType === "DISEWAKAN"
                      ? "border-[#3D77EE] bg-[#3D77EE]"
                      : "border-slate-400"
                  }`}
                />
                <span>Disewakan (Rental Bulanan/Tahunan)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTransactionType("DIJUAL");
                  if (formData.title.includes("Kalibata City")) {
                    setFormData((prev) => ({
                      ...prev,
                      title: "Rumah Mewah Pondok Indah 4BR Hook SHM",
                      property_type: "Rumah",
                    }));
                  }
                }}
                className={`py-3 px-4 rounded-[10px] text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  transactionType === "DIJUAL"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-700 shadow-2xs ring-1 ring-emerald-600"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    transactionType === "DIJUAL"
                      ? "border-emerald-600 bg-emerald-600"
                      : "border-slate-400"
                  }`}
                />
                <span>Dijual (Transaksi Capital Value)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="sm:col-span-2">
              <label className="font-bold text-[#111827] block mb-1">Judul Iklan Properti *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Tipe Properti *</label>
              <select
                value={formData.property_type}
                onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
              >
                <option value="Apartemen">Apartemen</option>
                <option value="Rumah">Rumah Tapak</option>
                <option value="Ruko">Ruko &amp; Komersial</option>
                <option value="Kost">Kost Eksklusif</option>
                <option value="Vila">Vila Tropis</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-[#111827] block mb-1">Deskripsi Lengkap Unit *</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>
          </div>
        </section>

        {/* Step 2: Skema Finansial & Legalitas */}
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-[#3D77EE]" />
            <h2 className="text-sm sm:text-base font-bold text-[#111827]">
              2. Skema Finansial &amp; Legalitas Properti ({transactionType === "DIJUAL" ? "Mode Dijual" : "Mode Sewa"})
            </h2>
          </div>

          {transactionType === "DISEWAKAN" ? (
            /* Formulir Finansial SEWA */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-[#111827] block mb-1">
                  Harga Sewa / Bulan (Rp) *
                </label>
                <input
                  type="number"
                  value={formData.rental_price}
                  onChange={(e) => setFormData({ ...formData, rental_price: e.target.value })}
                  className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#111827] block mb-1">
                  Deposit Jaminan (Rp)
                </label>
                <input
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                  placeholder="Contoh: 4500000"
                  className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                />
              </div>

              <div>
                <label className="font-bold text-[#111827] block mb-1">
                  IPL / Biaya Pemeliharaan (Rp/bln)
                </label>
                <input
                  type="number"
                  value={formData.maintenance_fee}
                  onChange={(e) => setFormData({ ...formData, maintenance_fee: e.target.value })}
                  placeholder="Contoh: 450000"
                  className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                />
              </div>

              <div>
                <label className="font-bold text-[#111827] block mb-1">
                  Estimasi Biaya Utilitas (Rp/bln)
                </label>
                <input
                  type="number"
                  value={formData.utility_estimate}
                  onChange={(e) => setFormData({ ...formData, utility_estimate: e.target.value })}
                  placeholder="Contoh: 350000"
                  className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                />
              </div>
            </div>
          ) : (
            /* Formulir Finansial JUAL */
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-[#111827] block mb-1">
                    Harga Jual Total (Rp) *
                  </label>
                  <input
                    type="number"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                    placeholder="Contoh: 15000000000"
                    className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#111827] block mb-1">Status Harga *</label>
                  <select
                    value={formData.price_status}
                    onChange={(e) =>
                      setFormData({ ...formData, price_status: e.target.value as PriceStatus })
                    }
                    className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                  >
                    <option value="NEGO">Bisa Nego (Negotiable)</option>
                    <option value="NETT">Harga Nett (Fixed)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#111827] block mb-1">Jenis Sertifikat *</label>
                  <select
                    value={formData.certificate_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificate_type: e.target.value as CertificateType,
                      })
                    }
                    className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                  >
                    <option value="SHM">SHM (Sertifikat Hak Milik)</option>
                    <option value="SHGB">SHGB (Sertifikat Hak Guna Bangunan)</option>
                    <option value="HGB">HGB (Hak Guna Bangunan)</option>
                    <option value="STRATA_TITLE">Strata Title (PPJB Apartemen)</option>
                    <option value="GIRIK">Girik / Letter C</option>
                    <option value="BELUM_BERSERTIFIKAT">Belum Bersertifikat</option>
                  </select>
                </div>
              </div>

              {/* Multi-checkbox Opsi Pembayaran */}
              <div>
                <label className="font-bold text-[#111827] block mb-2">
                  Metode Pembayaran yang Diterima
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { id: "BISA_KPR", label: "Bisa KPR Bank" },
                    { id: "CASH_KERAS", label: "Cash Keras (Lunas Sekaligus)" },
                    { id: "CASH_BERTAHAP", label: "Cash Bertahap (Cicilan Developer)" },
                  ].map((item) => {
                    const active = paymentMethods.includes(item.id as PaymentMethod);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => togglePaymentMethod(item.id as PaymentMethod)}
                        className={`px-3.5 py-2 rounded-[8px] border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                          active
                            ? "bg-blue-50 border-[#3D77EE] text-[#3D77EE]"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                            active ? "bg-[#3D77EE] text-white" : "border border-slate-300"
                          }`}
                        >
                          {active && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Step 3: Luas & Spesifikasi Teknis Properti */}
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Maximize2 className="w-4 h-4 text-[#3D77EE]" />
            <h2 className="text-sm sm:text-base font-bold text-[#111827]">
              3. Luas &amp; Spesifikasi Teknis Bangunan
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#111827] block mb-1">Luas Bangunan (LB m²) *</label>
              <input
                type="number"
                value={formData.area_sqm}
                onChange={(e) => setFormData({ ...formData, area_sqm: Number(e.target.value) })}
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Luas Tanah (LT m²)</label>
              <input
                type="number"
                value={formData.land_area_sqm}
                onChange={(e) => setFormData({ ...formData, land_area_sqm: e.target.value })}
                placeholder="Khusus rumah / ruko"
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Kamar Tidur *</label>
              <input
                type="number"
                min={0}
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Kamar Mandi *</label>
              <input
                type="number"
                min={1}
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2 border-t border-slate-100">
            <div>
              <label className="font-bold text-[#111827] block mb-1">Slot Garasi</label>
              <input
                type="number"
                min={0}
                value={formData.garage}
                onChange={(e) => setFormData({ ...formData, garage: e.target.value })}
                placeholder="Contoh: 2"
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Slot Carport</label>
              <input
                type="number"
                min={0}
                value={formData.carport}
                onChange={(e) => setFormData({ ...formData, carport: e.target.value })}
                placeholder="Contoh: 1"
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Daya Listrik</label>
              <select
                value={formData.electricity}
                onChange={(e) => setFormData({ ...formData, electricity: e.target.value })}
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
              >
                <option value="900W">900 VA</option>
                <option value="1300W">1.300 VA</option>
                <option value="2200W">2.200 VA</option>
                <option value="3500W">3.500 VA</option>
                <option value="4400W">4.400 VA</option>
                <option value="5500W">5.500 VA</option>
                <option value="6600W">6.600 VA</option>
                <option value="11000W+">11.000 VA+</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Arah Hadap</label>
              <select
                value={formData.facing}
                onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
              >
                <option value="Utara">Utara</option>
                <option value="Timur Laut">Timur Laut</option>
                <option value="Timur">Timur</option>
                <option value="Tenggara">Tenggara</option>
                <option value="Selatan">Selatan</option>
                <option value="Barat Daya">Barat Daya</option>
                <option value="Barat">Barat</option>
                <option value="Barat Laut">Barat Laut</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Kondisi Perabotan</label>
              <select
                value={formData.furnishing}
                onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
              >
                <option value="Full-Furnished">Full-Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished (Kosongan)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Sumber Air</label>
              <select
                value={formData.water_source}
                onChange={(e) => setFormData({ ...formData, water_source: e.target.value })}
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
              >
                <option value="PAM">PAM / PDAM</option>
                <option value="Sumur Bor">Sumur Bor / Tanah</option>
                <option value="PAM & Sumur Bor">PAM &amp; Sumur Bor</option>
              </select>
            </div>
          </div>
        </section>

        {/* Step 4: Media, Tur Virtual & Denah */}
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ImageIcon className="w-4 h-4 text-[#3D77EE]" />
            <h2 className="text-sm sm:text-base font-bold text-[#111827]">
              4. Foto Utama &amp; Media Interaktif
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#111827] block mb-1">URL Foto Utama Properti *</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                placeholder="https://images.unsplash.com/..."
                required
              />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Pilihan cepat foto interior:</span>
                <div className="flex gap-2">
                  {PRESET_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: img })}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                        formData.imageUrl === img
                          ? "bg-blue-50 border-[#3D77EE] text-[#3D77EE] font-bold"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Foto {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="font-bold text-[#111827] flex items-center gap-1.5 mb-1">
                  <Video className="w-3.5 h-3.5 text-[#3D77EE]" />
                  <span>URL Virtual Tour 360° (Opsional)</span>
                </label>
                <input
                  type="url"
                  value={formData.virtual_tour_url}
                  onChange={(e) => setFormData({ ...formData, virtual_tour_url: e.target.value })}
                  placeholder="https://my.matterport.com/show/?m=..."
                  className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                />
              </div>

              <div>
                <label className="font-bold text-[#111827] flex items-center gap-1.5 mb-1">
                  <Play className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                  <span>URL YouTube Walkthrough (Opsional)</span>
                </label>
                <input
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                />
              </div>

              <div>
                <label className="font-bold text-[#111827] flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>URL Denah Lantai (Floor Plan)</span>
                </label>
                <input
                  type="url"
                  value={formData.floor_plan_url}
                  onChange={(e) => setFormData({ ...formData, floor_plan_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Step 5: Privasi & Peluang Co-Broking */}
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-[#3D77EE]" />
            <h2 className="text-sm sm:text-base font-bold text-[#111827]">
              5. Pengaturan Privasi &amp; Jaringan Co-Broking
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Toggle Mode Privasi */}
            <div className="flex items-start justify-between gap-4 p-3.5 rounded-[10px] bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-3">
                <EyeOff className="w-5 h-5 text-[#3D77EE] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#111827] block text-sm">
                    Mode Listing Rahasia / Privat
                  </span>
                  <p className="text-slate-500 mt-0.5">
                    Sembunyikan alamat lengkap unit dari publik. Calon pembeli/penyewa hanya akan melihat nama kawasan dan distrik.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.is_private}
                onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })}
                className="w-4 h-4 text-[#3D77EE] rounded border-slate-300 focus:ring-[#3D77EE] cursor-pointer mt-1"
              />
            </div>

            {/* Toggle Co-Broking */}
            <div className="p-3.5 rounded-[10px] bg-blue-50/50 border border-blue-100 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Handshake className="w-5 h-5 text-[#3D77EE] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#111827] block text-sm">
                      Buka Peluang Co-Broking untuk Agen Lain
                    </span>
                    <p className="text-slate-500 mt-0.5">
                      Beri izin kepada agen properti terlisensi lain di jaringan Tapak untuk memasarkan listing ini dengan skema komisi bersama.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.co_broking_enabled}
                  onChange={(e) => setFormData({ ...formData, co_broking_enabled: e.target.checked })}
                  className="w-4 h-4 text-[#3D77EE] rounded border-slate-300 focus:ring-[#3D77EE] cursor-pointer mt-1"
                />
              </div>

              {formData.co_broking_enabled && (
                <div className="pt-2 border-t border-blue-100 flex items-center gap-3">
                  <label className="font-bold text-[#111827] shrink-0">
                    Persentase Komisi Co-Broking (%):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="10"
                    value={formData.co_broking_commission}
                    onChange={(e) =>
                      setFormData({ ...formData, co_broking_commission: e.target.value })
                    }
                    placeholder="2.5"
                    className="w-24 p-2 rounded-[8px] bg-white border border-slate-200 text-[#111827] font-bold focus:outline-none focus:border-[#3D77EE]"
                  />
                  <span className="text-slate-500 text-[11px]">(Standar industri: 2.0% – 3.0%)</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Step 6: Fasilitas Unit */}
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-[#3D77EE]" />
            <h2 className="text-sm sm:text-base font-bold text-[#111827]">
              6. Fasilitas Utama Unit
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AVAILABLE_AMENITIES.map((amenity) => {
              const checked = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleUnitAmenity(amenity)}
                  className={`p-2 rounded-[10px] border text-left text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                    checked
                      ? "bg-blue-50 border-[#3D77EE] text-[#3D77EE]"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                      checked ? "bg-[#3D77EE] text-white" : "border border-slate-300"
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="truncate">{amenity}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 7: Alamat & Kontak Agen */}
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-[#3D77EE]" />
            <h2 className="text-sm sm:text-base font-bold text-[#111827]">
              7. Alamat &amp; Kontak Penanggung Jawab
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-[#111827] block mb-1">Alamat Lengkap *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Kecamatan / Distrik *</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Contoh: Pancoran, Pondok Indah, SCBD"
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Kota / Kabupaten *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Contoh: Jakarta Selatan, Tangerang Selatan"
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Nama Lengkap Pemilik / Agen *</label>
              <input
                type="text"
                value={formData.agent_name}
                onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Nomor WhatsApp Aktif *</label>
              <input
                type="text"
                value={formData.agent_phone}
                onChange={(e) => setFormData({ ...formData, agent_phone: e.target.value })}
                placeholder="6281234567890"
                className="w-full p-2.5 rounded-[10px] border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>
          </div>
        </section>

        {/* Step 8: Peta Lokasi & Deteksi Otomatis Fasilitas Sekitar */}
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#3D77EE]" />
              <h2 className="text-sm sm:text-base font-bold text-[#111827]">
                8. Peta Presisi &amp; Deteksi Otomatis Fasilitas Sekitar (OSM)
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#3D77EE] bg-blue-50 px-2.5 py-1 rounded-lg">
              <span>Lat: {coords.lat}</span>
              <span>•</span>
              <span>Lng: {coords.lng}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Geser pin di bawah untuk menentukan koordinat presisi. Sistem akan otomatis memindai POI publik dalam radius 1 km.
          </p>

          <DraggableLocationMap
            initialLat={coords.lat}
            initialLng={coords.lng}
            onLocationChange={handleLocationChange}
          />

          {/* Checklist Fasilitas Terdeteksi */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3D77EE]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#111827]">
                  Fasilitas Terdeteksi ({selectedAmenityIds.size} dari {detectedAmenities.length} Terpilih)
                </h3>
                {isDetecting && (
                  <span className="flex items-center gap-1 text-[11px] text-[#3D77EE] font-semibold">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Memindai POI...</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-xs font-bold text-[#3D77EE] hover:underline self-start sm:self-auto cursor-pointer"
              >
                {selectedAmenityIds.size === detectedAmenities.length ? "Batal Pilih Semua" : "Pilih Semua"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {detectedAmenities.map((amenity) => {
                const isSelected = selectedAmenityIds.has(amenity.id);
                return (
                  <div
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-blue-50/60 border-[#3D77EE]/60 shadow-2xs"
                        : "bg-white border-slate-200 hover:bg-slate-50 opacity-70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border"
                        style={{
                          backgroundColor: `${amenity.color}15`,
                          borderColor: `${amenity.color}30`,
                        }}
                      >
                        {amenity.icon}
                      </div>

                      <div className="min-w-0">
                        <span className="font-bold text-xs text-[#111827] block truncate">
                          {amenity.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <span className="font-bold text-[#3D77EE]">{amenity.distanceFormatted}</span>
                          <span>&bull;</span>
                          <span>{amenity.durationFormatted}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "bg-[#3D77EE] text-white" : "border border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>
                Fasilitas yang dicentang akan otomatis disimpan ke database PostgreSQL dan ditampilkan pada halaman detail publik Tapak.
              </p>
            </div>
          </div>
        </section>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/owner/properti"
            className="px-5 py-2.5 rounded-[10px] bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[10px] bg-[#3D77EE] hover:bg-[#2B55AB] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menyimpan ke Database...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan &amp; Publikasikan Listing</span>
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
