"use client";

import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import ImageWithFullscreen from "./ImageWithFullscreen";

// Arreglar ícono por defecto de Leaflet en Next.js
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Ícono verde neón para que combine con Fishlog
const neonIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div style="width: 20px; height: 20px; background-color: #A4FF3D; border-radius: 50%; border: 3px solid #1A1F1B; box-shadow: 0 0 10px #A4FF3D;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface MapProps {
  catches: any[];
  interactive?: boolean;
}

export default function MapComponent({ catches, interactive = true }: MapProps) {
  // Centro por defecto (o última captura)
  const centerPosition: [number, number] = catches.length > 0 && catches[0].locationLat
    ? [catches[0].locationLat, catches[0].locationLng]
    : [-33.4489, -70.6693]; // Default Santiago, Chile (ejemplo)

  return (
    <div className={`w-full ${interactive ? 'h-[calc(100vh-100px)]' : 'h-full'} z-0`}>
      <MapContainer
        center={centerPosition}
        zoom={interactive ? 13 : 11}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={false} // Quitamos el default para ponerlo abajo si es interactivo
        touchZoom={interactive}
        doubleClickZoom={interactive}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {interactive && <ZoomControl position="bottomright" />}

        {catches.map((c, i) => (
          c.locationLat && c.locationLng ? (
            <Marker 
              key={c.id || i} 
              position={[c.locationLat, c.locationLng]} 
              icon={neonIcon}
            >
              {interactive && (
                <Popup className="fishlog-popup">
                  <div className="text-center font-sans">
                    <p className="font-bold text-lg mb-1">{c.species}</p>
                    <p className="text-sm text-gray-500 mb-2">{c.weight ? `${c.weight}kg` : ''} {c.length ? `• ${c.length}cm` : ''}</p>
                    {c.imageUrl && (
                      <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden mt-2 border border-forest-green/30">
                        <ImageWithFullscreen src={c.imageUrl} alt={c.species} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </Popup>
              )}
            </Marker>
          ) : null
        ))}
      </MapContainer>
      
      {/* Añadimos estilos extra para el popup oscuro sobreescribiendo leaflet */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background-color: #1A1F1B;
          color: #E6E6E6;
          border: 1px solid rgba(44, 74, 50, 0.5);
          border-radius: 1rem;
        }
        .leaflet-popup-tip {
          background-color: #1A1F1B;
          border: 1px solid rgba(44, 74, 50, 0.5);
        }
        .leaflet-container {
          background-color: #000000;
          font-family: var(--font-sans);
        }
      `}</style>
    </div>
  );
}
