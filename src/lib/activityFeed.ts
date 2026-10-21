import type { MapPointType } from "./mapLinks";

interface ActivityRecord {
  id: string;
  createdAt: Date;
  locationLat: number | null;
  locationLng: number | null;
  user: { username: string | null };
}

export interface FriendActivity {
  id: string;
  type: Exclude<MapPointType, "shop">;
  name: string;
  username: string | null;
  createdAt: Date;
  imageUrl: string | null;
  detail: string | null;
  locationLat: number | null;
  locationLng: number | null;
  lureType?: string | null;
}

type CatchActivity = ActivityRecord & { species: string; weight: number | null; length: number | null; imageUrl: string | null; lureType?: string | null };
type SpotActivity = ActivityRecord & { name: string; speciesSeen: string | null; imageUrl: string | null };
type HazardActivity = ActivityRecord & { name: string; note: string | null };

export function mergeFriendActivity(catches: CatchActivity[], spots: SpotActivity[], hazards: HazardActivity[]): FriendActivity[] {
  const base = (record: ActivityRecord) => ({
    id: record.id, createdAt: record.createdAt, username: record.user.username,
    locationLat: record.locationLat, locationLng: record.locationLng,
  });
  return [
    ...catches.map(c => ({ ...base(c), type: "catch" as const, name: c.species, imageUrl: c.imageUrl, lureType: c.lureType ?? null, detail: [c.weight != null ? `${c.weight} kg` : null, c.length != null ? `${c.length} cm` : null].filter(Boolean).join(" · ") || null })),
    ...spots.map(s => ({ ...base(s), type: "spot" as const, name: s.name, imageUrl: s.imageUrl, detail: s.speciesSeen ? `Especies observadas: ${s.speciesSeen}` : null })),
    ...hazards.map(h => ({ ...base(h), type: "hazard" as const, name: h.name, imageUrl: null, detail: h.note })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id.localeCompare(a.id) || a.type.localeCompare(b.type));
}
