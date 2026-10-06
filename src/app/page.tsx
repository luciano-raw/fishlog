import { currentUser, auth } from "@clerk/nextjs/server";
import { Search, MapPin, Bell, Sun, ChevronRight, Fish } from "lucide-react";
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
            <div key={c.id} className="bg-charcoal rounded-2xl overflow-hidden border border-forest-green/20 relative group">
              {c.imageUrl ? (
                <div className="w-full h-24 relative">
                  <ImageWithFullscreen src={c.imageUrl} alt={c.species} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black/90 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white font-bold text-sm truncate">{c.species}</p>
                    <p className="text-lime text-[10px] font-medium">{c.weight ? `${c.weight}kg` : ''} {c.length ? `• ${c.length}cm` : ''}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-24 flex flex-col justify-end p-3">
                    <p className="text-white font-bold text-sm truncate">{c.species}</p>
                    <p className="text-lime text-[10px] font-medium">{c.weight ? `${c.weight}kg` : ''} {c.length ? `• ${c.length}cm` : ''}</p>
                </div>
              )}
            </div>
          ))}
          {recentCatches.length === 0 && <div className="col-span-2 text-center p-4 text-light-gray/60">No hay capturas aún.</div>}
        </div>
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
    </div>
  );
}
