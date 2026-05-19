"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";

import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import {
  GeoSearchControl,
  OpenStreetMapProvider,
} from "leaflet-geosearch";

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

type SearchFieldProps = {
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
};

type AutoDetectLocationProps = {
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  onGeolocationStatusChange?: (status: GeoStatus, message?: string) => void;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function SearchField({ setLatitude, setLongitude }: SearchFieldProps) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl: any = new (GeoSearchControl as any)({
      provider,
      style: "bar",
      autoComplete: true,
      autoCompleteDelay: 250,
      showMarker: false,
      retainZoomLevel: false,
      animateZoom: true,
    });

    map.addControl(searchControl);

    const handleSearch = (result: any) => {
      const lat = result?.location?.y;
      const lng = result?.location?.x;

      if (typeof lat === "number" && typeof lng === "number") {
        setLatitude(lat);
        setLongitude(lng);
        map.flyTo([lat, lng], 16);
      }
    };

    map.on("geosearch/showlocation", handleSearch);

    return () => {
      map.off("geosearch/showlocation", handleSearch);
      map.removeControl(searchControl);
    };
  }, [map, setLatitude, setLongitude]);

  return null;
}

function AutoDetectLocation({
  setLatitude,
  setLongitude,
  onGeolocationStatusChange,
}: AutoDetectLocationProps) {
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
      const message =
        "Browser Panjenengan tidak mendukung geolocation. Silakan gunakan browser lain.";

      onGeolocationStatusChange?.("unsupported", message);
      alert(message);
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
          "Gagal mengambil lokasi otomatis. Pastikan layanan lokasi perangkat Panjenengan aktif.";

        if (error.code === error.PERMISSION_DENIED) {
          status = "denied";
          message =
            "Izin lokasi belum diaktifkan. Silakan aktifkan izin lokasi di browser, lalu refresh halaman.";
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          status = "error";
          message =
            "Lokasi tidak tersedia. Pastikan GPS atau layanan lokasi perangkat Panjenengan aktif.";
        }

        if (error.code === error.TIMEOUT) {
          status = "error";
          message =
            "Waktu pengambilan lokasi habis. Coba refresh halaman atau aktifkan lokasi perangkat.";
        }

        onGeolocationStatusChange?.(status, message);
        alert(message);
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

function LocationMarker({
  setLatitude,
  setLongitude,
  latitude,
  longitude,
}: Props) {
  useMapEvents({
    click(e) {
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
    },
  });

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
  const defaultCenter: [number, number] = [-5.429, 105.261];

  return (
    <MapContainer
      center={
        latitude !== null && longitude !== null
          ? [latitude, longitude]
          : defaultCenter
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

      <AutoDetectLocation
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        onGeolocationStatusChange={onGeolocationStatusChange}
      />

      <SearchField setLatitude={setLatitude} setLongitude={setLongitude} />

      <LocationMarker
        latitude={latitude}
        longitude={longitude}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
      />
    </MapContainer>
  );
}