"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Compass,
  Navigation,
  Layers,
  Search,
  CheckCircle,
  Recycle,
  Maximize2,
  Minimize2,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/lib/i18n";
import {
  getPointLocalized,
  getCategoryLocalized,
} from "@/lib/collection-points-i18n";

export interface MapPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  acceptedCategories: {
    categoryId: string;
    category: {
      id: string;
      name: string;
      color?: string | null;
    };
  }[];
}

interface AlgeriaCollectionMapProps {
  points: MapPoint[];
  selectedPointId?: string | null;
  onSelectPoint?: (point: MapPoint) => void;
  depositUrlTemplate?: (point: MapPoint) => string;
}

const ALGERIA_CENTER: [number, number] = [29.0, 3.0];
const ALGERIA_DEFAULT_ZOOM = 5;

const WILAYAS_LIST = [
  { nameFr: "Toutes les wilayas", nameAr: "جميع الولايات", city: "all", coords: ALGERIA_CENTER, zoom: 5 },
  { nameFr: "Sud & Sahara", nameAr: "المناطق الصحراوية", city: "sahara", coords: [28.0, 3.0] as [number, number], zoom: 5.5 },
  { nameFr: "Alger", nameAr: "الجزائر", city: "Alger", coords: [36.7538, 3.0588] as [number, number], zoom: 11 },
  { nameFr: "Oran", nameAr: "وهران", city: "Oran", coords: [35.6987, -0.6349] as [number, number], zoom: 11 },
  { nameFr: "Constantine", nameAr: "قسنطينة", city: "Constantine", coords: [36.3570, 6.6147] as [number, number], zoom: 11 },
  { nameFr: "Annaba", nameAr: "عنابة", city: "Annaba", coords: [36.9010, 7.7610] as [number, number], zoom: 12 },
  { nameFr: "Sétif", nameAr: "سطيف", city: "Sétif", coords: [36.1912, 5.4080] as [number, number], zoom: 12 },
  { nameFr: "Tlemcen", nameAr: "تلمسان", city: "Tlemcen", coords: [34.8870, -1.3320] as [number, number], zoom: 12 },
  { nameFr: "Blida", nameAr: "البليدة", city: "Blida", coords: [36.4710, 2.8310] as [number, number], zoom: 12 },
  { nameFr: "Béjaïa", nameAr: "بجاية", city: "Béjaïa", coords: [36.7510, 5.0680] as [number, number], zoom: 12 },
  { nameFr: "Batna", nameAr: "باتنة", city: "Batna", coords: [35.5560, 6.1820] as [number, number], zoom: 12 },
  { nameFr: "Biskra", nameAr: "بسكرة", city: "Biskra", coords: [34.8510, 5.7280] as [number, number], zoom: 11 },
  { nameFr: "Ghardaïa", nameAr: "غرداية", city: "Ghardaïa", coords: [32.4909, 3.6735] as [number, number], zoom: 11 },
  { nameFr: "Ouargla", nameAr: "ورقلة", city: "Ouargla", coords: [31.9539, 5.3283] as [number, number], zoom: 11 },
  { nameFr: "Béchar", nameAr: "بشار", city: "Béchar", coords: [31.6167, -2.2167] as [number, number], zoom: 11 },
  { nameFr: "Adrar", nameAr: "أدرار", city: "Adrar", coords: [27.8743, -0.2939] as [number, number], zoom: 11 },
  { nameFr: "Tamanrasset", nameAr: "تمنراست", city: "Tamanrasset", coords: [22.7850, 5.5228] as [number, number], zoom: 11 },
  { nameFr: "El Oued", nameAr: "الوادي", city: "El Oued", coords: [33.3683, 6.8674] as [number, number], zoom: 11 },
  { nameFr: "Timimoun", nameAr: "تيميمون", city: "Timimoun", coords: [29.2639, 0.2310] as [number, number], zoom: 11 },
  { nameFr: "Djanet", nameAr: "جانت", city: "Djanet", coords: [24.5534, 9.4853] as [number, number], zoom: 11 },
  { nameFr: "Illizi", nameAr: "إيليزي", city: "Illizi", coords: [26.4833, 8.4667] as [number, number], zoom: 11 },
  { nameFr: "Tindouf", nameAr: "تندوف", city: "Tindouf", coords: [27.6744, -8.1478] as [number, number], zoom: 11 },
];

export function AlgeriaCollectionMap({
  points,
  selectedPointId,
  onSelectPoint,
  depositUrlTemplate,
}: AlgeriaCollectionMapProps) {
  const { lang, t } = useLang();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [activeCity, setActiveCity] = useState<string>("all");
  const [isMapReady, setIsMapReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: ALGERIA_CENTER,
        zoom: ALGERIA_DEFAULT_ZOOM,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false,
      });

      // Add zoom control at bottom right
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);

      // OpenStreetMap tiles - free, no API key required
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        subdomains: "abc",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      setIsMapReady(true);
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

  // Update Markers when points change or map is ready
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !markersLayerRef.current) return;

    let isMounted = true;

    async function renderMarkers() {
      const L = (await import("leaflet")).default;
      if (!isMounted || !mapInstanceRef.current || !markersLayerRef.current) return;

      markersLayerRef.current.clearLayers();

      const validPoints = points.filter(
        (p) => p.latitude !== null && p.longitude !== null
      );

      validPoints.forEach((point) => {
        const isSelected = selectedPointId === point.id;

        // Custom pulsed modern emerald pin
        const customIcon = L.divIcon({
          className: "ecovex-custom-marker",
          html: `
            <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${
                isSelected ? "#10b981" : "#059669"
              }; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <div style="
                position: relative;
                width: 30px;
                height: 30px;
                border-radius: 9999px;
                background: ${isSelected ? "linear-gradient(135deg, #059669, #047857)" : "linear-gradient(135deg, #10b981, #059669)"};
                border: 2.5px solid #ffffff;
                box-shadow: 0 4px 12px rgba(5, 150, 105, 0.45);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                transition: transform 0.2s ease;
              ">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -18],
        });

        const marker = L.marker([point.latitude!, point.longitude!], {
          icon: customIcon,
          title: point.name,
        });

        const loc = getPointLocalized(point, lang);

        const categoriesBadges = point.acceptedCategories
          .map(
            (c) =>
              `<span style="display:inline-block; font-size:10px; font-weight:600; padding:2px 8px; border-radius:9999px; background:#ecfdf5; color:#065f46; margin:2px;">${getCategoryLocalized(c.category.name, lang)}</span>`
          )
          .join("");

        const targetDepositUrl = depositUrlTemplate
          ? depositUrlTemplate(point)
          : `/citoyen/operations/nouvelle?pointId=${point.id}`;

        const popupContent = `
          <div style="font-family: inherit; direction: ${lang === "ar" ? "rtl" : "ltr"}; text-align: ${lang === "ar" ? "right" : "left"}; min-width: 220px; max-width: 280px; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: 700; background: #10b981; color: white; padding: 2px 7px; border-radius: 6px; text-transform: uppercase;">
                ${loc.city}
              </span>
              <span style="font-size: 10px; color: #059669; font-weight: 600;">
                ● ${lang === "ar" ? "مفتوح ونشط" : "Opérationnel"}
              </span>
            </div>
            <h4 style="font-size: 13px; font-weight: 700; color: #111827; margin: 0 0 4px 0; line-height: 1.3;">
              ${loc.name}
            </h4>
            <p style="font-size: 11px; color: #6b7280; margin: 0 0 8px 0;">
              📍 ${loc.address}
            </p>
            ${
              loc.description
                ? `<p style="font-size: 10px; color: #4b5563; margin: 0 0 8px 0; line-height: 1.4; background: #f9fafb; padding: 6px; border-radius: 6px;">${loc.description}</p>`
                : ""
            }
            <div style="margin-bottom: 8px;">
              ${categoriesBadges}
            </div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #f3f4f6; display: flex; justify-content: flex-end;">
              <a href="${targetDepositUrl}" style="
                display: inline-block;
                background: #059669;
                color: #ffffff;
                font-size: 11px;
                font-weight: 600;
                padding: 6px 12px;
                border-radius: 8px;
                text-decoration: none;
              ">
                ${lang === "ar" ? "← تسجيل وإيداع" : "Déposer ici →"}
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: false,
          className: "ecovex-popup-card",
        });

        marker.on("click", () => {
          setActivePoint(point);
          if (onSelectPoint) onSelectPoint(point);
        });

        markersLayerRef.current.addLayer(marker);
      });
    }

    renderMarkers();

    return () => {
      isMounted = false;
    };
  }, [points, isMapReady, selectedPointId, lang, onSelectPoint]);

  // Handle flyTo when selectedPointId changes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !selectedPointId) return;

    const point = points.find((p) => p.id === selectedPointId);
    if (point && point.latitude && point.longitude) {
      mapInstanceRef.current.flyTo([point.latitude, point.longitude], 14, {
        duration: 1.2,
      });
      setActivePoint(point);
    }
  }, [selectedPointId, points, isMapReady]);

  // Zoom to Wilaya
  const handleSelectWilaya = (wilaya: (typeof WILAYAS_LIST)[0]) => {
    setActiveCity(wilaya.city);

    if (mapInstanceRef.current) {
      if (wilaya.city === "all") {
        mapInstanceRef.current.flyTo(ALGERIA_CENTER, ALGERIA_DEFAULT_ZOOM, {
          duration: 1.2,
        });
      } else {
        mapInstanceRef.current.flyTo(wilaya.coords, wilaya.zoom, {
          duration: 1.2,
        });
      }
    }
  };

  // Reset view to Algeria
  const handleResetView = () => {
    setActiveCity("all");
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(ALGERIA_CENTER, ALGERIA_DEFAULT_ZOOM, {
        duration: 1.2,
      });
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-border/80 bg-card shadow-2xl transition-all duration-300 ${
        isFullscreen ? "fixed inset-4 z-50 rounded-2xl" : "h-[540px] sm:h-[620px]"
      }`}
    >
      {/* Map Control Bar Top */}
      <div className="absolute top-4 start-4 end-4 z-10 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        {/* Wilaya Filter Carousel / Quick Selector */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto max-w-full p-1.5 rounded-2xl bg-background/90 backdrop-blur-md border border-border/80 shadow-lg">
          {WILAYAS_LIST.map((w) => {
            const isSelected = activeCity === w.city;
            const label = lang === "ar" ? w.nameAr : w.nameFr;
            return (
              <button
                key={w.city}
                type="button"
                onClick={() => handleSelectWilaya(w)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetView}
            className="h-9 px-3 rounded-xl bg-background/90 backdrop-blur-md shadow-md gap-1.5 text-xs font-semibold"
            title={lang === "ar" ? "إعادة ضبط الخريطة كاملة" : "Vue d'ensemble Algérie"}
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">
              {lang === "ar" ? "كل الجزائر" : "Vue Algérie"}
            </span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-9 w-9 p-0 rounded-xl bg-background/90 backdrop-blur-md shadow-md"
            title={isFullscreen ? "Réduire" : "Plein écran"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>
      </div>

      {/* Map Leaflet Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Info Banner Bottom Start */}
      <div className="absolute bottom-4 start-4 z-10 pointer-events-auto max-w-xs sm:max-w-sm hidden sm:block">
        <div className="p-3.5 rounded-2xl bg-background/90 backdrop-blur-md border border-primary/20 shadow-xl text-start">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-bold text-foreground">
              {lang === "ar"
                ? "شبكة التجميع الذكية ECOVEX في الجزائر"
                : "Réseau national ECOVEX Algérie"}
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {lang === "ar"
              ? "مراكز تجميع ومحطات فرز معتمدة متواجدة عبر مختلف ولايات الوطن لاستقبال وإيداع النفايات."
              : "Points de tri et déchetteries connectées réparties sur les wilayas pour déposer vos déchets."}
          </p>
          <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-primary">
            <span>
              {points.length} {lang === "ar" ? "نقطة نشطة" : "points actifs"}
            </span>
            <span>•</span>
            <span>{WILAYAS_LIST.length - 1} {lang === "ar" ? "ولايات مغطاة" : "wilayas"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

