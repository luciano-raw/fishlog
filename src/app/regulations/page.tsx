"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search, Scale, ChevronRight } from "lucide-react";
import { regulationsData } from "@/lib/regulationsData";

export default function RegulationsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRegions = regulationsData.filter((region) => {
    const searchLower = searchTerm.toLowerCase();
    const matchName = region.name.toLowerCase().includes(searchLower);
    const matchExceptions = region.exceptions.some(e => 
      e.location.toLowerCase().includes(searchLower) || 
      e.details.toLowerCase().includes(searchLower)
    );
    return matchName || matchExceptions;
  });

  return (
    <div className="flex flex-col min-h-screen bg-deep-black pb-32">
      {/* Header flotante */}
      <header className="sticky top-0 left-0 w-full p-4 z-10 flex items-center bg-deep-black/90 backdrop-blur-md border-b border-forest-green/20">
        <Link href="/" className="p-2 bg-charcoal rounded-full text-lime border border-forest-green/50">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-white ml-3 flex items-center gap-2">
          <Scale size={20} className="text-lime" /> Reglamentos
        </h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Descripción */}
        <div>
          <h2 className="text-white font-bold text-xl mb-1">Normativa Vigente (Chile)</h2>
          <p className="text-light-gray/70 text-sm">
            Encuentra rápidamente las temporadas, cuotas y excepciones por cuenca según la ley de pesca recreativa.
          </p>
        </div>

        {/* Buscador */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-forest-green">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Buscar región, río, lago..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-charcoal text-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-forest-green/20 focus:border-lime transition-colors"
          />
        </div>

        {/* Lista de Regiones */}
        <div className="space-y-3">
          {filteredRegions.length > 0 ? (
            filteredRegions.map((region) => (
              <Link 
                key={region.id} 
                href={`/regulations/${region.id}`}
                className="flex items-center justify-between p-4 bg-charcoal rounded-2xl border border-forest-green/20 hover:border-lime transition-colors group"
              >
                <div>
                  <h3 className="text-white font-bold text-lg group-hover:text-lime transition-colors">{region.name}</h3>
                  <p className="text-light-gray/60 text-xs mt-1">Temporada: {region.generalSeason.split(" ")[0]}...</p>
                </div>
                <ChevronRight className="text-forest-green group-hover:text-lime transition-colors" />
              </Link>
            ))
          ) : (
            <div className="text-center p-8 bg-charcoal rounded-3xl border border-forest-green/20">
              <p className="text-light-gray/60">No se encontraron resultados para &quot;{searchTerm}&quot;.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
