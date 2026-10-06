"use client";

import { useEffect, useState } from "react";
import { Sun, CloudRain, Cloud, Loader2, Wind, Droplets, X } from "lucide-react";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<{ temp: number; desc: string; icon: any; wind: number; windDir: number; humidity: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            // Open-Meteo Free API with hourly data to get humidity
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`);
            const data = await res.json();
            
            if (data && data.current_weather) {
              const temp = Math.round(data.current_weather.temperature);
              const code = data.current_weather.weathercode;
              const wind = data.current_weather.windspeed;
              const windDir = data.current_weather.winddirection;
              // Get current humidity (approximation based on current hour)
              const hourIndex = new Date().getHours();
              const humidity = data.hourly?.relativehumidity_2m?.[hourIndex] || 50;
              
              let desc = "Despejado";
              let Icon = Sun;
              
              if (code >= 1 && code <= 3) {
                desc = "Nublado";
                Icon = Cloud;
              } else if (code >= 51) {
                desc = "Lluvia";
                Icon = CloudRain;
              }

              setWeather({ temp, desc, icon: Icon, wind, windDir, humidity });
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        },
        () => setLoading(false), // Fallback silencioso
        { timeout: 5000 }
      );
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="bg-charcoal p-5 rounded-3xl border border-forest-green/20 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-lime mb-2" size={24} />
        <p className="text-xs text-light-gray/60">Clima...</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-charcoal p-5 rounded-3xl border border-forest-green/20 flex flex-col justify-center text-center">
        <p className="text-xs text-light-gray/60">GPS para clima</p>
      </div>
    );
  }

  const Icon = weather.icon;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-charcoal p-5 rounded-3xl border border-forest-green/20 flex flex-col justify-center items-center text-center hover:border-lime transition-colors relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-lime/5 rounded-bl-full pointer-events-none group-hover:bg-lime/10 transition-colors"></div>
        <Icon className="text-lime mb-2 group-hover:scale-110 transition-transform" size={32} />
        <p className="text-white font-bold text-2xl leading-none">{weather.temp}°C</p>
        <p className="text-lime text-xs font-medium mt-1">{weather.desc}</p>
      </button>

      {/* Popup / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="bg-charcoal border border-forest-green/30 w-full max-w-sm rounded-[2rem] p-6 relative z-10 shadow-2xl transition-all">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-light-gray/60 hover:text-white bg-deep-black rounded-full"
            >
              <X size={20} />
            </button>

            <div className="text-center mt-2 mb-8">
              <Icon className="text-lime mx-auto mb-4" size={56} />
              <h3 className="text-5xl font-bold text-white mb-2">{weather.temp}°C</h3>
              <p className="text-lg text-lime font-medium">{weather.desc}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-deep-black rounded-2xl p-4 border border-white/5 flex flex-col items-center">
                <Wind className="text-light-gray mb-2" size={24} />
                <span className="text-xs text-light-gray/60 mb-1">Viento</span>
                <span className="font-bold text-white text-lg">{weather.wind} <span className="text-xs font-normal">km/h</span></span>
              </div>
              <div className="bg-deep-black rounded-2xl p-4 border border-white/5 flex flex-col items-center">
                <Droplets className="text-light-gray mb-2" size={24} />
                <span className="text-xs text-light-gray/60 mb-1">Humedad</span>
                <span className="font-bold text-white text-lg">{weather.humidity} <span className="text-xs font-normal">%</span></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
