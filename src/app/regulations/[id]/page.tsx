import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CalendarDays, Fish, Download, MapPin, Scale } from "lucide-react";
import { regulationsData } from "@/lib/regulationsData";
import AccordionItem from "./AccordionItem"; // Crearemos esto

export default async function RegionRegulationPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const region = regulationsData.find((r) => r.id === id);

  if (!region) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black pb-32">
      {/* Header */}
      <header className="sticky top-0 left-0 w-full p-4 z-20 flex items-center bg-deep-black/90 backdrop-blur-md border-b border-forest-green/20">
        <Link href="/regulations" className="p-2 bg-charcoal rounded-full text-lime border border-forest-green/50">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-white ml-3 truncate flex-1">{region.name}</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Banner de Temporada */}
        <div className="bg-lime p-5 rounded-3xl text-deep-black relative overflow-hidden shadow-[0_0_20px_rgba(164,255,61,0.15)]">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Scale size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider text-xs">
              <CalendarDays size={16} /> Temporada General
            </div>
            <p className="font-bold text-xl leading-tight">{region.generalSeason}</p>
          </div>
        </div>

        {/* Límite General */}
        <div className="bg-charcoal p-5 rounded-3xl border border-forest-green/20">
          <div className="flex items-center gap-2 mb-2 text-forest-green font-bold uppercase tracking-wider text-xs">
            <Fish size={16} /> Límites de Captura General
          </div>
          <p className="text-white text-lg font-medium">{region.generalLimit}</p>
        </div>

        {/* Excepciones (Acordeones) */}
        <div>
          <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
            <MapPin size={20} className="text-lime" /> Excepciones por Cuenca
          </h2>
          {region.exceptions.length > 0 ? (
            <div className="space-y-3">
              {region.exceptions.map((exc, i) => (
                <AccordionItem key={i} title={exc.location} content={exc.details} />
              ))}
            </div>
          ) : (
            <div className="bg-charcoal p-6 rounded-3xl border border-forest-green/20 text-center">
              <p className="text-light-gray/60 text-sm">
                Actualmente no hay excepciones registradas en la base de datos para esta región. Se aplica el reglamento general.
              </p>
            </div>
          )}
        </div>

        {/* PDF Download */}
        {region.pdfUrl && (
          <div className="pt-4">
            <a 
              href={region.pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-deep-black text-[#3b82f6] font-bold text-lg py-4 rounded-2xl border border-[#3b82f6]/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:bg-[#3b82f6]/10 transition-colors"
            >
              <Download size={24} />
              Ver Decreto Oficial (PDF)
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
