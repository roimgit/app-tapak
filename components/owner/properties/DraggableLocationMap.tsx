"use client";

import React, { useEffect, useRef } from "react";

interface DraggableLocationMapProps {
  initialLat: number;
  initialLng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function DraggableLocationMap({
  initialLat,
  initialLng,
  onLocationChange,
}: DraggableLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!mapContainerRef.current) return;
      const L = (await import("leaflet")).default;

      if (!isMounted) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Main pin HTML (draggable)
      const pinHtml = `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: grab;">
          <div style="position: absolute; width: 44px; height: 44px; background: rgba(61, 119, 238, 0.25); border-radius: 50%;"></div>
          <div style="width: 34px; height: 34px; background: #3D77EE; border: 3px solid #FFFFFF; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 12px rgba(61, 119, 238, 0.4); display: flex; align-items: center; justify-content: center;">
            <div style="width: 10px; height: 10px; background: #FFFFFF; border-radius: 50%; transform: rotate(45deg);"></div>
          </div>
        </div>
      `;

      const pinIcon = L.divIcon({
        html: pinHtml,
        className: "custom-draggable-pin",
        iconSize: [44, 44],
        iconAnchor: [22, 38],
      });

      const marker = L.marker([initialLat, initialLng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);

      marker.bindTooltip("Geser pin ini untuk menentukan lokasi properti", {
        permanent: true,
        direction: "top",
        className: "bg-white font-bold text-xs shadow-sm rounded-lg py-1 px-2 border border-slate-200",
      });

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onLocationChange(pos.lat, pos.lng);
      });

      map.on("click", (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        onLocationChange(e.latlng.lat, e.latlng.lng);
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    init();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialLat, initialLng, onLocationChange]);

  return (
    <div className="relative w-full h-[360px] rounded-[18px] overflow-hidden border border-slate-200/80 bg-slate-50 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-[11px] text-slate-600 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#3D77EE]" />
        <span>Geser pin atau klik peta untuk pindah lokasi</span>
      </div>
    </div>
  );
}
