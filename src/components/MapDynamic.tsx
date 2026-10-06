"use client";

import dynamic from 'next/dynamic';

const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false, // Esto es vital para que Leaflet no rompa el servidor
    loading: () => (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-charcoal">
        <div className="text-lime animate-pulse text-sm uppercase tracking-widest font-semibold">
          Cargando Mapa...
        </div>
      </div>
    )
  }
);

interface MapProps {
  catches: any[];
  spots?: any[];
  hazards?: any[];
  interactive?: boolean;
}

export default function MapDynamicClient(props: MapProps) {
  return <MapComponent {...props} />;
}
