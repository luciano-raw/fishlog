export type MapPointType = "catch" | "spot" | "hazard" | "shop";

export interface MapTarget {
  type: MapPointType;
  id: string;
}

export function hasCoordinates(point: { locationLat: number | null; locationLng: number | null }) {
  return point.locationLat !== null && point.locationLng !== null
    && Number.isFinite(point.locationLat) && Number.isFinite(point.locationLng)
    && Math.abs(point.locationLat) <= 90 && Math.abs(point.locationLng) <= 180;
}

export function mapPointHref(type: MapPointType, id: string, fromFriends = false) {
  const params = new URLSearchParams({ [`${type}Id`]: id });
  if (fromFriends) params.set("from", "friends");
  return `/map?${params}`;
}
