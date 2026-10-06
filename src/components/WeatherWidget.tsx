"use client";

import { useEffect, useState } from "react";
import { Sun, CloudRain, Cloud, Loader2 } from "lucide-react";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<{ temp: number; desc: string; icon: any } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            // Open-Meteo Free API
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const data = await res.json();
            
            if (data && data.current_weather) {
              const temp = Math.round(data.current_weather.temperature);
              const code = data.current_weather.weathercode;
              
              let desc = "Despejado";
              let Icon = Sun;
              
              if (code >= 1 && code <= 3) {
                desc = "Nublado";
                Icon = Cloud;
              } else if (code >= 51) {
                desc = "Lluvia";
                Icon = CloudRain;
              }

              setWeather({ temp, desc, icon: Icon });
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        },
        () => setLoading(false), // Fallback silencioso si no hay permisos
        { timeout: 5000 }
      );
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="bg-charcoal p-6 rounded-3xl border border-forest-green/20 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-lime mb-2" size={24} />
        <p className="text-sm text-light-gray/60">Clima...</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-charcoal p-6 rounded-3xl border border-forest-green/20 flex flex-col justify-center text-center">
        <p className="text-sm text-light-gray/60">Activa el GPS para ver el clima local</p>
      </div>
    );
  }

  const Icon = weather.icon;

  return (
    <div className="bg-charcoal p-6 rounded-3xl border border-forest-green/20 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-light-gray/60 text-sm font-medium">Condiciones</p>
          <p className="text-white font-bold text-2xl mt-1">{weather.temp}°C</p>
        </div>
        <Icon className="text-lime" size={28} />
      </div>
      <p className="text-lime text-sm font-medium mt-4">{weather.desc}</p>
    </div>
  );
}
