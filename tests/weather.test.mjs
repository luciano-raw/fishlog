import test from "node:test";
import assert from "node:assert/strict";
import { parseWeather, weatherUrl, weatherCondition } from "../src/lib/weather.ts";

const epoch = iso => Date.parse(iso) / 1000;
function forecast() {
  return {
    timezone: "America/Santiago",
    current: { time: epoch("2026-10-21T01:30:00Z"), temperature_2m: 0, relative_humidity_2m: 0, wind_speed_10m: 0, weather_code: 0, is_day: 0 },
    hourly: {
      time: Array.from({ length: 15 }, (_, i) => epoch("2026-10-21T00:00:00Z") + i * 3600),
      temperature_2m: Array(15).fill(12), precipitation_probability: Array(15).fill(0),
      weather_code: Array(15).fill(3), is_day: Array(15).fill(0), wind_speed_10m: Array(15).fill(0),
    },
    daily: {
      time: [epoch("2026-10-20T03:00:00Z"), epoch("2026-10-21T03:00:00Z")],
      sunrise: [epoch("2026-10-20T10:00:00Z"), epoch("2026-10-21T10:00:00Z")],
      sunset: [epoch("2026-10-20T23:00:00Z"), epoch("2026-10-21T23:00:00Z")],
    },
  };
}

test("hourly forecast excludes past hours, spans midnight and limits to twelve", () => {
  const data = parseWeather(forecast(), Date.parse("2026-10-21T01:30:00Z"));
  assert.equal(data.hours.length, 12);
  assert.equal(data.hours[0].time, epoch("2026-10-21T02:00:00Z"));
  assert.equal(data.hours.at(-1).time, epoch("2026-10-21T13:00:00Z"));
  assert.equal(data.current.temperature, 0);
  assert.equal(data.current.humidity, 0);
  assert.equal(data.hours[0].rainProbability, 0);
  assert.equal(data.hours[0].wind, 0);
});

test("sunrise and sunset use the location's day rather than UTC's day", () => {
  const data = parseWeather(forecast(), Date.parse("2026-10-21T01:30:00Z"));
  assert.equal(data.sunrise, epoch("2026-10-20T10:00:00Z"));
  assert.equal(data.sunset, epoch("2026-10-20T23:00:00Z"));
});

test("missing data stays unavailable and malformed current weather is rejected", () => {
  const payload = forecast();
  payload.hourly.temperature_2m[2] = null;
  delete payload.current.relative_humidity_2m;
  delete payload.hourly.precipitation_probability;
  delete payload.daily;
  const data = parseWeather(payload, Date.parse("2026-10-21T01:30:00Z"));
  assert.equal(data.current.humidity, null);
  assert.equal(data.hours[0].rainProbability, null);
  assert.equal(data.hours[0].time, epoch("2026-10-21T03:00:00Z"));
  assert.equal(data.sunrise, null);
  assert.throws(() => parseWeather({ error: true }));
});

test("weather codes distinguish night, fog, snow and thunderstorms", () => {
  assert.equal(weatherCondition(0, false).icon, "moon");
  assert.equal(weatherCondition(0, true).icon, "sun");
  assert.equal(weatherCondition(45, true).label, "Niebla");
  assert.equal(weatherCondition(75, true).label, "Nieve");
  assert.equal(weatherCondition(95, true).label, "Tormenta");
});

test("request explicitly asks for local sunrise/sunset and thirteen hourly timesteps", () => {
  const url = new URL(weatherUrl(-33.45, -70.66));
  assert.equal(url.searchParams.get("forecast_hours"), "13");
  assert.equal(url.searchParams.get("timezone"), "auto");
  assert.equal(url.searchParams.get("timeformat"), "unixtime");
  assert.equal(url.searchParams.get("daily"), "sunrise,sunset");
});
