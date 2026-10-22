"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  thumbnailSrc?: string | null;
}

export default function ImageWithFullscreen({ src, alt, className, thumbnailSrc }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const modalContent = isFullscreen && mounted ? (
    <div 
      className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in"
      onClick={() => setIsFullscreen(false)}
    >
      {/* Botón flotante para cerrar con la X */}
      <button 
        type="button"
        aria-label="Cerrar imagen"
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full border border-white/20 shadow-2xl transition-all z-10 flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          setIsFullscreen(false);
        }}
      >
        <X size={26} className="text-white drop-shadow" />
      </button>

      {/* Imagen centrada que no cierra al tocarse */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={src} 
        alt={alt}
        className="max-w-[95vw] max-h-[85vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 select-none"
        onClick={(e) => e.stopPropagation()} 
      />

      <p className="text-xs text-light-gray/60 mt-4 select-none">Toca fuera o la X para cerrar</p>
    </div>
  ) : null;

  return (
    <>
      {/* Imagen Normal / Miniatura */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={thumbnailSrc || src}
        alt={alt}
        className={`${className} cursor-pointer hover:opacity-90 active:scale-95 transition-all`}
        onClick={(e) => {
          e.stopPropagation();
          setIsFullscreen(true);
        }}
      />

      {/* Portal directo a document.body para que nunca quede atrapado en el popup de Leaflet */}
      {mounted && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
}
