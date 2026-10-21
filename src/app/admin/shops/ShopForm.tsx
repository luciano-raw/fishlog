"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import LocationPickerDynamic from "@/components/LocationPickerDynamic";
import { saveShop, deleteShop } from "./actions";

interface ShopData {
  id: string; name: string; description: string | null; address: string | null; website: string | null;
  locationLat: number; locationLng: number;
}
const inputClass = "w-full rounded-2xl border border-forest-green/30 bg-charcoal p-3 text-white outline-none focus:border-amber-300";

export default function ShopForm({ shop }: { shop?: ShopData }) {
  const router = useRouter();
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(shop ? { lat: shop.locationLat, lng: shop.locationLng } : null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  return <form className="space-y-4" action={data => {
    startTransition(async () => {
      setError(null);
      try {
        const result = await saveShop(data);
        router.push(`/map?shopId=${encodeURIComponent(result.id)}`);
      } catch (error) { setError(error instanceof Error ? error.message : "No se pudo guardar la tienda."); }
    });
  }}>
    {shop && <input type="hidden" name="id" value={shop.id} />}
    {position && <><input type="hidden" name="lat" value={position.lat} /><input type="hidden" name="lng" value={position.lng} /></>}
    <div><label htmlFor="shop-name" className="mb-2 block text-sm">Nombre</label><input id="shop-name" name="name" required maxLength={120} defaultValue={shop?.name} className={inputClass} /></div>
    <div><label htmlFor="shop-description" className="mb-2 block text-sm">Qué ofrece (opcional)</label><textarea id="shop-description" name="description" rows={3} maxLength={1200} defaultValue={shop?.description ?? ""} className={inputClass} placeholder="Tienda de pesca, carnadas, artículos de camping..." /></div>
    <div><label htmlFor="shop-address" className="mb-2 block text-sm">Dirección (opcional)</label><input id="shop-address" name="address" maxLength={250} defaultValue={shop?.address ?? ""} className={inputClass} /></div>
    <div><label htmlFor="shop-website" className="mb-2 block text-sm">Sitio web o red social (opcional)</label><input id="shop-website" name="website" type="url" maxLength={500} defaultValue={shop?.website ?? ""} className={inputClass} placeholder="https://..." /></div>
    <div><p className="text-sm">Ubicación de la tienda</p><LocationPickerDynamic position={position} setPosition={setPosition} />
      <p className="mt-2 text-xs text-light-gray/50">{position ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` : "Toca el mapa para ubicar la tienda."}</p>
    </div>
    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    <button type="submit" disabled={pending || !position} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-300 font-bold text-deep-black disabled:opacity-50">{pending && <Loader2 size={18} className="animate-spin" />}{pending ? "Guardando..." : shop ? "Guardar cambios" : "Agregar tienda al mapa"}</button>
  </form>;
}

export function ShopDeleteButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return <div>
    <button type="button" disabled={pending} className="min-h-10 text-xs text-red-300 disabled:opacity-50" onClick={() => {
      if (!window.confirm(`¿Eliminar la tienda «${name}» del mapa?`)) return;
      startTransition(async () => {
        setError(null);
        try { await deleteShop(id); } catch { setError("No se pudo eliminar la tienda."); }
      });
    }}>{pending ? "Eliminando..." : "Eliminar"}</button>
    {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
  </div>;
}
