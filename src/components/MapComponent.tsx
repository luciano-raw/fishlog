"use client";

import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import ImageWithFullscreen from "./ImageWithFullscreen";

// ... [Iconos previos]
const neonIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div style="width: 20px; height: 20px; background-color: #A4FF3D; border-radius: 50%; border: 3px solid #1A1F1B; box-shadow: 0 0 10px #A4FF3D;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Ícono azul para la posición actual del usuario
const userIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div style="width: 16px; height: 16px; background-color: #3b82f6; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 15px #3b82f6;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface MapProps {
  catches: any[];
  interactive?: boolean;
}

// Subcomponente para manejar la geolocalización de Leaflet
function LocationFlyTo({ catches }: { catches: any[] }) {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Pedir permisos y buscar ubicación
    map.locate({ setView: false, maxZoom: 13 })
      .on("locationfound", (e) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
        // Si no hay capturas previas, volamos a donde está el usuario
        if (catches.length === 0) {
          map.flyTo(e.latlng, map.getZoom());
        }
      });
  }, [map, catches.length]);

  return position ? (
    <Marker position={position} icon={userIcon}>
      <Popup className="fishlog-popup">
        <div className="text-center font-bold text-sm">Estás aquí</div>
      </Popup>
    </Marker>
  ) : null;
}

export default function MapComponent({ catches, interactive = true }: MapProps) {
  // Centro por defecto (o última captura)
  const centerPosition: [number, number] = catches.length > 0 && catches[0].locationLat
    ? [catches[0].locationLat, catches[0].locationLng]
    : [-33.4489, -70.6693]; // Default Santiago

  return (
    <div className={`w-full ${interactive ? 'h-[calc(100vh-100px)]' : 'h-full'} z-0`}>
      <MapContainer
        center={centerPosition}
        zoom={interactive ? 13 : 11}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={false}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />
        
        {interactive && <ZoomControl position="bottomright" />}
        <LocationFlyTo catches={catches} />

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
                    <p className="font-bold text-lg leading-tight">{c.species}</p>
                    <p className="text-xs text-lime mb-1">{c.user?.username || "Amigo"}</p>
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
        /* Truco para volver el mapa estandar de OSM a Dark Mode */
        .map-tiles-dark {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>
    </div>
  );
}
