import { currentUser, auth } from "@clerk/nextjs/server";
import { Search, MapPin, Bell, Sun, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import MapDynamic from "@/components/MapDynamic";

export default async function Home() {
  const { userId } = await auth();
  const user = await currentUser();
  const userName = user?.firstName || user?.username || "Angler";

  // Fetch recent catches for this user
  let recentCatches: any[] = [];
  if (userId) {
    recentCatches = await prisma.catch.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  }

  const latestCatch = recentCatches[0];

  return (
    <div className="flex flex-col min-h-full p-4 space-y-6">
      {/* Header section */}
      <header className="flex justify-between items-start mt-4">
        <div>
          <p className="text-light-gray/70 text-sm">Good morning,</p>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-white">{userName}</h1>
            <Sun className="text-lime" size={24} />
          </div>
          <p className="text-light-gray/50 text-xs mt-1">Conditions look great on the water.</p>
        </div>
        <button className="p-2 bg-charcoal rounded-full border border-forest-green/30">
          <Bell size={20} className="text-light-gray" />
        </button>
      </header>

      {/* Weather Card Placeholder */}
      <section className="bg-charcoal p-4 rounded-3xl border border-forest-green/20 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Sun className="text-[#F59E0B]" size={40} />
          <div>
            <span className="text-3xl font-light text-white">18°</span>
            <p className="text-light-gray/60 text-sm">Clear</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-light-gray/60">
          <div>Wind</div><div className="text-white text-right">8 km/h NE</div>
          <div>Pressure</div><div className="text-white text-right">1018 hPa</div>
          <div>Moon</div><div className="text-white text-right">Waning</div>
        </div>
      </section>

      {/* Filters */}
      <section className="flex items-center gap-3">
        <button className="px-4 py-1.5 bg-lime text-deep-black rounded-full text-sm font-semibold">Nearby</button>
        <button className="px-4 py-1.5 text-light-gray/60 hover:text-white rounded-full text-sm">Favorites</button>
        <button className="px-4 py-1.5 text-light-gray/60 hover:text-white rounded-full text-sm">Recent</button>
        <div className="flex-1" />
        <button className="p-2 text-light-gray/60"><Search size={18} /></button>
      </section>

      {/* Latest Catch Section */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-semibold">Última Captura</h2>
          <Link href="/history" className="text-lime text-sm flex items-center">
            Ver todas <ChevronRight size={16} />
          </Link>
        </div>

        {latestCatch ? (
          <div className="bg-charcoal rounded-3xl overflow-hidden border border-forest-green/20">
            {latestCatch.imageUrl && (
              <div className="relative w-full h-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={latestCatch.imageUrl} 
                  alt={latestCatch.species}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-lg">{latestCatch.species}</h3>
                <p className="text-light-gray/60 text-sm">
                  {new Date(latestCatch.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lime font-bold">{latestCatch.weight ? `${latestCatch.weight} kg` : '--'}</p>
                <p className="text-light-gray/60 text-sm">{latestCatch.length ? `${latestCatch.length} cm` : '--'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-charcoal p-6 rounded-3xl border border-forest-green/20 text-center text-light-gray/60">
            Aún no has registrado ninguna captura.
          </div>
        )}
      </section>

      {/* Map Preview Area */}
      <section className="relative flex-1 bg-charcoal rounded-3xl overflow-hidden border border-forest-green/20 min-h-[300px]">
        {/* Dynamic Client-Side Map */}
        <div className="absolute inset-0 z-0 opacity-60">
          <MapDynamic catches={recentCatches} interactive={false} />
        </div>
        
        {/* Overlay gradient so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent z-0 pointer-events-none"></div>
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <MapPin size={32} className="text-lime mb-2 drop-shadow-[0_0_15px_rgba(164,255,61,0.8)]" />
          <h3 className="text-white font-semibold drop-shadow-md">Tus Hitos de Pesca</h3>
          <p className="text-light-gray text-sm mt-1 drop-shadow-md font-medium">
            {recentCatches.filter(c => c.locationLat).length} lugares descubiertos
          </p>
          <Link href="/map" className="pointer-events-auto mt-4 px-6 py-2 bg-charcoal/90 text-lime rounded-full border border-lime/50 shadow-[0_0_15px_rgba(164,255,61,0.2)] hover:scale-105 transition-transform backdrop-blur-sm">
            Abrir Mapa Interactivo
          </Link>
        </div>
      </section>
    </div>
  );
}
