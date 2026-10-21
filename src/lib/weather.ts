export interface WeatherHour {
  time: number; temperature: number; code: number | null; isDay: boolean;
  rainProbability: number | null; wind: number | null;
}
export interface WeatherForecast {
  timezone: string;
  current: { time: number; temperature: number; code: number | null; isDay: boolean; wind: number | null; humidity: number | null };
  hours: WeatherHour[];
  sunrise: number | null;
  sunset: number | null;
}

export function weatherUrl(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    latitude: String(latitude), longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,weather_code,is_day,wind_speed_10m",
    hourly: "temperature_2m,precipitation_probability,weather_code,is_day,wind_speed_10m",
    daily: "sunrise,sunset", timezone: "auto", timeformat: "unixtime",
    forecast_hours: "13", forecast_days: "2", wind_speed_unit: "kmh",
  });
  return `https://api.open-meteo.com/v1/forecast?${params}`;
}
function object(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" ? value as Record<string, unknown> : {};
}
function number(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function at(value: unknown, index: number) { return Array.isArray(value) ? number(value[index]) : null; }

export function parseWeather(payload: unknown, now = Date.now()): WeatherForecast {
  const data = object(payload), current = object(data.current), hourly = object(data.hourly), daily = object(data.daily);
  const temperature = number(current.temperature_2m), time = number(current.time);
  if (temperature === null || time === null) throw new Error("No hay datos meteorológicos actuales.");
  const timezone = typeof data.timezone === "string" ? data.timezone : "UTC";
  const dateFormat = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" });
  const today = dateFormat.format(new Date(now));
  const dailyTimes: unknown[] = Array.isArray(daily.time) ? daily.time : [];
  const dayIndex = dailyTimes.findIndex(value => typeof value === "number" && Number.isFinite(value) && dateFormat.format(new Date(value * 1000)) === today);
  const times: unknown[] = Array.isArray(hourly.time) ? hourly.time : [];
  const hours: WeatherHour[] = [];
  times.forEach((value, index) => {
    const timestamp = number(value), temp = at(hourly.temperature_2m, index);
    if (timestamp === null || temp === null || timestamp * 1000 <= now) return;
    hours.push({ time: timestamp, temperature: temp, code: at(hourly.weather_code, index),
      isDay: at(hourly.is_day, index) === 1, rainProbability: at(hourly.precipitation_probability, index), wind: at(hourly.wind_speed_10m, index) });
  });
  return {
    timezone, current: { time, temperature, code: number(current.weather_code), isDay: current.is_day === 1,
      wind: number(current.wind_speed_10m), humidity: number(current.relative_humidity_2m) },
    hours: hours.sort((a, b) => a.time - b.time).slice(0, 12),
    sunrise: dayIndex >= 0 ? at(daily.sunrise, dayIndex) : null,
    sunset: dayIndex >= 0 ? at(daily.sunset, dayIndex) : null,
  };
}

export function weatherCondition(code: number | null, isDay: boolean) {
  if (code === 0) return { icon: isDay ? "sun" : "moon", label: "Despejado" } as const;
  if (code === 1 || code === 2) return { icon: isDay ? "cloudSun" : "cloudMoon", label: "Parcialmente nublado" } as const;
  if (code === 3) return { icon: "cloud", label: "Nublado" } as const;
  if (code === 45 || code === 48) return { icon: "fog", label: "Niebla" } as const;
  if ([51, 53, 55, 56, 57].includes(code ?? -1)) return { icon: "drizzle", label: "Llovizna" } as const;
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code ?? -1)) return { icon: "rain", label: "Lluvia" } as const;
  if ([71, 73, 75, 77, 85, 86].includes(code ?? -1)) return { icon: "snow", label: "Nieve" } as const;
  if ([95, 96, 99].includes(code ?? -1)) return { icon: "storm", label: "Tormenta" } as const;
  return { icon: "cloud", label: "Sin descripción" } as const;
}
