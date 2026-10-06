"use client";

import { useState, useTransition } from "react";
import { Camera, MapPin, Ruler, Weight, Fish, Loader2 } from "lucide-react";
import { saveCatch } from "./actions";

export default function LogForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        alert("Ubicación guardada con éxito.");
      }, (error) => {
        let msg = "No se pudo obtener la ubicación.";
        if (error.code === 1) msg = "Permiso denegado. Revisa los ajustes de tu navegador.";
        else if (error.code === 2) msg = "Posición no disponible. Comprueba tu GPS.";
        else if (error.code === 3) msg = "Tiempo de espera agotado al buscar el GPS.";
        alert(msg);
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    }
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await saveCatch(formData);
      } catch (error) {
        alert("Hubo un error al guardar la pesca.");
        console.error(error);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6 pb-12">
      {/* Coordenadas Ocultas */}
      {coords && (
        <>
          <input type="hidden" name="lat" value={coords.lat} />
          <input type="hidden" name="lng" value={coords.lng} />
        </>
      )}

      {/* Image Upload */}
      <div className="relative w-full h-56 bg-charcoal rounded-3xl overflow-hidden border border-forest-green/30 flex flex-col items-center justify-center">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center text-forest-green">
            <Camera size={40} className="mb-2" />
            <span className="text-sm font-medium">Add Photo</span>
          </div>
        )}
        <input 
          type="file" 
          name="image"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleImageChange}
        />
      </div>

      {/* Species */}
      <div className="space-y-2">
        <label className="text-sm text-light-gray/70 font-medium">Species</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-forest-green">
            <Fish size={20} />
          </div>
          <input 
            type="text" 
            name="species"
            required
            placeholder="e.g. Largemouth Bass"
            className="w-full bg-charcoal text-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-forest-green/20 focus:border-lime transition-colors"
          />
        </div>
      </div>

      {/* Dimensions (Length & Weight) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-light-gray/70 font-medium">Length</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-forest-green">
              <Ruler size={18} />
            </div>
            <input 
              type="number" 
              name="length"
              placeholder="cm"
              className="w-full bg-charcoal text-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-forest-green/20 focus:border-lime transition-colors"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-light-gray/70 font-medium">Weight</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-forest-green">
              <Weight size={18} />
            </div>
            <input 
              type="number" 
              name="weight"
              step="0.1"
              placeholder="kg"
              className="w-full bg-charcoal text-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-forest-green/20 focus:border-lime transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm text-light-gray/70 font-medium">Location</label>
        <button 
          type="button"
          onClick={handleLocation}
          className="w-full flex items-center justify-between bg-charcoal rounded-2xl p-4 border border-forest-green/20 hover:border-lime transition-colors"
        >
          <div className="flex items-center gap-3">
            <MapPin className={coords ? "text-lime" : "text-light-gray/50"} size={20} />
            <div className="text-left">
              <p className="text-white text-sm">
                {coords ? "Ubicación guardada ✓" : "Obtener ubicación actual"}
              </p>
              <p className="text-light-gray/50 text-xs mt-0.5">
                {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Requiere permisos de GPS"}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Save Button */}
      <button 
        type="submit" 
        disabled={isPending}
        className="flex justify-center items-center gap-2 w-full bg-lime text-deep-black font-bold text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(164,255,61,0.2)] hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            Guardando...
          </>
        ) : (
          "Save Catch"
        )}
      </button>
    </form>
  );
}
