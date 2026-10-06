"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageWithFullscreen({ src, alt, className }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      {/* Imagen Normal */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={src} 
        alt={alt}
        className={`${className} cursor-pointer hover:opacity-90 transition-opacity`}
        onClick={() => setIsFullscreen(true)}
      />

      {/* Modal Pantalla Completa */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button 
            className="absolute top-safe-top right-4 p-2 bg-charcoal/50 text-white rounded-full mt-4"
            onClick={() => setIsFullscreen(false)}
          >
            <X size={24} />
          </button>
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={src} 
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al tocar la foto en sí
          />
        </div>
      )}
    </>
  );
}
