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
  CheckSquare,
} from "lucide-react";
import type { AmenityPOI } from "@/app/api/properties/nearby-amenities/route";

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
  const [formData, setFormData] = useState({
    title: "Apartemen Kalibata City Studio Full Furnished",
    property_type: "Apartemen",
    price: "4500000",
    deposit: "4500000",
    maintenance_fee: "450000",
    utility_estimate: "350000",
    description:
      "Unit apartemen studio full furnished dengan pemandangan kota yang menawan. Dilengkapi AC, kulkas, kasur queen size, lemari pakaian, dan kitchen set modern siap huni langsung.",
    address: "Jl. Raya Kalibata No. 1, Rawajati",
    city: "Jakarta Selatan",
    district: "Pancoran",
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 33,
    agent_name: "Mitra Pemilik Oim",
    agent_phone: "6281234567890",
    imageUrl: PRESET_IMAGES[0],
  });

  // Selected unit amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "AC Dingin",
    "WiFi Cepat",
    "Kitchen Set",
    "Keamanan 24 Jam & CCTV",
  ]);

  // Coordinates State
  const [coords, setCoords] = useState({
    lat: -6.2558,
    lng: 106.8542,
  });

  // Nearby Amenities Auto-detection State
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

      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        deposit: formData.deposit ? Number(formData.deposit) : null,
        maintenance_fee: formData.maintenance_fee ? Number(formData.maintenance_fee) : null,
        utility_estimate: formData.utility_estimate ? Number(formData.utility_estimate) : null,
        verification_tier: "SILVER",
        property_type: formData.property_type,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area_sqm: Number(formData.area_sqm),
        address: formData.address,
        district: formData.district,
        city: formData.city,
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

      alert("Listing baru dan fasilitas sekitar berhasil disimpan ke database!");
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
            Tambah Properti &amp; Deteksi Fasilitas Sekitar
          </h1>
          <p className="text-xs text-slate-500">
            Data yang diinput akan otomatis tersimpan ke database PostgreSQL Supabase dan tayang di Explore.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Informasi Properti */}
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-[#3D77EE]" />
            <h2 className="text-sm sm:text-base font-bold text-[#111827]">
              1. Informasi Dasar Unit Properti
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-[#111827] block mb-1">Judul Iklan Properti *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Tipe Properti *</label>
              <select
                value={formData.property_type}
                onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
              >
                <option value="Apartemen">Apartemen</option>
                <option value="Rumah">Rumah</option>
                <option value="Ruko">Ruko &amp; Komersial</option>
                <option value="Kost">Kost Eksklusif</option>
                <option value="Vila">Vila Tropis</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Harga Sewa / Bulan (Rp) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Deposit Jaminan (Rp)</label>
              <input
                type="number"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                placeholder="Contoh: 4500000"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">IPL / Biaya Pemeliharaan (Rp/bln)</label>
              <input
                type="number"
                value={formData.maintenance_fee}
                onChange={(e) => setFormData({ ...formData, maintenance_fee: e.target.value })}
                placeholder="Contoh: 450000"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Estimasi Biaya Utilitas (Rp/bln)</label>
              <input
                type="number"
                value={formData.utility_estimate}
                onChange={(e) => setFormData({ ...formData, utility_estimate: e.target.value })}
                placeholder="Contoh: 350000"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Luas Unit (m²) *</label>
              <input
                type="number"
                value={formData.area_sqm}
                onChange={(e) => setFormData({ ...formData, area_sqm: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Jumlah Kamar Tidur *</label>
              <input
                type="number"
                min={1}
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Jumlah Kamar Mandi *</label>
              <input
                type="number"
                min={1}
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-[#111827] block mb-1">Deskripsi Lengkap Unit *</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>
          </div>
        </section>

        {/* Step 2: Lokasi & Wilayah */}
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-[#3D77EE]" />
            <h2 className="text-sm sm:text-base font-bold text-[#111827]">
              2. Alamat &amp; Wilayah Properti
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-[#111827] block mb-1">Alamat Lengkap *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] block mb-1">Kecamatan / Area (District) *</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Contoh: Pancoran, SCBD, BSD City"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
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
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>
          </div>
        </section>

        {/* Step 3: Fasilitas Unit & Foto */}
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-[#3D77EE]" />
            <h2 className="text-sm sm:text-base font-bold text-[#111827]">
              3. Fasilitas Unit &amp; Foto Utama
            </h2>
          </div>

          <div>
            <label className="font-bold text-[#111827] block mb-2 text-xs">Pilih Fasilitas Unit</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleUnitAmenity(amenity)}
                    className={`p-2 rounded-lg border text-left text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
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
          </div>

          <div className="pt-2 text-xs">
            <label className="font-bold text-[#111827] block mb-1">URL Foto Utama Properti</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
              placeholder="https://images.unsplash.com/..."
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
        </section>

        {/* Step 4: Kontak Pemilik / Agen */}
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Phone className="w-4 h-4 text-[#3D77EE]" />
            <h2 className="text-sm sm:text-base font-bold text-[#111827]">
              4. Kontak Agen / Pemilik Unit
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#111827] block mb-1">Nama Lengkap Pemilik / Agen *</label>
              <input
                type="text"
                value={formData.agent_name}
                onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
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
                className="w-full p-2.5 rounded-xl border border-slate-200 text-[#111827] focus:outline-none focus:border-[#3D77EE]"
                required
              />
            </div>
          </div>
        </section>

        {/* Step 5: Peta Lokasi & Deteksi Otomatis Fasilitas Sekitar */}
        <section className="bg-white rounded-[18px] border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#3D77EE]" />
              <h2 className="text-sm sm:text-base font-bold text-[#111827]">
                5. Peta Presisi &amp; Deteksi Otomatis Fasilitas Sekitar
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#3D77EE] bg-blue-50 px-2.5 py-1 rounded-lg">
              <span>Lat: {coords.lat}</span>
              <span>•</span>
              <span>Lng: {coords.lng}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Geser pin di bawah untuk menyesuaikan koordinat tepat unit Anda. Sistem akan otomatis memindai fasilitas umum dalam radius 1 km via OpenStreetMap.
          </p>

          {/* Peta Pin Draggable */}
          <DraggableLocationMap
            initialLat={coords.lat}
            initialLng={coords.lng}
            onLocationChange={handleLocationChange}
          />

          {/* Checklist Fasilitas yang Terdeteksi Otomatis */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3D77EE]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#111827]">
                  Fasilitas Terdeteksi Otomatis ({selectedAmenityIds.size} dari {detectedAmenities.length} Terpilih)
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

            {/* Checklist Grid */}
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

                    {/* Custom Checkbox Pill */}
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
                Fasilitas yang dicentang akan otomatis disimpan ke tabel database dan ditampilkan pada halaman detail properti publik dan peta interaktif Tapak.
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
