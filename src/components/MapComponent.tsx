"use client";

import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useEffect, useState } from "react";
import ImageWithFullscreen from "./ImageWithFullscreen";

// Ícono grande tipo "Pin" o "Lágrima" para las capturas
const catchIcon = L.divIcon({
  className: "bg-transparent",
  html: `
    <div style="
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
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Ícono azul para la posición actual del usuario
const userIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div style="width: 16px; height: 16px; background-color: #3b82f6; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 15px #3b82f6;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Ícono azul para spots
const spotIcon = L.divIcon({
  className: "bg-transparent",
  html: `
    <div style="width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #1A1F1B; box-shadow: 2px 2px 5px rgba(59,130,246,0.5);"></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

// Ícono rojo para peligros
const hazardIcon = L.divIcon({
  className: "bg-transparent",
  html: `
    <div style="width: 24px; height: 24px; background-color: #ef4444; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #1A1F1B; box-shadow: 2px 2px 5px rgba(239,68,68,0.5);"></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});


const createClusterCustomIcon = function (cluster: any) {
  return L.divIcon({
    html: `<div class="w-10 h-10 bg-[#a4ff3d] border-2 border-[#1A1F1B] text-[#1A1F1B] font-bold text-base rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(164,255,61,0.6)]"><span>${cluster.getChildCount()}</span></div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40, true),
  });
};

interface MapProps {
  catches: any[];
  spots?: any[];
  hazards?: any[];
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
        if (true) {
          map.flyTo(e.latlng, 14);
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

export default function MapComponent({ catches, spots = [], hazards = [], interactive = true }: MapProps) {
  // Centro por defecto (o última captura/spot)
  const centerPosition: [number, number] = catches.length > 0 && catches[0].locationLat
    ? [catches[0].locationLat, catches[0].locationLng]
    : spots.length > 0 && spots[0].locationLat 
      ? [spots[0].locationLat, spots[0].locationLng]
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
          <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon} maxClusterRadius={40}>

        {catches.map((c, i) => (
          c.locationLat && c.locationLng ? (
            <Marker 
              key={c.id || i} 
              position={[c.locationLat, c.locationLng]} 
              icon={catchIcon}
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

        {spots.map((s, i) => (
          s.locationLat && s.locationLng ? (
            <Marker key={`spot-${s.id || i}`} position={[s.locationLat, s.locationLng]} icon={spotIcon}>
              {interactive && (
                <Popup className="fishlog-popup">
                  <div className="text-center font-sans">
                    <p className="font-bold text-lg leading-tight text-[#3b82f6]">{s.name}</p>
                    <p className="text-xs text-[#3b82f6]/80 mb-1">Spot de {s.user?.username || "Amigo"}</p>
                    {s.speciesSeen && <p className="text-sm text-gray-400 mb-2">Visto: {s.speciesSeen}</p>}
                    {s.imageUrl && (
                      <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden mt-2 border border-[#3b82f6]/30">
                        <ImageWithFullscreen src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </Popup>
              )}
            </Marker>
          ) : null
        ))}

        {hazards.map((h, i) => (
          h.locationLat && h.locationLng ? (
            <Marker key={`hazard-${h.id || i}`} position={[h.locationLat, h.locationLng]} icon={hazardIcon}>
              {interactive && (
                <Popup className="fishlog-popup">
                  <div className="text-center font-sans">
                    <p className="font-bold text-lg leading-tight text-[#ef4444]">{h.name}</p>
                    <p className="text-xs text-[#ef4444]/80 mb-1">Reportado por {h.user?.username || "Amigo"}</p>
                    {h.note && <p className="text-sm text-gray-300 mt-2 p-2 bg-deep-black rounded-lg border border-[#ef4444]/20">{h.note}</p>}
                  </div>
                </Popup>
              )}
            </Marker>
          ) : null
        ))}

          </MarkerClusterGroup>
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
