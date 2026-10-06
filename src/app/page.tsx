import { currentUser } from "@clerk/nextjs/server";
import { Search, MapPin, Bell, Sun } from "lucide-react";

export default async function Home() {
  const user = await currentUser();
  const userName = user?.firstName || user?.username || "Angler";

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

      {/* Map Preview Area */}
      <section className="relative flex-1 bg-charcoal rounded-3xl overflow-hidden border border-forest-green/20 min-h-[300px] flex items-center justify-center">
        {/* Decorative background simulating a map */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lime via-deep-black to-deep-black"></div>
        
        <div className="text-center z-10 flex flex-col items-center">
          <MapPin size={32} className="text-forest-green mb-2 opacity-50" />
          <p className="text-light-gray/60 text-sm">Tu mapa personal está vacío.</p>
          <p className="text-light-gray/40 text-xs mt-1">Registra una pesca para empezar.</p>
        </div>
      </section>
    </div>
  );
}
