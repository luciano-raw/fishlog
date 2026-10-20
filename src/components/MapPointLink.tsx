import Link from "next/link";
import { MapPin } from "lucide-react";
import { hasCoordinates, mapPointHref, type MapPointType } from "@/lib/mapLinks";

interface Props {
  type: MapPointType;
  point: { id: string; locationLat: number | null; locationLng: number | null };
  fromFriends?: boolean;
}

export default function MapPointLink({ type, point, fromFriends = false }: Props) {
  if (!hasCoordinates(point)) return null;
  return (
    <Link href={mapPointHref(type, point.id, fromFriends)}
      className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-lime/30 px-3 py-2 text-xs font-semibold text-lime transition-colors hover:bg-lime/10">
      <MapPin size={14} aria-hidden="true" /> Ver en el mapa
    </Link>
  );
}
