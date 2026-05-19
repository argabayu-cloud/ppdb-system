"use client";

import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

type Props = {
  latitude: number | null;
  longitude: number | null;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

  return latitude && longitude ? (
    <Marker
      position={[latitude, longitude]}
      icon={markerIcon}
    />
  ) : null;
}

export default function ZonasiMap({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}: Props) {
  return (
    <MapContainer
      center={[-5.429, 105.261]}
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

      <LocationMarker
        latitude={latitude}
        longitude={longitude}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
      />
    </MapContainer>
  );
}