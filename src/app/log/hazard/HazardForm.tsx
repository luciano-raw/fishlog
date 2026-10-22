"use client";

import { useState } from "react";
import { Loader2, MapPin, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveHazard } from "./actions";
import PointPhotoInput, { type PointPhoto } from "@/components/PointPhotoInput";
import LocationPickerDynamic from "@/components/LocationPickerDynamic";

export default function HazardForm() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [photo, setPhoto] = useState<PointPhoto | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          alert("No se pudo obtener la ubicación (Error: " + err.message + "). Por favor selecciona en el mapa.");
          setIsManualLocation(true);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setIsManualLocation(true);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (isPending || photoBusy) return;
    setError("");
    setIsPending(true);
    try {
      if (photo) { formData.set("image", photo.image); formData.set("thumbnail", photo.thumbnail); }
      const result = await saveHazard(formData);
      if (result.success) {
        alert("Peligro reportado con éxito.");
        router.push("/");
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error(error);
      setError("No pudimos guardar el peligro. Revisa tu conexión y vuelve a intentarlo.");
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
      <form onSubmit={event => { event.preventDefault(); void handleSubmit(new FormData(event.currentTarget)); }} className="space-y-5">
        {coords && (
          <>
            <input type="hidden" name="lat" value={coords.lat} />
            <input type="hidden" name="lng" value={coords.lng} />
          </>
        )}

        <PointPhotoInput hazard onChange={setPhoto} onBusyChange={setPhotoBusy} />

        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Peligro</label>
          <input type="text" name="name" required placeholder="ej. Corriente fuerte, Ramas hundidas" className="w-full bg-charcoal text-white rounded-2xl py-4 px-4 outline-none border border-red-500/50 focus:border-red-500" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nota adicional (Opcional)</label>
          <textarea name="note" placeholder="Detalles extra sobre el riesgo..." className="w-full bg-charcoal text-white rounded-2xl py-4 px-4 outline-none border border-red-500/20 focus:border-red-500 min-h-[100px]" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Ubicación</label>
            <button 
              type="button" 
              onClick={() => setIsManualLocation(!isManualLocation)}
              className="text-xs text-red-500 font-medium underline"
            >
              {isManualLocation ? "Usar mi GPS" : "Elegir en mapa"}
            </button>
          </div>

          {!isManualLocation ? (
            <button type="button" onClick={handleLocation} className="w-full flex items-center justify-between bg-charcoal rounded-2xl p-4 border border-red-500/30">
              <div className="flex items-center gap-3">
                <MapPin className={coords ? "text-red-500" : "text-light-gray/50"} size={20} />
                <div className="text-left">
                  <p className="text-white text-sm">{coords ? "Ubicación fijada ✓" : "Obtener ubicación actual"}</p>
                  <p className="text-light-gray/50 text-xs mt-0.5">{coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Obligatorio"}</p>
                </div>
              </div>
            </button>
          ) : (
            <LocationPickerDynamic position={coords} setPosition={setCoords} />
          )}
        </div>

        {error && <p role="alert" className="rounded-xl border border-red-400/30 p-3 text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={isPending || photoBusy || !coords} className="w-full bg-red-600 text-white font-bold text-lg py-4 rounded-2xl flex justify-center items-center gap-2 mt-4 shadow-[0_0_15px_rgba(220,38,38,0.3)] disabled:opacity-50 transition-opacity">
          {isPending ? <><Loader2 className="animate-spin" /> Reportando...</> : "Reportar Peligro"}
        </button>
      </form>
    </div>
  );
}
