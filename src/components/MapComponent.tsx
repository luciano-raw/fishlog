"use client";

import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "@tomickigrzegorz/leaflet-rotate";
import { LocateFixed, Loader2, Navigation2 } from "lucide-react";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useEffect, useRef, useState } from "react";
import ImageWithFullscreen from "./ImageWithFullscreen";
import { hasCoordinates, type MapTarget, type MapPointType } from "@/lib/mapLinks";
import { lureLabel } from "@/lib/lures";

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

const shopIcon = L.divIcon({
  className: "bg-transparent",
  html: '<div style="width:34px;height:34px;border-radius:12px;background:#fcd34d;border:2px solid #1A1F1B;box-shadow:0 2px 10px #0008;display:flex;align-items:center;justify-content:center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1F1B" stroke-width="2"><path d="M3 10h18l-2-6H5l-2 6Z"/><path d="M4 10v10h16V10M9 20v-6h6v6"/><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/></svg></div>',
  iconSize: [34, 34], iconAnchor: [17, 34],
});


const createClusterCustomIcon = function (cluster: { getChildCount(): number }) {
  return L.divIcon({
    html: `<div class="w-10 h-10 bg-[#a4ff3d] border-2 border-[#1A1F1B] text-[#1A1F1B] font-bold text-base rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(164,255,61,0.6)]"><span>${cluster.getChildCount()}</span></div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40, true),
  });
};

interface MapProps {
  catches: PointRecord[];
  spots?: PointRecord[];
  hazards?: PointRecord[];
  shops?: PointRecord[];
  interactive?: boolean;
  target?: MapTarget;
}

// Subcomponente para manejar la geolocalización de Leaflet
function LocationControls({ interactive, hasTarget }: { interactive: boolean; hasTarget: boolean }) {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bearing, setBearing] = useState(0);
  const recenterRequested = useRef(!hasTarget);

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      if (container.clientWidth && container.clientHeight) map.invalidateSize({ pan: false });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  useEffect(() => {
    recenterRequested.current = !hasTarget;
    const onLocationFound = (event: L.LocationEvent) => {
      setPosition([event.latlng.lat, event.latlng.lng]);
      setLocating(false);
      setError(null);
      if (interactive && recenterRequested.current) map.flyTo(event.latlng, Math.max(map.getZoom(), 14));
    };
    const onLocationError = (event: L.ErrorEvent) => {
      setLocating(false);
      if (interactive) {
        setError(event.code === 1
          ? "Permite el acceso a tu ubicación en el navegador y vuelve a intentarlo."
          : "No pudimos obtener tu ubicación. Vuelve a intentarlo.");
      }
    };
    const onRotate = () => setBearing(map.getBearing());
    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);
    map.on("rotate", onRotate);
    map.locate({ setView: false, enableHighAccuracy: true, timeout: 10000 });
    return () => {
      map.off("locationfound", onLocationFound);
      map.off("locationerror", onLocationError);
      map.off("rotate", onRotate);
      map.stopLocate();
    };
  }, [map, interactive, hasTarget]);

  return <>
    {position && (
    <Marker position={position} icon={userIcon}>
      <Popup className="fishlog-popup">
        <div className="text-center font-bold text-sm">Estás aquí</div>
      </Popup>
    </Marker>
    )}
    {interactive && (
      <div className="absolute bottom-28 right-3 z-[1000] flex flex-col items-end gap-2"
        onPointerDown={(event) => event.stopPropagation()}
        onDoubleClick={(event) => event.stopPropagation()}>
        {error && <p role="alert" className="max-w-60 rounded-xl border border-red-400/40 bg-[#1A1F1B] p-3 text-sm text-white shadow-lg">{error}</p>}
        <button type="button" aria-label="Orientar mapa al norte" title="Orientar al norte"
          onClick={() => map.setBearing(0)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-forest-green/50 bg-charcoal text-lime shadow-lg hover:bg-forest-green focus-visible:outline-2 focus-visible:outline-lime">
          <Navigation2 size={22} style={{ transform: `rotate(${bearing}deg)` }} />
        </button>
        <button type="button" aria-label={locating ? "Buscando tu ubicación" : "Volver a mi ubicación"} title="Volver a mi ubicación"
          disabled={locating} aria-busy={locating}
          onClick={() => {
            recenterRequested.current = true;
            setLocating(true);
            setError(null);
            map.locate({ setView: false, enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
          }}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-forest-green/50 bg-charcoal text-lime shadow-lg hover:bg-forest-green disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-lime">
          {locating ? <Loader2 size={22} className="animate-spin" /> : <LocateFixed size={22} />}
        </button>
      </div>
    )}
  </>;
}

interface PointRecord {
  id: string;
  locationLat: number | null;
  locationLng: number | null;
  name?: string;
  species?: string;
  lureType?: string | null;
  description?: string | null;
  address?: string | null;
  website?: string | null;
  weight?: number | null;
  length?: number | null;
  speciesSeen?: string | null;
  note?: string | null;
  imageUrl?: string | null;
  user?: { username: string | null };
}

function PointMarker({ point, type, interactive, focused = false }: {
  point: PointRecord; type: MapPointType; interactive: boolean; focused?: boolean;
}) {
  const map = useMap();
  const marker = useRef<L.Marker>(null);
  const { id, locationLat, locationLng } = point;
  useEffect(() => {
    if (!focused || locationLat == null || locationLng == null) return;
    map.setView([locationLat, locationLng], 16, { animate: false });
    const open = () => marker.current?.openPopup();
    const current = marker.current;
    current?.on("add", open);
    open();
    return () => { current?.off("add", open); };
  }, [map, focused, id, locationLat, locationLng]);

  if (!hasCoordinates(point)) return null;
  const title = type === "catch" ? point.species : point.name;
  const color = type === "catch" ? "text-lime" : type === "spot" ? "text-blue-400" : type === "shop" ? "text-amber-300" : "text-red-400";
  const author = point.user?.username || "Pescador";
  return <Marker ref={marker} position={[locationLat!, locationLng!]} icon={type === "catch" ? catchIcon : type === "spot" ? spotIcon : type === "shop" ? shopIcon : hazardIcon}>
    {interactive && <Popup className="fishlog-popup">
      <div className="text-center font-sans">
        <p className={`text-lg font-bold leading-tight ${color}`}>{title}</p>
        <p className={`mb-1 text-xs ${color}`}>{type === "shop" ? "Tienda / artículos de pesca" : type === "spot" ? `Spot de ${author}` : type === "hazard" ? `Reportado por ${author}` : author}</p>
        {type === "catch" && <p className="mb-2 text-sm text-gray-400">{[point.weight != null ? `${point.weight} kg` : null, point.length != null ? `${point.length} cm` : null].filter(Boolean).join(" · ")}</p>}
        {type === "catch" && lureLabel(point.lureType) && <p className="mb-2 text-xs text-lime/80">Con: {lureLabel(point.lureType)}</p>}
        {type === "shop" && <div className="space-y-2 text-sm text-gray-300">
          {point.description && <p className="whitespace-pre-wrap break-words">{point.description}</p>}
          {point.address && <p>{point.address}</p>}
          {point.website && /^https?:\/\//i.test(point.website) && <a href={point.website} target="_blank" rel="noopener noreferrer" className="inline-block text-amber-300 underline">Sitio web / contacto</a>}
        </div>}
        {type === "spot" && point.speciesSeen && <p className="mb-2 text-sm text-gray-400">Visto: {point.speciesSeen}</p>}
        {point.note && <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-deep-black p-2 text-sm text-gray-300">{point.note}</p>}
        {point.imageUrl && <div className="mt-2">
          <div className="mx-auto h-32 w-32 overflow-hidden rounded-xl border border-forest-green/30">
            <ImageWithFullscreen src={point.imageUrl} alt={title || "Foto del registro"} className="h-full w-full object-cover" />
          </div>
          <p className="mt-1 text-[10px] text-light-gray/60">Toca para ampliar</p>
        </div>}
      </div>
    </Popup>}
  </Marker>;
}

export default function MapComponent({ catches, spots = [], hazards = [], shops = [], interactive = true, target }: MapProps) {
  const records = [
    ...catches.map(point => ({ type: "catch" as const, point })),
    ...spots.map(point => ({ type: "spot" as const, point })),
    ...hazards.map(point => ({ type: "hazard" as const, point })),
    ...shops.map(point => ({ type: "shop" as const, point })),
  ].filter(({ point }) => hasCoordinates(point));
  const selected = interactive ? records.find(({ type, point }) => type === target?.type && point.id === target.id) : undefined;
  // Centro por defecto (o última captura/spot)
  const firstPoint = selected?.point ?? records[0]?.point;
  const centerPosition: [number, number] = firstPoint
    ? [firstPoint.locationLat!, firstPoint.locationLng!]
      : [-33.4489, -70.6693]; // Default Santiago

  return (
    <div className={`w-full ${interactive ? 'h-[calc(100vh-100px)]' : 'h-full'} z-0`}>
      <MapContainer
        center={centerPosition}
        zoom={selected ? 16 : interactive ? 13 : 11}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={false}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        rotate={interactive}
        touchRotate={interactive}
        shiftKeyRotate={interactive}
        dragRotate={interactive}
        rotateControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />
        
        {interactive && <ZoomControl position="bottomright" />}
        <LocationControls interactive={interactive} hasTarget={!!selected} />
        <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon} maxClusterRadius={40}>
          {records.filter(record => record !== selected).map(({ type, point }) => (
            <PointMarker key={`${type}-${point.id}`} type={type} point={point} interactive={interactive} />
          ))}
        </MarkerClusterGroup>
        {selected && <PointMarker key={`${selected.type}-${selected.point.id}`} type={selected.type} point={selected.point} interactive focused />}
        {target && !selected && interactive && <div role="status" className="absolute left-4 right-4 top-20 z-[1000] rounded-xl border border-forest-green/40 bg-charcoal p-3 text-sm text-white">Este registro ya no está disponible o no tiene ubicación.</div>}
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
