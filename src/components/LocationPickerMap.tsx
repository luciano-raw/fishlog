"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const pickerIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div style="
    width: 32px; 
    height: 32px; 
    background-color: #A4FF3D; 
    border-radius: 50% 50% 50% 0; 
    transform: rotate(-45deg); 
    border: 3px solid #1A1F1B; 
    box-shadow: 2px 2px 10px rgba(164,255,61,0.5); 
    display: flex; 
    align-items: center; 
    justify-content: center;
  ">
    <div style="width: 12px; height: 12px; background-color: #1A1F1B; border-radius: 50%;"></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function MapClickHandler({ setPosition }: { setPosition: (p: {lat: number, lng: number}) => void }) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

interface Props {
  position: {lat: number, lng: number} | null;
  setPosition: (p: {lat: number, lng: number}) => void;
}

export default function LocationPickerMap({ position, setPosition }: Props) {
  const defaultCenter: [number, number] = position ? [position.lat, position.lng] : [-33.4489, -70.6693];

  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden border border-forest-green/30 relative z-0 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <MapContainer center={defaultCenter} zoom={position ? 15 : 6} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />
        <MapClickHandler setPosition={setPosition} />
        {position && <Marker position={[position.lat, position.lng]} icon={pickerIcon} />}
      </MapContainer>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-deep-black/90 backdrop-blur-sm px-4 py-2 rounded-full border border-lime/50 pointer-events-none shadow-lg">
        <p className="text-lime text-xs font-bold uppercase tracking-wider">Toca para fijar el pin</p>
      </div>
    </div>
  );
}
