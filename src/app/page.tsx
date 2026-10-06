import { currentUser, auth } from "@clerk/nextjs/server";
import { Search, MapPin, Bell, Sun, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import MapDynamic from "@/components/MapDynamic";
import ImageWithFullscreen from "@/components/ImageWithFullscreen";
import WeatherWidget from "@/components/WeatherWidget";

export default async function Home() {
  const { userId } = await auth();
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
    friendIds = friendships.map(f => f.userId === userId ? f.friendId : f.userId);
  }

  // Fetch recent data (Todos los usuarios)
  let recentCatches: any[] = [];
  let spots: any[] = [];
  let hazards: any[] = [];

  if (userId) {
    recentCatches = await prisma.catch.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 20, // Más datos para poblar el mapa
    });

    spots = await prisma.spot.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    hazards = await prisma.hazard.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  const latestCatch = recentCatches[0];

  return (
    <div className="flex flex-col min-h-full p-4 space-y-6">
      {/* Header section */}
      <header className="flex justify-between items-center mt-2">
        <div>
          <p className="text-light-gray/70 text-sm font-medium">Buena pesca,</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">{userName}</h1>
        </div>
        <button className="relative p-2 bg-charcoal rounded-full border border-forest-green/30 hover:border-lime transition-colors">
          <Bell size={20} className="text-white" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-lime rounded-full border-2 border-charcoal"></span>
        </button>
      </header>

      {/* Stats / Weather Cards */}
      <section className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-charcoal p-5 rounded-3xl border border-forest-green/20 flex flex-col justify-center items-center text-center">
          <p className="text-light-gray/60 text-xs font-medium uppercase tracking-wider mb-1">Total Capturas</p>
          <p className="text-white font-bold text-4xl leading-none">{recentCatches.length}</p>
        </div>
        
        <WeatherWidget />
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
                <ImageWithFullscreen 
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
                  {latestCatch.userId === userId ? "Pescado por ti" : `Pescado por ${latestCatch.user?.username || "Amigo"}`} • {new Date(latestCatch.createdAt).toLocaleDateString()}
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
      <section className="relative w-full h-56 bg-charcoal rounded-3xl overflow-hidden border border-forest-green/20 shrink-0">
        {/* Dynamic Client-Side Map */}
        <div className="absolute inset-0 z-0 opacity-60">
          <MapDynamic catches={recentCatches} spots={spots} hazards={hazards} interactive={false} />
        </div>
        
        {/* Overlay gradient so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent z-0 pointer-events-none"></div>
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <MapPin size={32} className="text-lime mb-2 drop-shadow-[0_0_15px_rgba(164,255,61,0.8)]" />
          <h3 className="text-white font-semibold drop-shadow-md">Tus Hitos de Pesca</h3>
          <p className="text-light-gray text-sm mt-1 drop-shadow-md font-medium">
            {recentCatches.filter(c => c.locationLat).length + spots.length + hazards.length} lugares descubiertos
          </p>
          <Link href="/map" className="pointer-events-auto mt-4 px-6 py-2 bg-charcoal/90 text-lime rounded-full border border-lime/50 shadow-[0_0_15px_rgba(164,255,61,0.2)] hover:scale-105 transition-transform backdrop-blur-sm">
             Abrir Mapa Interactivo
          </Link>
        </div>
      </section>
    </div>
  );
}
