"use client";

import { useState } from "react";
import { Loader2, MapPin, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveHazard } from "./actions";

export default function HazardForm() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => alert("No se pudo obtener la ubicación: " + err.message)
      );
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      const result = await saveHazard(formData);
      if (result.success) {
        alert("Peligro reportado con éxito.");
        router.push("/");
      } else {
        alert("Hubo un error al reportar el peligro.");
      }
    } catch (error) {
      console.error(error);
      alert("Error inesperado.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-deep-black p-4 text-light-gray pb-32">
      <div className="flex items-center gap-3 mb-6 text-red-500">
        <AlertTriangle size={32} />
        <h1 className="text-2xl font-bold text-white">Reportar Peligro</h1>
      </div>
      <form action={handleSubmit} className="space-y-5">
        {coords && (
          <>
            <input type="hidden" name="lat" value={coords.lat} />
            <input type="hidden" name="lng" value={coords.lng} />
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Peligro</label>
          <input type="text" name="name" required placeholder="ej. Corriente fuerte, Ramas hundidas" className="w-full bg-charcoal text-white rounded-2xl py-4 px-4 outline-none border border-red-500/50 focus:border-red-500" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nota adicional (Opcional)</label>
          <textarea name="note" placeholder="Detalles extra sobre el riesgo..." className="w-full bg-charcoal text-white rounded-2xl py-4 px-4 outline-none border border-red-500/20 focus:border-red-500 min-h-[100px]" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ubicación</label>
          <button type="button" onClick={handleLocation} className="w-full flex items-center justify-between bg-charcoal rounded-2xl p-4 border border-red-500/30">
            <div className="flex items-center gap-3">
              <MapPin className={coords ? "text-red-500" : "text-light-gray/50"} size={20} />
              <div className="text-left">
                <p className="text-white text-sm">{coords ? "Ubicación fijada ✓" : "Obtener ubicación actual"}</p>
                <p className="text-light-gray/50 text-xs mt-0.5">{coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Obligatorio"}</p>
              </div>
            </div>
          </button>
        </div>

        <button type="submit" disabled={isPending || !coords} className="w-full bg-red-600 text-white font-bold text-lg py-4 rounded-2xl flex justify-center items-center gap-2 mt-4 shadow-[0_0_15px_rgba(220,38,38,0.3)] disabled:opacity-50">
          {isPending ? <><Loader2 className="animate-spin" /> Reportando...</> : "Reportar Peligro"}
        </button>
      </form>
    </div>
  );
}
