import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import MapDynamic from "@/components/MapDynamic";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { MapTarget } from "@/lib/mapLinks";

export default async function MapPage({ searchParams }: {
  searchParams: Promise<{ catchId?: string; spotId?: string; hazardId?: string; shopId?: string; from?: string }>;
}) {
  const query = await searchParams;
  let target: MapTarget | undefined;
  if (typeof query.catchId === "string") target = { type: "catch", id: query.catchId };
  else if (typeof query.spotId === "string") target = { type: "spot", id: query.spotId };
  else if (typeof query.hazardId === "string") target = { type: "hazard", id: query.hazardId };
  else if (typeof query.shopId === "string") target = { type: "shop", id: query.shopId };
  const { userId } = await auth();
  const shops = await prisma.shop.findMany({
    select: { id: true, name: true, description: true, address: true, website: true, locationLat: true, locationLng: true },
    orderBy: { createdAt: "desc" },
  });
  
  let catches: any[] = [];
  let spots: any[] = [];
  let hazards: any[] = [];

  if (userId) {
    catches = await prisma.catch.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    spots = await prisma.spot.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    hazards = await prisma.hazard.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black relative">
      {/* Header flotante */}
      <header className="absolute top-0 left-0 w-full p-4 z-10 flex items-center bg-gradient-to-b from-deep-black/80 to-transparent pointer-events-none">
        <Link href={query.from === "friends" ? "/?feed=friends" : "/"} aria-label={query.from === "friends" ? "Volver a Amigos" : "Volver al inicio"} className="pointer-events-auto p-2 bg-charcoal/80 rounded-full text-lime backdrop-blur-sm border border-forest-green/50">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-white drop-shadow-md ml-3">Explorar Hitos</h1>
      </header>

      {/* Mapa Interactivo */}
      <main className="flex-1">
        <MapDynamic catches={catches} spots={spots} hazards={hazards} shops={shops} interactive={true} target={target} />
      </main>
    </div>
  );
}
