export type Coordinates = { lat: number; lng: number };
export type PlaceResult = Coordinates & { id: string; name: string; detail: string; bounds?: [number, number, number, number] };

export function placeSearchUrl(query: string, chile: boolean, endpoint = "https://photon.komoot.io/api/") {
  const url = new URL(endpoint);
  url.searchParams.set("q", query.trim().replace(/\s+/g, " "));
  url.searchParams.set("limit", "6");
  url.searchParams.set("lang", "default");
  if (chile) url.searchParams.set("countrycode", "CL");
  return url;
}

export function parsePlaces(data: unknown): PlaceResult[] {
  if (!data || typeof data !== "object" || !("features" in data) || !Array.isArray(data.features)) throw new Error("Invalid place response");
  const results: PlaceResult[] = [];
  for (const feature of data.features.slice(0, 30)) {
    const properties = feature?.properties;
    const coordinates = feature?.geometry?.coordinates;
    if (feature?.geometry?.type !== "Point" || !Array.isArray(coordinates) || !properties) continue;
    const [lng, lat] = coordinates;
    if (typeof lat !== "number" || typeof lng !== "number" || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) continue;
    const text = (value: unknown) => typeof value === "string" ? value.slice(0, 250) : "";
    const name = text(properties.name) || text(properties.street) || text(properties.city);
    if (!name) continue;
    const detail = [...new Set([properties.street, properties.city, properties.county, properties.state, properties.country].map(text).filter(part => part && part !== name))].join(", ");
    const id = `${lat}:${lng}:${name}`;
    if (results.some(result => result.id === id)) continue;
    const extent = properties.extent;
    // Photon extent is [west, north, east, south], unlike GeoJSON bbox.
    const bounds: PlaceResult["bounds"] = Array.isArray(extent) && extent.length === 4 && extent.every((n: unknown) => typeof n === "number" && Number.isFinite(n)) && extent[0] >= -180 && extent[2] <= 180 && extent[3] >= -90 && extent[1] <= 90 && extent[0] < extent[2] && extent[3] < extent[1] ? [extent[3], extent[0], extent[1], extent[2]] : undefined;
    results.push({ id, name, detail, lat, lng, ...(bounds ? { bounds } : {}) });
    if (results.length === 6) break;
  }
  return results;
}
