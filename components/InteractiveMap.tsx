"use client";

import React, { useEffect, useRef, useMemo } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { ListingItem, BoundsFilter } from "@/lib/types";
import { formatRupiah, debounce } from "@/lib/utils";

interface InteractiveMapProps {
  listings: ListingItem[];
  selectedListingId?: string | null;
  onSelectListing?: (id: string) => void;
  onViewDetail?: (id: string) => void;
  onBoundsChange?: (bounds: BoundsFilter) => void;
  center?: [number, number];
  zoom?: number;
}

export default function InteractiveMap({
  listings,
  selectedListingId,
  onSelectListing,
  onViewDetail,
  onBoundsChange,
  center = [-6.2368, 106.8087],
  zoom = 12,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, LeafletMarker>>({});

  const debouncedBoundsChange = useMemo(
    () =>
      debounce((map: LeafletMap) => {
        if (!onBoundsChange || !map) return;
        const bounds = map.getBounds();
        onBoundsChange({
          minLat: bounds.getSouth(),
          minLng: bounds.getWest(),
          maxLat: bounds.getNorth(),
          maxLng: bounds.getEast(),
        });
      }, 300),
    [onBoundsChange]
  );

  useEffect(() => {
    async function initMap() {
      if (!mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const container = mapContainerRef.current as unknown as { _leaflet_id?: unknown };
      if (container._leaflet_id) {
        delete container._leaflet_id;
      }

      const L = (await import("leaflet")).default;

      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      map.on("moveend", () => debouncedBoundsChange(map));
      map.on("zoomend", () => debouncedBoundsChange(map));

      mapInstanceRef.current = map;
      renderMarkers(L, map);
    }

    function renderMarkers(L: typeof import("leaflet"), map: LeafletMap) {
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      if (!listings?.length) return;

      listings.forEach((item, index) => {
        const isSelected = selectedListingId === item.id;
        const customIcon = L.divIcon({
          className: "tapak-leaflet-icon",
          html: `
            <div class="tapak-pin ${isSelected ? "active" : ""}" style="width: 36px; height: 36px; background-color: ${isSelected ? "#2B55AB" : "#3D77EE"}; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(61,119,238,0.45); border: 2.5px solid #FFFFFF;">
              <span style="transform: rotate(45deg); color: #FFFFFF; font-weight: 700; font-size: 13px;">${index + 1}</span>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        });

        const marker = L.marker([item.latitude, item.longitude], { icon: customIcon }).addTo(map);

        const popupContent = `
          <div style="font-family: var(--font-inter), sans-serif; padding: 4px; max-width: 220px;">
            <div style="font-size: 10px; font-weight: 700; color: #3D77EE; text-transform: uppercase; margin-bottom: 2px;">
              ${item.property_type} • ${item.district}
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 4px; line-height: 1.3;">
              ${item.title}
            </div>
            <div style="font-size: 14px; font-weight: 800; color: #111827;">
              ${formatRupiah(item.price)}<span style="font-size: 11px; font-weight: 400; color: #687280;">/bln</span>
            </div>
            <div style="margin-top: 6px;">
              <button onclick="window.__tapak_open_detail && window.__tapak_open_detail('${item.id}')" style="display: inline-block; background: #3D77EE; color: white; border: none; padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">Lihat Detail di Panel</button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on("click", () => onSelectListing?.(item.id));
        markersRef.current[item.id] = marker;
      });

      const mockClusterCoord: [number, number] = [-6.2300, 106.8120];
      const clusterIcon = L.divIcon({
        className: "tapak-leaflet-cluster",
        html: `
          <div class="tapak-cluster-pin" style="width: 44px; height: 44px; background-color: #3D77EE; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(61,119,238,0.5); border: 3px solid #FFFFFF;">
            <span style="transform: rotate(45deg); color: #FFFFFF; font-weight: 800; font-size: 14px;">4+</span>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
      });

      const clusterMarker = L.marker(mockClusterCoord, { icon: clusterIcon }).addTo(map);
      clusterMarker.bindTooltip("Cluster Kawasan SCBD: 4 Hunian Terverifikasi", { direction: "top" });
      clusterMarker.on("click", () => map.setView(mockClusterCoord, 14));
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, debouncedBoundsChange, listings, selectedListingId, onSelectListing]);

  useEffect(() => {
    if (selectedListingId && mapInstanceRef.current && markersRef.current[selectedListingId]) {
      const selected = listings.find((item) => item.id === selectedListingId);
      if (selected) {
        mapInstanceRef.current.setView([selected.latitude, selected.longitude], 14, { animate: true });
        markersRef.current[selectedListingId].openPopup();
      }
    }
  }, [selectedListingId, listings]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { __tapak_open_detail?: (id: string) => void }).__tapak_open_detail = (id: string) => {
        onViewDetail?.(id);
      };
    }
  }, [onViewDetail]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-[18px] overflow-hidden border border-slate-200/80 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-[10px] border border-slate-200 shadow-md text-xs flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#3D77EE]" />
        <span className="font-semibold text-[#111827]">Pin Biru:</span>
        <span className="text-[#687280]">Hunian Terverifikasi Tapak.</span>
      </div>
    </div>
  );
}
