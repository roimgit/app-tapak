"use client";

import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useMemo } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { ListingItem, BoundsFilter } from "@/lib/types";
import { formatRupiah, formatShortRupiah, debounce } from "@/lib/utils";

interface InteractiveMapProps {
  listings: ListingItem[];
  selectedListingId?: string | null;
  hoveredListingId?: string | null;
  onSelectListing?: (id: string | null) => void;
  onViewDetail?: (id: string) => void;
  onBoundsChange?: (bounds: BoundsFilter) => void;
  onMapClick?: () => void;
  isListOpen?: boolean;
  center?: [number, number];
  zoom?: number;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createMarkCardIcon(
  L: typeof import("leaflet"),
  item: ListingItem,
  isActive: boolean
) {
  const fallbackImg =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
  const imgSrc =
    Array.isArray(item.images) &&
    item.images.length > 0 &&
    typeof item.images[0] === "string" &&
    item.images[0].trim().length > 0
      ? item.images[0]
      : fallbackImg;
  const safeTitle = escapeHtml(item.title);
  const safeDistrict = escapeHtml(item.district || "");
  const shortPrice = formatShortRupiah(item.price);
  const categoryTag = escapeHtml((item.property_type || "Hunian").toUpperCase());

  return L.divIcon({
    className: "tapak-leaflet-mark-icon",
    html: `
      <div class="tapak-marker-card-pin ${isActive ? "active" : ""}">
        <div class="tapak-marker-banner">
          <div class="tapak-marker-header-pill">${categoryTag}</div>
          <div class="tapak-marker-body-card">
            <div class="tapak-marker-body-title">Mulai ${shortPrice}/bln</div>
            <div class="tapak-marker-body-sub">${safeDistrict}</div>
          </div>
        </div>
        <div class="tapak-marker-photo-wrapper">
          <div class="tapak-marker-photo-circle">
            <img src="${imgSrc}" alt="${safeTitle}" onerror="this.src='${fallbackImg}'" />
          </div>
          <div class="tapak-marker-photo-pointer"></div>
        </div>
      </div>
    `,
    iconSize: [110, 94],
    iconAnchor: [55, 94],
    popupAnchor: [0, -96],
  });
}

export default function InteractiveMap({
  listings,
  selectedListingId,
  hoveredListingId,
  onSelectListing,
  onViewDetail,
  onBoundsChange,
  onMapClick,
  isListOpen = true,
  center = [-6.2368, 106.8087],
  zoom = 12,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, LeafletMarker>>({});
  const leafletLibRef = useRef<typeof import("leaflet") | null>(null);

  const initialCenterRef = useRef(center);
  const initialZoomRef = useRef(zoom);
  const onBoundsChangeRef = useRef(onBoundsChange);
  onBoundsChangeRef.current = onBoundsChange;

  const onSelectListingRef = useRef(onSelectListing);
  onSelectListingRef.current = onSelectListing;
  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;

  const debouncedBoundsChange = useMemo(
    () =>
      debounce((map: LeafletMap) => {
        if (!onBoundsChangeRef.current || !map) return;
        const bounds = map.getBounds();
        onBoundsChangeRef.current({
          minLat: bounds.getSouth(),
          minLng: bounds.getWest(),
          maxLat: bounds.getNorth(),
          maxLng: bounds.getEast(),
        });
      }, 300),
    []
  );

  // Auto-invalidate map size when container width/height changes (e.g. sidebar toggle)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    observer.observe(mapContainerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Initialize map once on mount
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      if (mapInstanceRef.current) return;

      const container = mapContainerRef.current as unknown as { _leaflet_id?: unknown };
      if (container._leaflet_id) {
        delete container._leaflet_id;
      }

      const L = (await import("leaflet")).default;
      if (!isMounted) return;

      leafletLibRef.current = L;

      const map = L.map(mapContainerRef.current, {
        center: initialCenterRef.current,
        zoom: initialZoomRef.current,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      map.on("moveend", () => debouncedBoundsChange(map));
      map.on("zoomend", () => debouncedBoundsChange(map));

      // Click on map outside markers: deselect mark and trigger onMapClick
      map.on("click", () => {
        onMapClickRef.current?.();
        onSelectListingRef.current?.(null);
      });

      mapInstanceRef.current = map;
      renderMarkers(L, map);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render markers when listings change or map finishes init
  useEffect(() => {
    if (leafletLibRef.current && mapInstanceRef.current) {
      renderMarkers(leafletLibRef.current, mapInstanceRef.current);
    }
  }, [listings]);

  function renderMarkers(L: typeof import("leaflet"), map: LeafletMap) {
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    if (!listings?.length) return;

    const activeId = hoveredListingId || selectedListingId;

    listings.forEach((item) => {
      const isActive = item.id === activeId;
      const customIcon = createMarkCardIcon(L, item, isActive);

      const marker = L.marker([item.latitude, item.longitude], {
        icon: customIcon,
        zIndexOffset: isActive ? 1000 : 0,
      }).addTo(map);

      const fallbackImg =
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
      const imgSrc =
        Array.isArray(item.images) &&
        item.images.length > 0 &&
        typeof item.images[0] === "string" &&
        item.images[0].trim().length > 0
          ? item.images[0]
          : fallbackImg;
      const safeTitle = escapeHtml(item.title);
      const safeDistrict = escapeHtml(item.district || "");
      const safeCity = escapeHtml(item.city || "");
      const safeType = escapeHtml((item.property_type || "Hunian").toUpperCase());
      const formattedPrice = formatRupiah(item.price);

      const popupContent = `
        <div class="tapak-explore-popup" style="width: 260px; font-family: var(--font-inter), system-ui, sans-serif;">
          <div
            onclick="window.__tapak_open_detail && window.__tapak_open_detail('${item.id}')"
            style="position: relative; width: 100%; height: 120px; background-color: #E2E8F0; overflow: hidden; cursor: pointer;"
          >
            <img
              src="${imgSrc}"
              alt="${safeTitle}"
              style="width: 100%; height: 100%; object-fit: cover; display: block;"
              loading="lazy"
              onerror="this.src='${fallbackImg}'"
            />
            <div style="position: absolute; top: 8px; left: 8px; z-index: 2;">
              <span style="background: #1E3A8A; color: #FFFFFF; font-size: 9.5px; font-weight: 700; padding: 2px 8px; border-radius: 5px; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; box-shadow: 0 1px 4px rgba(0,0,0,0.2);">
                ${safeType}
              </span>
            </div>
          </div>
          <div style="padding: 10px 12px 12px 12px;">
            <h4
              onclick="window.__tapak_open_detail && window.__tapak_open_detail('${item.id}')"
              style="font-family: var(--font-poppins), var(--font-inter), sans-serif; font-weight: 700; font-size: 13px; line-height: 1.35; margin: 0 0 3px 0; color: #111827; cursor: pointer; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"
              title="${safeTitle}"
            >
              ${safeTitle}
            </h4>
            <p style="font-size: 11px; color: #64748B; margin: 0 0 8px 0; line-height: 1.2;">
              ${safeDistrict}, ${safeCity}
            </p>

            <div style="display: flex; align-items: center; gap: 12px; padding: 6px 0; border-top: 1px solid #F1F5F9; border-bottom: 1px solid #F1F5F9; margin-bottom: 8px; font-size: 11px; color: #64748B; font-weight: 500;">
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
                ${item.bedrooms} KT
              </span>
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/></svg>
                ${item.bathrooms} KM
              </span>
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>
                ${item.area_sqm} m²
              </span>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
              <div>
                <span style="font-size: 10px; color: #64748B; display: block; line-height: 1;">Mulai dari</span>
                <div style="font-size: 13.5px; font-weight: 800; color: #111827; margin-top: 2px;">
                  ${formattedPrice}<span style="font-size: 10px; font-weight: 500; color: #64748B;">/bln</span>
                </div>
              </div>
              <button
                type="button"
                onclick="window.__tapak_open_detail && window.__tapak_open_detail('${item.id}')"
                style="background: #3D77EE; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 8px; border: none; cursor: pointer; transition: background-color 0.15s ease;"
                onmouseover="this.style.backgroundColor='#2B55AB'"
                onmouseout="this.style.backgroundColor='#3D77EE'"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: "tapak-explore-popup-container",
        minWidth: 260,
        maxWidth: 280,
        autoPan: false,
      });

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectListingRef.current?.(item.id);
        marker.openPopup();
      });

      markersRef.current[item.id] = marker;
    });
  }

  const prevSelectedIdRef = useRef<string | null>(null);

  // Efek kamera flyTo: HANYA dipanggil saat selectedListingId benar-benar berganti ke ID baru
  useEffect(() => {
    if (selectedListingId) {
      if (selectedListingId !== prevSelectedIdRef.current) {
        prevSelectedIdRef.current = selectedListingId;

        const targetItem = listings.find((l) => l.id === selectedListingId);
        const targetMarker = markersRef.current[selectedListingId];

        if (targetItem && mapInstanceRef.current) {
          const currentCenter = mapInstanceRef.current.getCenter();
          const dist = Math.hypot(
            currentCenter.lat - targetItem.latitude,
            currentCenter.lng - targetItem.longitude
          );

          // Terbangkan kamera dengan mulus hanya jika jarak cukup jauh atau zoom berbeda
          if (dist > 0.0001 || mapInstanceRef.current.getZoom() !== 15) {
            mapInstanceRef.current.flyTo([targetItem.latitude, targetItem.longitude], 15, {
              duration: 0.5,
              easeLinearity: 0.25,
            });
          }
        }

        if (targetMarker && !targetMarker.isPopupOpen()) {
          targetMarker.openPopup();
        }
      }
    } else {
      prevSelectedIdRef.current = null;
    }
  }, [selectedListingId, listings]);

  // Efek visual styling pin & popup hover: TIDAK PERNAH memicu flyTo atau menggerakkan zoom kamera peta
  useEffect(() => {
    const activeId = hoveredListingId || selectedListingId;

    listings.forEach((item) => {
      const marker = markersRef.current[item.id];
      if (!marker) return;

      const isActive = item.id === activeId;
      const el = marker.getElement();
      const pinEl = el?.querySelector<HTMLElement>(".tapak-marker-card-pin");

      if (pinEl) {
        if (isActive) {
          pinEl.classList.add("active");
          marker.setZIndexOffset(1000);
        } else {
          pinEl.classList.remove("active");
          marker.setZIndexOffset(0);
        }
      }
    });

    // Buka popup jika di-hover (hanya saat tidak ada pin yang sedang terkunci fokus)
    if (hoveredListingId && !selectedListingId) {
      const targetMarker = markersRef.current[hoveredListingId];
      if (targetMarker && !targetMarker.isPopupOpen()) {
        targetMarker.openPopup();
      }
    } else if (!hoveredListingId && !selectedListingId && mapInstanceRef.current) {
      mapInstanceRef.current.closePopup();
    }
  }, [hoveredListingId, selectedListingId, listings]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { __tapak_open_detail?: (id: string) => void }).__tapak_open_detail = (id: string) => {
        onViewDetail?.(id);
      };
    }
  }, [onViewDetail]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-[18px] overflow-hidden border border-[#E2E8F0]">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div
        className={`absolute top-3.5 ${
          isListOpen ? "left-3.5" : "left-16 sm:left-18"
        } z-[400] bg-white/95 backdrop-blur-xs px-3 py-2 rounded-[10px] border border-[#E2E8F0] shadow-2xs text-xs flex items-center gap-2 transition-all`}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A]" />
        <span className="font-semibold text-[#111827]">Harga & Foto Properti:</span>
        <span className="text-[#687280]">Klik mark untuk rincian unit</span>
      </div>
    </div>
  );
}

