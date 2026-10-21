"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sun, Moon, CloudSun, CloudMoon, CloudRain, Cloud, CloudFog, CloudDrizzle, CloudSnow, CloudLightning, Loader2, Wind, Droplets, X, Sunrise, Sunset, RefreshCw } from "lucide-react";
import { parseWeather, weatherCondition, weatherUrl, type WeatherForecast } from "@/lib/weather";

const icons = { sun: Sun, moon: Moon, cloudSun: CloudSun, cloudMoon: CloudMoon, cloud: Cloud, fog: CloudFog, drizzle: CloudDrizzle, rain: CloudRain, snow: CloudSnow, storm: CloudLightning };
const cardClass = "relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-forest-green/20 bg-charcoal p-5 text-center transition-colors hover:border-lime";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  const fetchedAt = useRef(0);
  const dialog = useRef<HTMLDivElement>(null);
  const cancelRequest = useCallback(() => {
    requestId.current++;
    controller.current?.abort();
  }, []);

  const loadWeather = useCallback(() => {
    const id = ++requestId.current;
    controller.current?.abort();
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Tu navegador no permite consultar la ubicación.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      if (id !== requestId.current) return;
      const abort = new AbortController();
      controller.current = abort;
      const timeout = window.setTimeout(() => abort.abort(), 12000);
      try {
        const response = await fetch(weatherUrl(coords.latitude, coords.longitude), { signal: abort.signal });
        if (!response.ok) throw new Error("No se pudo consultar el clima.");
        const data = parseWeather(await response.json());
        if (id === requestId.current) { setWeather(data); fetchedAt.current = Date.now(); }
      } catch {
        if (id === requestId.current) setError("No pudimos actualizar el clima. Revisa tu conexión y vuelve a intentarlo.");
      } finally {
        window.clearTimeout(timeout);
        if (id === requestId.current) setLoading(false);
      }
    }, failure => {
      if (id !== requestId.current) return;
      setError(failure.code === 1 ? "Permite el acceso a tu ubicación para consultar el clima." : "No pudimos obtener tu ubicación. Vuelve a intentarlo.");
      setLoading(false);
    }, { timeout: 10000, maximumAge: 60000 });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadWeather, 0);
    return () => { window.clearTimeout(timer); cancelRequest(); };
  }, [loadWeather, cancelRequest]);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key === "Tab") {
        const buttons = dialog.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex='0']");
        if (!buttons?.length) return;
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", keydown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  const condition = weather ? weatherCondition(weather.current.code, weather.current.isDay) : null;
  const Icon = condition ? icons[condition.icon] : Cloud;
  const formatTime = (timestamp: number | null) => timestamp === null ? "—" : new Intl.DateTimeFormat("es-CL", { timeZone: weather?.timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(timestamp * 1000));
  const formatDate = (timestamp: number) => new Intl.DateTimeFormat("es-CL", { timeZone: weather?.timezone, day: "numeric", month: "short" }).format(new Date(timestamp * 1000));
  const value = (amount: number | null, unit: string) => amount === null ? "—" : `${Math.round(amount)}${unit}`;

  return <>
    <button type="button" className={cardClass} disabled={!weather && loading}
      aria-label={weather ? "Ver pronóstico por hora" : "Reintentar consulta del clima"}
      onClick={() => {
        if (!weather) { loadWeather(); return; }
        setIsOpen(true);
        if (Date.now() - fetchedAt.current > 10 * 60 * 1000 || (weather.hours[0] && weather.hours[0].time * 1000 <= Date.now())) loadWeather();
      }}>
      {weather ? <>
        <Icon className="mb-2 text-lime" size={32} aria-hidden="true" />
        <p className="text-2xl font-bold leading-none text-white">{Math.round(weather.current.temperature)}°C</p>
        <p className="mt-1 text-xs font-medium text-lime">{condition?.label}</p>
        <span className="mt-2 text-[10px] text-light-gray/50">Ver próximas horas</span>
      </> : loading ? <><Loader2 className="mb-2 animate-spin text-lime" size={24} /><span className="text-xs text-light-gray/60">Consultando clima...</span></> : <>
        <Cloud className="mb-2 text-light-gray/50" size={26} /><span className="text-xs text-light-gray/70">{error}</span><span className="mt-2 text-xs text-lime">Reintentar</span>
      </>}
    </button>
    {isOpen && weather && createPortal(
      <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm sm:items-center" onClick={() => setIsOpen(false)}>
        <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="weather-title"
          className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-[2rem] border border-forest-green/40 bg-charcoal p-5 shadow-2xl sm:p-6"
          onClick={event => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-3">
            <div><h2 id="weather-title" className="text-lg font-bold text-white">Clima en tu ubicación</h2><p className="mt-1 text-xs text-light-gray/50">Hora local del lugar · {weather.timezone.replaceAll("_", " ")}</p></div>
            <button type="button" aria-label="Cerrar pronóstico" onClick={() => setIsOpen(false)} className="rounded-full bg-deep-black p-2 text-light-gray hover:text-white"><X size={20} /></button>
          </div>
          <div className="my-5 flex items-center justify-center gap-4">
            <Icon className="shrink-0 text-lime" size={48} aria-hidden="true" />
            <div><p className="text-4xl font-bold text-white">{Math.round(weather.current.temperature)}°C</p><p className="text-sm text-lime">{condition?.label}</p></div>
          </div>
          <div className="mb-5 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl bg-deep-black p-3"><Wind size={19} className="mx-auto mb-1 text-light-gray/70" /><p className="text-xs text-light-gray/50">Viento actual</p><p className="mt-1 font-semibold text-white">{value(weather.current.wind, " km/h")}</p></div>
            <div className="rounded-2xl bg-deep-black p-3"><Droplets size={19} className="mx-auto mb-1 text-light-gray/70" /><p className="text-xs text-light-gray/50">Humedad actual</p><p className="mt-1 font-semibold text-white">{value(weather.current.humidity, "%")}</p></div>
          </div>
          <h3 className="font-semibold text-white">Próximas 12 horas</h3>
          <p className="mb-3 mt-1 text-xs text-light-gray/50">Desliza para ver las siguientes horas</p>
          {weather.hours.length ? <ol aria-label="Pronóstico por hora" tabIndex={0} className="flex snap-x snap-proximity gap-2 overflow-x-auto overscroll-x-contain pb-3">
            {weather.hours.map(hour => {
              const hourCondition = weatherCondition(hour.code, hour.isDay), HourIcon = icons[hourCondition.icon];
              return <li key={hour.time} className="flex w-24 shrink-0 snap-start flex-col items-center gap-2 rounded-2xl border border-white/5 bg-deep-black p-3 text-center">
                <time dateTime={new Date(hour.time * 1000).toISOString()} className="text-sm font-semibold text-white">{formatTime(hour.time)}</time>
                <span className="text-[10px] text-light-gray/45">{formatDate(hour.time)}</span>
                <HourIcon size={25} className="text-lime" role="img" aria-label={hourCondition.label} />
                <span className="text-lg font-bold text-white">{Math.round(hour.temperature)}°</span>
                <span className="flex items-center gap-1 text-xs text-blue-300" aria-label={`Probabilidad de lluvia: ${value(hour.rainProbability, "%")}`}><Droplets size={12} />{value(hour.rainProbability, "%")}</span>
                <span className="flex items-center gap-1 whitespace-nowrap text-[10px] text-light-gray/65" aria-label={`Viento: ${value(hour.wind, " km/h")}`}><Wind size={12} />{value(hour.wind, " km/h")}</span>
              </li>;
            })}
          </ol> : <p className="py-3 text-sm text-light-gray/60">El pronóstico por hora no está disponible por el momento.</p>}
          <h3 className="mb-3 mt-5 font-semibold text-white">Luz de hoy</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-amber-300/15 bg-deep-black p-3"><Sunrise className="mb-2 text-amber-300" size={23} /><p className="text-xs text-light-gray/50">Amanecer</p><p className="mt-1 text-xl font-semibold text-white">{formatTime(weather.sunrise)}</p></div>
            <div className="rounded-2xl border border-orange-300/15 bg-deep-black p-3"><Sunset className="mb-2 text-orange-300" size={23} /><p className="text-xs text-light-gray/50">Atardecer</p><p className="mt-1 text-xl font-semibold text-white">{formatTime(weather.sunset)}</p></div>
          </div>
          {error && <p role="alert" className="mt-4 text-xs text-amber-200">{error} Se muestran los últimos datos obtenidos.</p>}
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/5 pt-3">
            <p className="text-[10px] text-light-gray/45">Datos de las {formatTime(weather.current.time)} · <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">Open-Meteo</a></p>
            <button type="button" disabled={loading} onClick={loadWeather} className="flex min-h-10 items-center gap-1.5 text-xs font-semibold text-lime disabled:opacity-50"><RefreshCw size={14} className={loading ? "animate-spin" : ""} />{loading ? "Actualizando" : "Actualizar"}</button>
          </div>
        </div>
      </div>, document.body,
    )}
  </>;
}
