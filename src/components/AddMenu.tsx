"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Plus, Fish, MapPin, AlertTriangle, X } from "lucide-react";

export default function AddMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative -top-5">
      {/* Botón Flotante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 bg-lime rounded-full shadow-[0_0_15px_rgba(164,255,61,0.3)] text-deep-black transition-transform duration-300 ${isOpen ? 'rotate-45' : 'hover:scale-105'}`}
      >
        <Plus size={32} strokeWidth={2.5} />
      </button>

      {/* Menú Desplegable usando Portal para escapar del stacking context del navbar */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Fondo oscuro para cerrar al hacer clic afuera */}
          <div 
            className="fixed inset-0 z-[2010] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-[2020] transition-all">
            {/* Opción 1: Peligro */}
            <Link 
              href="/log/hazard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-end gap-3 group"
            >
              <span className="bg-deep-black text-white text-xs font-medium px-3 py-1.5 rounded-full border border-forest-green/30">Peligro</span>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-deep-black group-hover:scale-110 transition-transform">
                <AlertTriangle size={20} />
              </div>
            </Link>

            {/* Opción 2: Spot */}
            <Link 
              href="/log/spot"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-end gap-3 group"
            >
              <span className="bg-deep-black text-white text-xs font-medium px-3 py-1.5 rounded-full border border-forest-green/30">Lugar (Spot)</span>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-deep-black group-hover:scale-110 transition-transform">
                <MapPin size={20} />
              </div>
            </Link>

            {/* Opción 3: Captura (Principal) */}
            <Link 
              href="/log"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-end gap-3 group"
            >
              <span className="bg-deep-black text-white text-xs font-medium px-3 py-1.5 rounded-full border border-forest-green/30">Captura</span>
              <div className="w-14 h-14 bg-lime rounded-full flex items-center justify-center text-deep-black shadow-[0_0_15px_rgba(164,255,61,0.3)] border-2 border-deep-black group-hover:scale-110 transition-transform">
                <Fish size={24} />
              </div>
            </Link>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
