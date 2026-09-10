"use client";

import React, { useEffect, useRef } from "react";
import type { AmenityPOI } from "@/app/api/properties/nearby-amenities/route";

interface NearbyAmenitiesMapProps {
  centerLat: number;
  centerLng: number;
  propertyTitle?: string;
  amenities: AmenityPOI[];
  selectedCategory: string;
  focusedPoi: AmenityPOI | null;
  heightClass?: string;
}

export default function NearbyAmenitiesMap({
  centerLat,
  centerLng,
  propertyTitle = "Lokasi Properti",
  amenities,
  selectedCategory,
  focusedPoi,
  heightClass = "h-[520px]",
}: NearbyAmenitiesMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Array<{ marker: L.Marker; poi: AmenityPOI }>>([]);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      const L = (await import("leaflet")).default;

      if (!isMounted) return;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      // Zoom control top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // OpenStreetMap clean tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);

      // Lingkaran Radius 500m
      L.circle([centerLat, centerLng], {
        color: "#3D77EE",
        weight: 1.5,
        opacity: 0.8,
        dashArray: "4, 6",
        fillColor: "#3D77EE",
        fillOpacity: 0.08,
        radius: 500,
      }).addTo(map);

      // Lingkaran Radius 1.000m
      L.circle([centerLat, centerLng], {
        color: "#0EA5E9",
        weight: 1,
        opacity: 0.6,
        dashArray: "6, 8",
        fillColor: "#0EA5E9",
        fillOpacity: 0.03,
        radius: 1000,
      }).addTo(map);

      // Central Property Pin (Teardrop Blue #3D77EE)
      const mainPinHtml = `
        <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
          <div style="width: 32px; height: 32px; background: #3D77EE; border: 2.5px solid #FFFFFF; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 2px 6px rgba(0,0,0,0.18); display: flex; align-items: center; justify-content: center;">
            <div style="width: 8px; height: 8px; background: #FFFFFF; border-radius: 50%; transform: rotate(45deg);"></div>
          </div>
        </div>
      `;
      const mainPinIcon = L.divIcon({
        html: mainPinHtml,
        className: "custom-main-pin",
        iconSize: [40, 40],
        iconAnchor: [20, 36],
      });

      const mainMarker = L.marker([centerLat, centerLng], { icon: mainPinIcon }).addTo(map);
      mainMarker.bindPopup(
        `
        <div style="padding: 4px; font-family: Inter, sans-serif;">
          <span style="background: #3D77EE; color: white; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">Lokasi Unit</span>
          <h4 style="font-weight: 700; font-size: 13px; margin: 6px 0 2px 0; color: #111827;">${propertyTitle}</h4>
          <p style="font-size: 11px; color: #64748B; margin: 0;">Titik Presisi Properti</p>
        </div>
      `,
        { className: "tapak-custom-popup" }
      );

function getCategorySvg(category: string): string {
  switch (category.toUpperCase()) {
    case "TRANSPORT":
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15V7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8"/><path d="m4 11 16 0"/><path d="M8 19l-2 3"/><path d="M16 19l2 3"/><circle cx="9" cy="15" r="1"/><circle cx="15" cy="15" r="1"/></svg>`;
    case "HEALTH":
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/></svg>`;
    case "EDUCATION":
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`;
    case "WORSHIP":
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/></svg>`;
    case "SHOPPING":
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
    default:
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
  }
}

      // Render POI markers
      const markerList: Array<{ marker: L.Marker; poi: AmenityPOI }> = [];

      amenities.forEach((poi) => {
        const svgIcon = getCategorySvg(poi.category);
        const poiPinHtml = `
          <div style="width: 28px; height: 28px; background: ${poi.color}; border: 2px solid #FFFFFF; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.18); display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${svgIcon}
          </div>
        `;
        const poiIcon = L.divIcon({
          html: poiPinHtml,
          className: "poi-custom-pin",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([poi.latitude, poi.longitude], { icon: poiIcon });

        marker.bindPopup(
          `
          <div style="padding: 4px; font-family: Inter, sans-serif;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <span style="color: #3D77EE; font-weight: 700; font-size: 10px; text-transform: uppercase;">${poi.categoryLabel}</span>
              <span style="font-weight: 800; font-size: 11px; color: #111827; background: #F1F5F9; padding: 1px 6px; border-radius: 4px;">${poi.distanceFormatted}</span>
            </div>
            <h4 style="font-weight: 700; font-size: 13px; color: #0F172A; margin: 4px 0 2px 0;">${poi.name}</h4>
            <p style="font-size: 11px; color: #3D77EE; font-weight: 600; margin: 0;">Jarak: ${poi.durationFormatted}</p>
          </div>
        `,
          { className: "tapak-custom-popup" }
        );

        marker.addTo(map);
        markerList.push({ marker, poi });
      });

      markersRef.current = markerList;
      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [centerLat, centerLng, amenities, propertyTitle]);

  // Filter visibility of POI markers based on selectedCategory
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach(({ marker, poi }) => {
      const isVisible =
        selectedCategory === "all" || poi.category.toLowerCase() === selectedCategory.toLowerCase();

      if (isVisible) {
        if (!map.hasLayer(marker)) map.addLayer(marker);
      } else {
        if (map.hasLayer(marker)) map.removeLayer(marker);
      }
    });
  }, [selectedCategory]);

  // FlyTo focused POI when user clicks "Lihat di peta"
  useEffect(() => {
    if (!focusedPoi || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    map.flyTo([focusedPoi.latitude, focusedPoi.longitude], 17, { duration: 0.8 });

    const item = markersRef.current.find((m) => m.poi.id === focusedPoi.id);
    if (item) {
      setTimeout(() => {
        item.marker.openPopup();
      }, 850);
    }
  }, [focusedPoi]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([centerLat, centerLng], 15, { duration: 0.8 });
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-[18px] overflow-hidden border border-[#E2E8F0] bg-slate-50 flex flex-col`}>
      {/* Map Root Div */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Property Label */}
      <div className="absolute top-3.5 left-3.5 z-[400] bg-white px-3 py-2 rounded-xl border border-[#E2E8F0] shadow-2xs pointer-events-none flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#3D77EE]" />
        <div>
          <p className="text-xs font-bold text-[#111827] leading-tight">Titik Properti Utama</p>
          <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{propertyTitle}</p>
        </div>
      </div>

      {/* Recenter Button */}
      <button
        type="button"
        onClick={handleRecenter}
        className="absolute bottom-3.5 left-3.5 z-[400] bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-[#E2E8F0] shadow-2xs text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-[#3D77EE]" />
        <span>Pusatkan Peta</span>
      </button>

      {/* Helper text on bottom-right */}
      <div className="absolute bottom-3.5 right-3.5 z-[400] bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0] shadow-2xs text-[11px] text-slate-600 hidden sm:flex items-center gap-1.5 pointer-events-none">
        <span>Klik pin untuk melihat rincian jarak</span>
      </div>
    </div>
  );
}
