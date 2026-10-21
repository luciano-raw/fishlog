import { currentUser, auth } from "@clerk/nextjs/server";
import { MapPin, Bell, ChevronRight, Fish, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import MapDynamic from "@/components/MapDynamic";
import ImageWithFullscreen from "@/components/ImageWithFullscreen";
import WeatherWidget from "@/components/WeatherWidget";
import HomeTabs from "@/components/HomeTabs";
import FriendsActivity from "@/components/FriendsActivity";
import { mergeFriendActivity, type FriendActivity } from "@/lib/activityFeed";
import MapPointLink from "@/components/MapPointLink";
import type { Prisma, Shop } from "@prisma/client";
import { lureLabel } from "@/lib/lures";
import Welcome from "@/components/Welcome";
import CatchSocial from "@/components/CatchSocial";
import { hasCoordinates, mapPointHref } from "@/lib/mapLinks";

const publicAuthor = { select: { username: true, avatarUrl: true } } as const;
type CatchRecord = Prisma.CatchGetPayload<{ include: { user: typeof publicAuthor } }>;
type SpotRecord = Prisma.SpotGetPayload<{ include: { user: typeof publicAuthor } }>;
type HazardRecord = Prisma.HazardGetPayload<{ include: { user: typeof publicAuthor } }>;

export default async function Home({ searchParams }: { searchParams: Promise<{ activityPage?: string }> }) {
  const query = await searchParams;
  const requestedPage = Number(query.activityPage);
  const activityPage = Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, 100) : 1;
  const activityLimit = activityPage * 30;
  const { userId } = await auth();
  if (!userId) return <Welcome />;
  const user = await currentUser();
  const userName = user?.firstName || user?.username || "Angler";

  // Fetch friends first
  let friendIds: string[] = [];
  if (userId) {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: userId },
          { friendId: userId }
        ]
      }
    });
    
    // Extraer los IDs únicos de los amigos
    friendIds = [...new Set(friendships.map(f => f.userId === userId ? f.friendId : f.userId))].filter(id => id !== userId);
  }

  // Fetch recent data (Todos los usuarios)
  let recentCatches: CatchRecord[] = [];
  let spots: SpotRecord[] = [];
  let hazards: HazardRecord[] = [];
  let activities: FriendActivity[] = [];
  let personalCatchCount = 0;
  let shops: Shop[] = [];

  if (userId) {
    [recentCatches, spots, hazards, personalCatchCount, shops] = await Promise.all([prisma.catch.findMany({
      include: { user: publicAuthor },
      orderBy: { createdAt: "desc" },
      take: 20, // Más datos para poblar el mapa
    }), prisma.spot.findMany({
      include: { user: publicAuthor },
      orderBy: { createdAt: "desc" },
      take: 20,
    }), prisma.hazard.findMany({
      include: { user: publicAuthor },
      orderBy: { createdAt: "desc" },
      take: 20,
    }), prisma.catch.count({ where: { userId } }), prisma.shop.findMany({ orderBy: { name: "asc" } })]);
  }

  if (userId && friendIds.length > 0) {
    const options = {
      where: { userId: { in: friendIds } },
      include: { user: publicAuthor },
      orderBy: [{ createdAt: "desc" as const }, { id: "desc" as const }],
      take: activityLimit + 1,
    };
    const [friendCatches, friendSpots, friendHazards] = await Promise.all([
      prisma.catch.findMany(options), prisma.spot.findMany(options), prisma.hazard.findMany(options),
    ]);
    activities = mergeFriendActivity(friendCatches, friendSpots, friendHazards);
  }

  

  return (
    <div className="flex flex-col min-h-full p-4 space-y-4">
      {/* Header section */}
      <header className="flex justify-between items-center">
        <div>
          <p className="text-light-gray/70 text-sm font-medium">Buena pesca,</p>
          <h1 className="text-white text-xl font-bold tracking-tight">{userName}</h1>
        </div>
        <Link href="/notifications" className="relative p-2 bg-charcoal rounded-full border border-forest-green/30 hover:border-lime transition-colors">
          <Bell size={20} className="text-white" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-lime rounded-full border-2 border-charcoal"></span>
        </Link>
      </header>

      <HomeTabs friends={<FriendsActivity activities={activities.slice(0, activityLimit)} signedIn={!!userId} hasFriends={friendIds.length > 0} nextPage={activities.length > activityLimit && activityPage < 100 ? activityPage + 1 : null} />}>
      {/* Map first: the whole preview opens the interactive map. */}
      <section aria-label="Explorar el mapa" className="relative h-56 w-full shrink-0 overflow-hidden rounded-3xl border border-forest-green/30 bg-charcoal">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true" inert>
          <MapDynamic catches={recentCatches} spots={spots} hazards={hazards} shops={shops} interactive={false} />
        </div>
        <Link href="/map" className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-deep-black/95 via-transparent to-transparent p-4 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-lime">
          <span className="mb-1 flex items-center gap-2 text-lg font-bold text-white"><MapPin size={21} className="text-lime" />Explora el río</span>
          <span className="text-xs text-light-gray">Capturas, spots y peligros de la comunidad</span>
          <span className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-lime px-4 text-sm font-semibold text-deep-black">Explorar mapa<ChevronRight size={18} /></span>
        </Link>
      </section>

      <section aria-label="Tus capturas y el clima" className="grid grid-cols-2 gap-3">
        <Link href="/history" className="flex min-h-24 items-center gap-3 rounded-2xl border border-forest-green/20 bg-charcoal p-3 transition-colors hover:border-lime">
          <Fish size={24} className="shrink-0 text-lime" />
          <div><p className="text-2xl font-bold leading-none text-white">{personalCatchCount}</p><p className="mt-1 text-xs text-light-gray/70">Mis capturas</p></div>
        </Link>
        <WeatherWidget />
      </section>

            {/* Latest 4 Catches (2x2 Grid) */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-semibold">Últimas Capturas</h2>
          <Link href="/history" className="text-lime text-sm flex items-center">
            Ver todas <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {recentCatches.slice(0, 4).map(c => (
            <div key={c.id} className="flex flex-col bg-charcoal rounded-2xl overflow-hidden border border-forest-green/20 relative group">
              {c.imageUrl ? (
                <div className="aspect-[4/3] w-full relative">
                  <ImageWithFullscreen src={c.imageUrl} alt={c.species} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black/90 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white font-bold text-sm truncate">{c.species}</p>
                    <p className="text-lime text-[10px] font-medium">{c.weight ? `${c.weight}kg` : ''} {c.length ? `• ${c.length}cm` : ''}</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] w-full flex flex-col justify-end p-3">
                    <p className="text-white font-bold text-sm truncate">{c.species}</p>
                    <p className="text-lime text-[10px] font-medium">{c.weight ? `${c.weight}kg` : ''} {c.length ? `• ${c.length}cm` : ''}</p>
                </div>
              )}
              <div className="mt-auto px-1.5 pb-1 pt-1">{lureLabel(c.lureType) && <p className="truncate px-2 pb-1 text-[10px] text-light-gray/60">Con: {lureLabel(c.lureType)}</p>}<CatchSocial id={c.id} mapHref={hasCoordinates(c) ? mapPointHref("catch", c.id) : undefined} /></div>
            </div>
          ))}
          {recentCatches.length === 0 && <div className="col-span-2 text-center p-4 text-light-gray/60">No hay capturas aún.</div>}
        </div>
      </section>

      <section aria-label="Guías de pesca" className="grid grid-cols-2 gap-3">
        <Link href="/regulations" className="flex min-h-12 items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-light-gray transition-colors hover:border-lime">
          <BookOpen size={18} className="shrink-0 text-blue-400" />Reglamentos
        </Link>
        <Link href="/encyclopedia" className="flex min-h-12 items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-light-gray transition-colors hover:border-lime">
          <Fish size={18} className="shrink-0 text-lime" />Enciclopedia
        </Link>
      </section>

      {/* Feed Restante */}
      {recentCatches.length > 4 && (
        <section className="space-y-3 pt-4">
          <h2 className="text-white font-semibold">Feed Anterior</h2>
          <div className="space-y-3">
            {recentCatches.slice(4).map(c => (
              <div key={c.id} className="bg-charcoal border border-forest-green/20 rounded-2xl p-4 flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-lime text-deep-black flex items-center justify-center shrink-0 border-2 border-deep-black shadow-lg">
                  <Fish size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate">{c.species}</h3>
                  <p className="text-light-gray/60 text-xs truncate">{c.userId === userId ? "Pescado por ti" : `Pescado por ${c.user?.username || 'Amigo'}`}</p>
                  {lureLabel(c.lureType) && <p className="mt-1 text-xs text-light-gray/60">Con: {lureLabel(c.lureType)}</p>}
                  <div className="mt-2"><MapPointLink type="catch" point={c} /></div>
                  <div className="mt-2"><CatchSocial id={c.id} /></div>
                </div>
                {c.imageUrl && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      </HomeTabs>
    </div>
  );
}
