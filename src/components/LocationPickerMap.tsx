"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, Marker, ZoomControl, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, Loader2, LocateFixed, Maximize2, X, MapPin, Crosshair, Check } from "lucide-react";
import type { Coordinates, PlaceResult } from "@/lib/placeSearch";

const pickerIcon = L.divIcon({
  className: "bg-transparent",
  html: '<div style="width:32px;height:32px;background:#a4ff3d;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #1a1f1b;box-shadow:0 2px 10px #0008"><div style="width:10px;height:10px;margin:8px;background:#1a1f1b;border-radius:50%"></div></div>',
  iconSize: [32, 32], iconAnchor: [16, 32],
});
type ViewTarget = Coordinates & { bounds?: PlaceResult["bounds"]; key: number };
type Props = { position: Coordinates | null; setPosition: (point: Coordinates) => void };

function MapTools({ target, setPosition, centerRef, zoomRef }: { target: ViewTarget | null; setPosition: Props["setPosition"]; centerRef: RefObject<Coordinates>; zoomRef: RefObject<number> }) {
  const map = useMapEvents({
    click: event => { const point = event.latlng.wrap(); setPosition({ lat: point.lat, lng: point.lng }); },
    moveend: () => { const point = map.getCenter().wrap(); centerRef.current = { lat: point.lat, lng: point.lng }; zoomRef.current = map.getZoom(); },
  });
  useEffect(() => {
    if (!target) return;
    if (target.bounds) map.fitBounds([[target.bounds[0], target.bounds[1]], [target.bounds[2], target.bounds[3]]], { padding: [24, 24], maxZoom: 15, animate: false });
    else map.setView([target.lat, target.lng], 15, { animate: false });
  }, [map, target]);
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

export default function LocationPickerMap({ position, setPosition }: Props) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [chile, setChile] = useState(true);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [target, setTarget] = useState<ViewTarget | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState(() => ({ ...(position ?? { lat: -39.8, lng: -73.2 }), zoom: position ? 15 : 7 }));
  const center = useRef<Coordinates>(view);
  const zoom = useRef(view.zoom);
  const request = useRef<AbortController | null>(null);
  const cache = useRef(new Map<string, PlaceResult[]>());
  const generation = useRef(0);
  const mounted = useRef(true);
  const panel = useRef<HTMLDivElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; request.current?.abort(); }; }, []);
  useEffect(() => {
    if (!expanded) return;
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setView({ ...center.current, zoom: zoom.current }); setTarget(null); setExpanded(false); requestAnimationFrame(() => expandButton.current?.focus()); }
      if (event.key === "Tab") {
        const elements = panel.current?.querySelectorAll<HTMLElement>("button:not(:disabled), input, a[href], [tabindex='0']");
        const first = elements?.[0], last = elements?.[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", keydown);
    return () => { window.removeEventListener("keydown", keydown); };
  }, [expanded]);

  function toggleExpanded() {
    setView({ ...center.current, zoom: zoom.current }); setTarget(null); setExpanded(value => !value);
    if (expanded) requestAnimationFrame(() => expandButton.current?.focus());
  }
  function invalidateSearch() {
    generation.current++; request.current?.abort(); setSearching(false); setResults([]); setSearched(false); setError("");
  }
  async function search() {
    const text = query.trim();
    if (text.length < 3) { setError("Escribe al menos 3 caracteres para buscar."); return; }
    const token = ++generation.current;
    request.current?.abort();
    setResults([]); setError(""); setSearched(false);
    const key = `${chile}:${text.toLocaleLowerCase()}`;
    const cached = cache.current.get(key);
    if (cached) { setResults(cached); setSearched(true); return; }
    const controller = new AbortController(); request.current = controller; setSearching(true);
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const params = new URLSearchParams({ q: text, chile: String(chile) });
      const response = await fetch(`/api/places?${params}`, { signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No pudimos buscar ese lugar.");
      if (!Array.isArray(data.places)) throw new Error("No pudimos leer los resultados.");
      if (token !== generation.current || !mounted.current) return;
      cache.current.set(key, data.places); if (cache.current.size > 30) cache.current.delete(cache.current.keys().next().value!);
      setResults(data.places); setSearched(true);
    } catch {
      if (token === generation.current && mounted.current) setError(controller.signal.aborted ? "La búsqueda tardó demasiado. Vuelve a intentarlo o selecciona el punto en el mapa." : "No pudimos buscar ese lugar. Revisa tu conexión y vuelve a intentarlo; también puedes seleccionarlo directamente en el mapa.");
    } finally { window.clearTimeout(timeout); if (token === generation.current && mounted.current) setSearching(false); }
  }
  function locate() {
    if (!navigator.geolocation) { setError("Tu navegador no permite usar el GPS. Busca el área o elige el punto en el mapa."); return; }
    setLocating(true); setError("");
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      if (!mounted.current) return;
      const point = { lat: coords.latitude, lng: coords.longitude };
      setPosition(point); setTarget({ ...point, key: Date.now() }); setLocating(false);
    }, () => { if (mounted.current) { setError("No pudimos obtener tu ubicación. Revisa el permiso de GPS o busca el área."); setLocating(false); } }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
  }
  const content = <div ref={panel} role={expanded ? "dialog" : undefined} aria-modal={expanded || undefined} aria-label={expanded ? "Elegir ubicación en el mapa" : undefined}
    className={expanded ? "fixed inset-0 z-[10000] flex flex-col overflow-y-auto bg-deep-black p-4 pb-[max(1rem,env(safe-area-inset-bottom))]" : "mt-3 space-y-3 rounded-2xl border border-forest-green/30 bg-charcoal p-3"}>
    <div className="mb-2 flex items-center justify-between gap-2"><div><p className="text-sm font-semibold text-white">Encuentra el área</p><p className="mt-0.5 text-xs text-light-gray/60">Busca primero y después marca el punto exacto.</p></div>
      <button ref={expanded ? undefined : expandButton} type="button" aria-label={expanded ? "Cerrar pantalla completa" : "Ampliar mapa"} onClick={toggleExpanded} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-lime">{expanded ? <X size={19} /> : <Maximize2 size={19} />}</button>
    </div>
    <div role="search" aria-label="Buscar lugares" className="space-y-2">
      <label htmlFor={id} className="sr-only">Río, localidad o dirección</label>
      <div className="flex gap-2"><input id={id} value={query} maxLength={120} autoComplete="off" enterKeyHint="search" placeholder="Río, localidad o dirección…" onChange={event => { setQuery(event.target.value); invalidateSearch(); }} onKeyDown={event => { if (event.key === "Enter" && !event.nativeEvent.isComposing) { event.preventDefault(); void search(); } }} className="min-w-0 flex-1 rounded-xl border border-forest-green/40 bg-deep-black px-3 py-3 text-sm text-white outline-none focus:border-lime" />
        <button type="button" disabled={searching || query.trim().length < 3} onClick={() => void search()} className="flex min-h-11 items-center gap-1.5 rounded-xl bg-lime px-3 text-sm font-semibold text-deep-black disabled:opacity-40">{searching ? <Loader2 size={17} className="animate-spin" /> : <Search size={17} />}Buscar</button></div>
      <label className="flex min-h-8 w-fit items-center gap-2 text-xs text-light-gray/60"><input type="checkbox" checked={chile} onChange={event => { setChile(event.target.checked); invalidateSearch(); }} className="accent-lime" />Buscar en Chile</label>
    </div>
    <div aria-live="polite" className="text-xs text-light-gray/65">{searching && "Buscando lugares…"}{searched && !results.length && "No encontramos ese lugar. Prueba con el río, una localidad cercana o desmarca ‘Buscar en Chile’."}</div>
    {!!results.length && <ul aria-label="Resultados de lugares" className="my-2 max-h-48 shrink-0 divide-y divide-white/5 overflow-y-auto rounded-xl border border-white/10 bg-deep-black">{results.map(place => <li key={place.id}><button type="button" className="flex min-h-14 w-full items-center gap-3 px-3 py-2 text-left hover:bg-lime/10 focus-visible:bg-lime/10" onClick={() => { setTarget({ ...place, key: Date.now() }); setResults([]); setSearched(false); }}><MapPin size={18} className="shrink-0 text-lime" /><span className="min-w-0"><span className="block text-sm font-semibold text-white">{place.name}</span><span className="block text-xs text-light-gray/55">{place.detail}</span></span></button></li>)}</ul>}
    {error && <p role="alert" className="my-2 text-xs text-amber-200">{error}</p>}
    <div className={`relative isolate overflow-hidden rounded-xl border border-forest-green/30 ${expanded ? "mt-3 min-h-64 flex-1" : "h-80"}`}>
      <MapContainer center={[view.lat, view.lng]} zoom={view.zoom} zoomControl={false} scrollWheelZoom={false} className="h-full w-full" style={{ minHeight: "inherit" }}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" className="map-tiles-dark" />
        <ZoomControl position="bottomright" />
        <MapTools target={target} setPosition={setPosition} centerRef={center} zoomRef={zoom} />
        {position && <Marker position={[position.lat, position.lng]} icon={pickerIcon} draggable eventHandlers={{ dragend: event => { const point = (event.target as L.Marker).getLatLng().wrap(); setPosition({ lat: point.lat, lng: point.lng }); } }} />}
      </MapContainer>
      <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center"><Crosshair size={25} className="text-white/80 drop-shadow-md" strokeWidth={1.5} /></div>
      <div className="pointer-events-none absolute left-3 right-3 top-3 z-[500] mx-auto w-fit rounded-full bg-deep-black/90 px-3 py-2 text-center text-[11px] font-medium text-lime shadow-lg">{position ? "Arrastra el pin para ajustar la ubicación" : "Toca el mapa para colocar el pin"}</div>
    </div>
    <div className="mt-3 flex shrink-0 flex-wrap gap-2"><button type="button" disabled={locating} onClick={locate} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-forest-green/50 px-3 text-xs font-semibold text-lime disabled:opacity-50">{locating ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}Mi ubicación</button><button type="button" onClick={() => setPosition({ ...center.current })} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-forest-green/50 px-3 text-xs font-semibold text-white"><Crosshair size={16} />Usar centro del mapa</button></div>
    <p role="status" className="mt-2 text-xs text-light-gray/60">{position ? `Punto seleccionado · ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` : "La búsqueda solo acerca el mapa. Aún falta marcar el punto."}</p>
    <p className="mt-2 text-[10px] text-light-gray/40">Búsqueda: <a href="https://photon.komoot.io" target="_blank" rel="noreferrer" className="underline">Photon</a> · Datos <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">© OpenStreetMap</a></p>
    {expanded && <button type="button" disabled={!position} onClick={toggleExpanded} className="mt-3 flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-lime text-sm font-bold text-deep-black disabled:opacity-40"><Check size={18} />Listo, usar este punto</button>}
  </div>;
  return expanded ? createPortal(content, document.body) : content;
}
