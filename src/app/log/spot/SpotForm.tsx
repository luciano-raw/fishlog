"use client";

import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveSpot } from "./actions";
import PointPhotoInput, { type PointPhoto } from "@/components/PointPhotoInput";
import LocationPickerDynamic from "@/components/LocationPickerDynamic";

export default function SpotForm() {
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
      const result = await saveSpot(formData);
      if (result.success) {
        alert("Lugar guardado con éxito.");
        router.push("/");
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (error: unknown) {
      console.error(error);
      setError("No pudimos guardar el lugar. Revisa tu conexión y vuelve a intentarlo.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-deep-black p-4 text-light-gray pb-32">
      <h1 className="text-2xl font-bold text-white mb-6">Guardar Spot (Lugar)</h1>
      <form onSubmit={event => { event.preventDefault(); void handleSubmit(new FormData(event.currentTarget)); }} className="space-y-5">
        {coords && (
          <>
            <input type="hidden" name="lat" value={coords.lat} />
            <input type="hidden" name="lng" value={coords.lng} />
          </>
        )}

        <PointPhotoInput onChange={setPhoto} onBusyChange={setPhotoBusy} />

        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre del Lugar</label>
          <input type="text" name="name" required placeholder="ej. Pozo de las truchas" className="w-full bg-charcoal text-white rounded-2xl py-4 px-4 outline-none border border-forest-green/20" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Especies Vistas (Opcional)</label>
          <input type="text" name="species" placeholder="ej. Carpa, Pejerrey" className="w-full bg-charcoal text-white rounded-2xl py-4 px-4 outline-none border border-forest-green/20" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Ubicación</label>
            <button 
              type="button" 
              onClick={() => setIsManualLocation(!isManualLocation)}
              className="text-xs text-[#3b82f6] font-medium underline"
            >
              {isManualLocation ? "Usar mi GPS" : "Elegir en mapa"}
            </button>
          </div>

          {!isManualLocation ? (
            <button type="button" onClick={handleLocation} className="w-full flex items-center justify-between bg-charcoal rounded-2xl p-4 border border-[#3b82f6]/30">
              <div className="flex items-center gap-3">
                <MapPin className={coords ? "text-[#3b82f6]" : "text-light-gray/50"} size={20} />
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
        <button type="submit" disabled={isPending || photoBusy || !coords} className="w-full bg-[#3b82f6] text-white font-bold text-lg py-4 rounded-2xl flex justify-center items-center gap-2 mt-4 shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50 transition-opacity">
          {isPending ? <><Loader2 className="animate-spin" /> Guardando...</> : "Guardar Lugar"}
        </button>
      </form>
    </div>
  );
}
