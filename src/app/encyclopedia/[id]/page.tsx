import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Info, MapPin, Anchor, Fish } from "lucide-react";
import { encyclopediaData } from "@/lib/encyclopediaData";
import ImageWithFullscreen from "@/components/ImageWithFullscreen";

export default async function SpeciesDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const species = encyclopediaData.find((s) => s.id === id);

  if (!species) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black pb-32">
      {/* Header Fijo */}
      <header className="fixed top-0 left-0 w-full p-4 z-20 flex items-center justify-between bg-gradient-to-b from-deep-black/90 to-transparent pointer-events-none">
        <Link href="/encyclopedia" className="pointer-events-auto p-2 bg-charcoal/80 backdrop-blur-md rounded-full text-white hover:text-lime transition-colors border border-white/10 shadow-lg">
          <ChevronLeft size={24} />
        </Link>
      </header>

      {/* Hero Image */}
      <div className="relative w-full h-80 bg-charcoal border-b border-forest-green/30">
        {species.imageUrl ? (
          <ImageWithFullscreen src={species.imageUrl} alt={species.name} className="w-full h-full object-cover cursor-pointer" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-forest-green/50">
            <Fish size={80} className="mb-4" />
            <p className="text-sm font-medium">Sin imagen disponible</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/40 to-transparent pointer-events-none"></div>
        
        {/* Título superpuesto */}
        <div className="absolute bottom-0 left-0 w-full p-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-md leading-tight">{species.name}</h1>
          <p className="text-lime font-medium italic mt-1 drop-shadow-md">{species.scientificName}</p>
        </div>
      </div>

      <main className="p-4 space-y-6 mt-4">
        {/* Descripción */}
        <section className="bg-charcoal p-6 rounded-3xl border border-forest-green/20">
          <div className="flex items-center gap-2 mb-3 text-forest-green font-bold uppercase tracking-wider text-xs">
            <Info size={16} /> Descripción
          </div>
          <p className="text-light-gray/90 leading-relaxed text-sm">
            {species.description}
          </p>
        </section>

        {/* Hábitat */}
        <section className="bg-charcoal p-6 rounded-3xl border border-forest-green/20">
          <div className="flex items-center gap-2 mb-3 text-forest-green font-bold uppercase tracking-wider text-xs">
            <MapPin size={16} /> Dónde encontrarlo
          </div>
          <p className="text-light-gray/90 leading-relaxed text-sm">
            {species.habitat}
          </p>
        </section>

        {/* Señuelos Recomendados */}
        <section className="bg-lime p-6 rounded-3xl text-deep-black shadow-[0_0_20px_rgba(164,255,61,0.1)] relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Anchor size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 font-bold uppercase tracking-wider text-xs">
              <Anchor size={16} /> Señuelos y Moscas
            </div>
            <p className="font-medium leading-relaxed text-sm">
              {species.recommendedLures}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
