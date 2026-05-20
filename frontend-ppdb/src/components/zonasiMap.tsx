"use client";

import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";

export type GeoStatus =
  | "idle"
  | "checking"
  | "granted"
  | "denied"
  | "unsupported"
  | "error";

type Props = {
  latitude: number | null;
  longitude: number | null;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  onGeolocationStatusChange?: (status: GeoStatus, message?: string) => void;
};

type SearchResult = {
  x: number;
  y: number;
  label: string;
  title: string;
  address: string;
  kind: "jalan" | "gang" | "dusun" | "kelurahan" | "kecamatan" | "lokasi";
  priority: number;
};

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
};

const DEFAULT_CENTER: [number, number] = [-5.429, 105.261];
const SEARCH_AREA = "Bandar Lampung, Lampung, Indonesia";
const NEARBY_SEARCH_RADIUS = 4000;

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s.-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isRoadName(name: string) {
  const text = normalizeText(name);

  return (
    text.startsWith("jalan ") ||
    text.startsWith("jl ") ||
    text.startsWith("jl.") ||
    text.startsWith("gang ") ||
    text.startsWith("gg ") ||
    text.startsWith("gg.")
  );
}

function formatRoadTitle(name: string) {
  if (isRoadName(name)) return name;
  return `Jalan ${name}`;
}

function getPlaceKind(
  type?: string,
  className?: string,
  adminLevel?: string,
  addressType?: string
): SearchResult["kind"] {
  if (type === "hamlet") return "dusun";

  if (
    type === "village" ||
    type === "quarter" ||
    type === "neighbourhood" ||
    addressType === "village" ||
    addressType === "quarter" ||
    addressType === "neighbourhood"
  ) {
    return "kelurahan";
  }

  if (
    className === "boundary" &&
    (adminLevel === "7" || adminLevel === "8")
  ) {
    return "kelurahan";
  }

  if (
    type === "administrative" &&
    (adminLevel === "7" || adminLevel === "8")
  ) {
    return "kelurahan";
  }

  if (
    type === "suburb" ||
    type === "city_district" ||
    addressType === "suburb" ||
    addressType === "city_district" ||
    adminLevel === "6"
  ) {
    return "kecamatan";
  }

  return "lokasi";
}

function getPlacePrefix(kind: SearchResult["kind"]) {
  if (kind === "dusun") return "Dusun";
  if (kind === "kelurahan") return "Kelurahan";
  if (kind === "kecamatan") return "Kecamatan";
  if (kind === "gang") return "Gang";
  if (kind === "jalan") return "Jalan";

  return "Lokasi";
}

function getBadgeLabel(kind: SearchResult["kind"]) {
  if (kind === "jalan") return "Jalan";
  if (kind === "gang") return "Gang";
  if (kind === "dusun") return "Dusun";
  if (kind === "kelurahan") return "Kelurahan";
  if (kind === "kecamatan") return "Kecamatan";

  return "Lokasi";
}

function splitLabel(label: string) {
  const [first, ...rest] = label.split(",");

  return {
    title: first?.trim() || label,
    address: rest.join(",").trim(),
  };
}

function mapProviderResults(items: any[]): SearchResult[] {
  return items
    .map((item) => {
      const label = String(item.label || "");
      const raw = item.raw || {};

      const type = raw.type as string | undefined;
      const className = raw.class as string | undefined;
      const adminLevel =
        raw.extratags?.admin_level ||
        raw.admin_level ||
        raw.address?.admin_level;
      const addressType = raw.addresstype as string | undefined;

      const { title, address } = splitLabel(label);

      let kind: SearchResult["kind"] = "lokasi";
      let priority = 9;

      if (
        className === "highway" ||
        type === "road" ||
        type === "residential" ||
        isRoadName(title)
      ) {
        kind = normalizeText(title).includes("gang") ? "gang" : "jalan";
        priority = kind === "gang" ? 2 : 1;
      } else {
        kind = getPlaceKind(type, className, adminLevel, addressType);

        if (kind === "kelurahan") priority = 2.5;
        else if (kind === "dusun") priority = 3;
        else if (kind === "kecamatan") priority = 6;
        else priority = 9;
      }

      return {
        x: Number(item.x),
        y: Number(item.y),
        label,
        title,
        address,
        kind,
        priority,
      };
    })
    .filter((item) => Number.isFinite(item.x) && Number.isFinite(item.y));
}

function dedupeResults(results: SearchResult[]) {
  const resultMap = new Map<string, SearchResult>();

  results.forEach((item) => {
    const key = normalizeText(
      `${item.title}-${item.x.toFixed(4)}-${item.y.toFixed(4)}`
    );

    if (!resultMap.has(key)) {
      resultMap.set(key, item);
      return;
    }

    const existing = resultMap.get(key);

    if (existing && item.priority < existing.priority) {
      resultMap.set(key, item);
    }
  });

  return Array.from(resultMap.values()).sort((a, b) => a.priority - b.priority);
}

async function fetchNearbySpecificPlaces(
  lat: number,
  lng: number,
  areaKeyword: string
): Promise<SearchResult[]> {
  const overpassQuery = `
[out:json][timeout:10];
(
  way(around:${NEARBY_SEARCH_RADIUS},${lat},${lng})["highway"]["name"];

  node(around:${NEARBY_SEARCH_RADIUS},${lat},${lng})["place"~"hamlet|village|suburb|quarter|neighbourhood"]["name"];
  way(around:${NEARBY_SEARCH_RADIUS},${lat},${lng})["place"~"hamlet|village|suburb|quarter|neighbourhood"]["name"];
  relation(around:${NEARBY_SEARCH_RADIUS},${lat},${lng})["place"~"hamlet|village|suburb|quarter|neighbourhood"]["name"];

  way(around:${NEARBY_SEARCH_RADIUS},${lat},${lng})["boundary"="administrative"]["admin_level"~"7|8"]["name"];
  relation(around:${NEARBY_SEARCH_RADIUS},${lat},${lng})["boundary"="administrative"]["admin_level"~"7|8"]["name"];
);
out center 120;
`;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: overpassQuery,
  });

  if (!response.ok) return [];

  const data = await response.json();
  const elements: OverpassElement[] = data.elements || [];

  return elements
    .map((element) => {
      const tags = element.tags || {};
      const name = tags.name;

      if (!name) return null;

      const latValue = element.lat ?? element.center?.lat;
      const lngValue = element.lon ?? element.center?.lon;

      if (latValue === undefined || lngValue === undefined) return null;

      const highway = tags.highway;
      const place = tags.place;

      if (highway) {
        const isGang =
          normalizeText(name).startsWith("gang ") ||
          normalizeText(name).startsWith("gg ") ||
          normalizeText(name).startsWith("gg.");

        const kind: SearchResult["kind"] = isGang ? "gang" : "jalan";
        const title = isGang ? name : formatRoadTitle(name);

        return {
          x: lngValue,
          y: latValue,
          label: `${title}, ${areaKeyword}, ${SEARCH_AREA}`,
          title,
          address: `${areaKeyword}, ${SEARCH_AREA}`,
          kind,
          priority: isGang ? 2 : 1,
        };
      }

      if (tags.boundary === "administrative") {
        const adminLevel = tags.admin_level;

        if (adminLevel === "7" || adminLevel === "8") {
          const title = normalizeText(name).startsWith("kelurahan")
            ? name
            : `Kelurahan ${name}`;

          return {
            x: lngValue,
            y: latValue,
            label: `${title}, ${SEARCH_AREA}`,
            title,
            address: SEARCH_AREA,
            kind: "kelurahan",
            priority: 2.5,
          };
        }
      }

      if (place) {
        const kind = getPlaceKind(place);
        const prefix = getPlacePrefix(kind);
        const alreadyHasPrefix = normalizeText(name).startsWith(
          normalizeText(prefix)
        );

        const title = alreadyHasPrefix ? name : `${prefix} ${name}`;

        return {
          x: lngValue,
          y: latValue,
          label: `${title}, ${SEARCH_AREA}`,
          title,
          address: SEARCH_AREA,
          kind,
          priority:
            kind === "kelurahan"
              ? 2.5
              : kind === "dusun"
                ? 3
                : kind === "kecamatan"
                  ? 6
                  : 9,
        };
      }

      return null;
    })
    .filter(Boolean) as SearchResult[];
}

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5 text-slate-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      className="h-5 w-5 text-slate-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 10c0 4.9-8 12-8 12S4 14.9 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function LocateIcon() {
  return (
    <svg
      className="h-5 w-5 text-blue-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function AutoDetectLocation({
  setLatitude,
  setLongitude,
  onGeolocationStatusChange,
}: {
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  onGeolocationStatusChange?: (status: GeoStatus, message?: string) => void;
}) {
  const map = useMap();
  const hasDetected = useRef(false);

  useEffect(() => {
    if (hasDetected.current) return;
    hasDetected.current = true;

    onGeolocationStatusChange?.(
      "checking",
      "Sedang mengecek izin lokasi perangkat..."
    );

    if (!navigator.geolocation) {
      onGeolocationStatusChange?.(
        "unsupported",
        "Browser Panjenengan tidak mendukung geolocation. Silakan gunakan pencarian lokasi manual."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        onGeolocationStatusChange?.("granted", "Lokasi berhasil diaktifkan.");

        map.flyTo([lat, lng], 16);
      },
      (error) => {
        let status: GeoStatus = "error";
        let message =
          "Gagal mengambil lokasi otomatis. Silakan gunakan pencarian lokasi manual.";

        if (error.code === error.PERMISSION_DENIED) {
          status = "denied";
          message =
            "Izin lokasi belum diaktifkan. Silakan aktifkan izin lokasi di browser atau gunakan pencarian lokasi manual.";
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          status = "error";
          message =
            "Lokasi tidak tersedia. Pastikan GPS aktif atau gunakan pencarian lokasi manual.";
        }

        if (error.code === error.TIMEOUT) {
          status = "error";
          message =
            "Waktu pengambilan lokasi habis. Silakan gunakan pencarian lokasi manual.";
        }

        onGeolocationStatusChange?.(status, message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [map, setLatitude, setLongitude, onGeolocationStatusChange]);

  return null;
}

function SearchLocationBox({
  setLatitude,
  setLongitude,
  onGeolocationStatusChange,
}: {
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  onGeolocationStatusChange?: (status: GeoStatus, message?: string) => void;
}) {
  const map = useMap();

  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const providerRef = useRef<any>(null);
  const requestIdRef = useRef(0);
  const skipNextSearchRef = useRef(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchError, setSearchError] = useState("");

  if (!providerRef.current) {
    providerRef.current = new OpenStreetMapProvider({
      params: {
        countrycodes: "id",
        addressdetails: "1",
        limit: "8",
        "accept-language": "id",
      },
    });
  }

  useEffect(() => {
    if (!searchBoxRef.current) return;

    L.DomEvent.disableClickPropagation(searchBoxRef.current);
    L.DomEvent.disableScrollPropagation(searchBoxRef.current);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const keyword = query.trim();

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    if (keyword.length < 3) {
      setResults([]);
      setSearchError("");
      return;
    }

    const timeout = setTimeout(async () => {
      const currentRequestId = requestIdRef.current + 1;
      requestIdRef.current = currentRequestId;

      try {
        setIsSearching(true);
        setSearchError("");

        const providerItems = await providerRef.current.search({
          query: `${keyword}, ${SEARCH_AREA}`,
        });

        if (currentRequestId !== requestIdRef.current) return;

        const providerResults = mapProviderResults(providerItems);

        const areaCenters = providerResults
          .filter(
            (item) =>
              item.kind === "kecamatan" ||
              item.kind === "kelurahan" ||
              item.kind === "lokasi"
          )
          .slice(0, 3);

        let nearbySpecificResults: SearchResult[] = [];

        for (const area of areaCenters) {
          try {
            const nearby = await fetchNearbySpecificPlaces(
              area.y,
              area.x,
              keyword
            );

            nearbySpecificResults = [...nearbySpecificResults, ...nearby];
          } catch (error) {
            console.warn("NEARBY SEARCH ERROR:", error);
          }
        }

        if (currentRequestId !== requestIdRef.current) return;

        const kelurahanProviderResults = providerResults.filter(
          (item) => item.kind === "kelurahan"
        );

        const specificProviderResults = providerResults.filter(
          (item) =>
            item.kind === "jalan" ||
            item.kind === "gang" ||
            item.kind === "dusun"
        );

        const kecamatanProviderResults = providerResults.filter(
          (item) => item.kind === "kecamatan"
        );

        const fallbackAreaResults = providerResults.filter(
          (item) => item.kind === "lokasi"
        );

        const mergedResults = dedupeResults([
          ...kelurahanProviderResults,
          ...nearbySpecificResults,
          ...specificProviderResults,
          ...kecamatanProviderResults,
          ...fallbackAreaResults,
        ]).slice(0, 12);

        setResults(mergedResults);

        if (mergedResults.length === 0) {
          setSearchError(
            "Lokasi tidak ditemukan. Coba ketik nama kecamatan, kelurahan, jalan, atau gang."
          );
        }
      } catch (error) {
        console.error("SEARCH LOCATION ERROR:", error);
        setSearchError("Gagal mencari lokasi. Coba lagi beberapa saat.");
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsSearching(false);
        }
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelectLocation = (location: SearchResult) => {
    const lat = location.y;
    const lng = location.x;

    setLatitude(lat);
    setLongitude(lng);

    onGeolocationStatusChange?.(
      "granted",
      "Lokasi berhasil dipilih melalui pencarian manual."
    );

    map.flyTo([lat, lng], 17);

    skipNextSearchRef.current = true;
    setQuery(location.title);
    setResults([]);
    setSearchError("");
    setIsFocused(false);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      const message =
        "Browser Panjenengan tidak mendukung geolocation. Silakan gunakan pencarian lokasi manual.";

      onGeolocationStatusChange?.("unsupported", message);
      alert(message);
      return;
    }

    onGeolocationStatusChange?.(
      "checking",
      "Sedang mengecek izin lokasi perangkat..."
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        onGeolocationStatusChange?.("granted", "Lokasi berhasil diaktifkan.");

        map.flyTo([lat, lng], 17);

        skipNextSearchRef.current = true;
        setQuery("Lokasi saya saat ini");
        setResults([]);
        setSearchError("");
      },
      () => {
        const message =
          "Gagal mengambil lokasi saat ini. Silakan aktifkan izin lokasi browser atau gunakan pencarian manual.";

        onGeolocationStatusChange?.("error", message);
        alert(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const showDropdown =
    isFocused &&
    (results.length > 0 || isSearching || searchError || query.length > 0);

  return (
    <div
      ref={searchBoxRef}
      className="absolute left-4 top-4 z-[1000] w-[470px] max-w-[calc(100%-2rem)]"
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <SearchIcon />

          <input
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results.length > 0) {
                e.preventDefault();
                handleSelectLocation(results[0]);
              }
            }}
            placeholder="Cari kecamatan, kelurahan, jalan, atau gang..."
            className="h-9 w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setSearchError("");
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Hapus pencarian"
            >
              ×
            </button>
          )}

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-blue-50"
            title="Gunakan lokasi saat ini"
          >
            <LocateIcon />
          </button>
        </div>

        {showDropdown && (
          <div className="border-t border-slate-100 bg-white">
            {isSearching && (
              <div className="flex items-center gap-3 px-4 py-4 text-sm text-slate-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                Mencari kelurahan, jalan, dan area sekitar...
              </div>
            )}

            {!isSearching && searchError && (
              <div className="px-4 py-4 text-sm text-red-600">
                {searchError}
              </div>
            )}

            {!isSearching &&
              results.map((item, index) => (
                <button
                  key={`${item.x}-${item.y}-${index}`}
                  type="button"
                  onClick={() => handleSelectLocation(item)}
                  className="flex w-full gap-4 px-4 py-3 text-left transition hover:bg-slate-50"
                >
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <PinIcon />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {item.title}
                      </p>

                      <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        {getBadgeLabel(item.kind)}
                      </span>
                    </div>

                    <p className="mt-0.5 max-h-10 overflow-hidden text-xs leading-5 text-slate-500">
                      {item.address || item.label}
                    </p>
                  </div>
                </button>
              ))}

            {!isSearching && results.length > 0 && (
              <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
                Pilih salah satu hasil untuk mengubah titik lokasi.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LocationMarker({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  return latitude !== null && longitude !== null ? (
    <Marker position={[latitude, longitude]} icon={markerIcon} />
  ) : null;
}

export default function ZonasiMap({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  onGeolocationStatusChange,
}: Props) {
  return (
    <div className="relative">
      <MapContainer
        center={
          latitude !== null && longitude !== null
            ? [latitude, longitude]
            : DEFAULT_CENTER
        }
        zoom={13}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "1rem",
        }}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <SearchLocationBox
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          onGeolocationStatusChange={onGeolocationStatusChange}
        />

        <AutoDetectLocation
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          onGeolocationStatusChange={onGeolocationStatusChange}
        />

        <LocationMarker latitude={latitude} longitude={longitude} />
      </MapContainer>
    </div>
  );
}