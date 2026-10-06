"use client";

import { useState } from "react";
import { Loader2, MapPin, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveSpot } from "./actions";

export default function SpotForm() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => alert("No se pudo obtener la ubicación: " + err.message)
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      if (imageFile) {
        formData.append("file", imageFile);
      }
      const result = await saveSpot(formData);
      if (result.success) {
        alert("Lugar guardado con éxito.");
        router.push("/");
      } else {
        alert("Hubo un error al guardar el lugar.");
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
      <h1 className="text-2xl font-bold text-white mb-6">Guardar Spot (Lugar)</h1>
      <form action={handleSubmit} className="space-y-5">
        {coords && (
          <>
            <input type="hidden" name="lat" value={coords.lat} />
            <input type="hidden" name="lng" value={coords.lng} />
          </>
        )}

        <div className="relative w-full h-40 bg-charcoal rounded-3xl overflow-hidden border border-forest-green/30 flex flex-col items-center justify-center">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-forest-green">
              <Camera size={40} className="mb-2" />
              <span className="text-sm font-medium">Foto del Lugar (Opcional)</span>
            </div>
          )}
          <input type="file" name="image" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre del Lugar</label>
          <input type="text" name="name" required placeholder="ej. Pozo de las truchas" className="w-full bg-charcoal text-white rounded-2xl py-4 px-4 outline-none border border-forest-green/20" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Especies Vistas (Opcional)</label>
          <input type="text" name="species" placeholder="ej. Carpa, Pejerrey" className="w-full bg-charcoal text-white rounded-2xl py-4 px-4 outline-none border border-forest-green/20" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ubicación</label>
          <button type="button" onClick={handleLocation} className="w-full flex items-center justify-between bg-charcoal rounded-2xl p-4 border border-forest-green/20">
            <div className="flex items-center gap-3">
              <MapPin className={coords ? "text-lime" : "text-light-gray/50"} size={20} />
              <div className="text-left">
                <p className="text-white text-sm">{coords ? "Ubicación guardada ✓" : "Obtener ubicación actual"}</p>
                <p className="text-light-gray/50 text-xs mt-0.5">{coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Obligatorio"}</p>
              </div>
            </div>
          </button>
        </div>

        <button type="submit" disabled={isPending || !coords} className="w-full bg-[#3b82f6] text-white font-bold text-lg py-4 rounded-2xl flex justify-center items-center gap-2 mt-4 shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50">
          {isPending ? <><Loader2 className="animate-spin" /> Guardando...</> : "Guardar Lugar"}
        </button>
      </form>
    </div>
  );
}
