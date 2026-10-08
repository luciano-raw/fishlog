"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search, Fish, ChevronRight } from "lucide-react";
import { encyclopediaData } from "@/lib/encyclopediaData";

export default function EncyclopediaPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSpecies = encyclopediaData.filter((species) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      species.name.toLowerCase().includes(searchLower) ||
      species.scientificName.toLowerCase().includes(searchLower) ||
      species.habitat.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-deep-black pb-32">
      {/* Header flotante */}
      <header className="sticky top-0 left-0 w-full p-4 z-10 flex items-center bg-deep-black/90 backdrop-blur-md border-b border-forest-green/20">
        <Link href="/" className="p-2 bg-charcoal rounded-full text-lime border border-forest-green/50 hover:bg-forest-green/20 transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-white ml-3 flex items-center gap-2">
          <Fish size={20} className="text-lime" /> Enciclopedia
        </h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Descripción */}
        <div>
          <h2 className="text-white font-bold text-xl mb-1">Guía de Especies</h2>
          <p className="text-light-gray/70 text-sm">
            Aprende sobre las especies, sus hábitats, características y los señuelos más efectivos.
          </p>
        </div>

        {/* Buscador */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-forest-green">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Buscar especie o hábitat..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-charcoal text-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-forest-green/20 focus:border-lime transition-colors"
          />
        </div>

        {/* Lista de Especies */}
        <div className="space-y-3">
          {filteredSpecies.length > 0 ? (
            filteredSpecies.map((species) => (
              <Link 
                key={species.id} 
                href={`/encyclopedia/${species.id}`}
                className="flex items-center gap-4 p-4 bg-charcoal rounded-3xl border border-forest-green/20 hover:border-lime transition-colors group shadow-lg"
              >
                {/* Imagen o Ícono */}
                <div className="w-16 h-16 rounded-2xl bg-deep-black border border-forest-green/30 flex items-center justify-center shrink-0 overflow-hidden">
                  {species.imageUrl ? (
                    <img src={species.imageUrl} alt={species.name} className="w-full h-full object-cover" />
                  ) : (
                    <Fish size={28} className="text-lime/50" />
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg group-hover:text-lime transition-colors truncate">{species.name}</h3>
                  <p className="text-light-gray/60 text-xs italic truncate">{species.scientificName}</p>
                </div>
                
                <ChevronRight className="text-forest-green group-hover:text-lime transition-colors shrink-0" />
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
