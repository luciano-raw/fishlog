"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const PickerMap = dynamic(
  () => import('./LocationPickerMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-64 w-full mt-3 rounded-2xl flex flex-col items-center justify-center bg-charcoal border border-forest-green/30">
        <Loader2 className="animate-spin text-lime mb-2" size={24} />
        <span className="text-lime text-xs font-semibold uppercase tracking-widest">Cargando Mapa...</span>
      </div>
    )
  }
);

interface Props {
  position: {lat: number, lng: number} | null;
  setPosition: (p: {lat: number, lng: number}) => void;
}

export default function LocationPickerDynamic(props: Props) {
  return <PickerMap {...props} />;
}
