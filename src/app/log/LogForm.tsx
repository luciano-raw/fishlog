"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, MapPin, Ruler, Weight, Fish, Loader2, Check, X } from "lucide-react";
import imageCompression from "browser-image-compression";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { saveCatch } from "./actions";
import LocationPickerDynamic from "@/components/LocationPickerDynamic";

export default function LogForm() {
  const router = useRouter();
  
  // States para el formulario
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [isPending, startTransition] = useTransition();

  // States para el Cropper
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRawImage(URL.createObjectURL(file)); // Abrir el modal de recorte
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!rawImage || !croppedAreaPixels) return;
    
    try {
      // 1. Recortar la imagen en un Canvas (retorna File)
      const croppedFile = await getCroppedImg(rawImage, croppedAreaPixels);
      
      // 2. Comprimir la imagen recortada
      const compressedFile = await imageCompression(croppedFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });

      // 3. Guardar en el estado para enviarla
      setImageFile(compressedFile);
      setPreview(URL.createObjectURL(compressedFile));
      
      // 4. Cerrar Modal
      setRawImage(null);
    } catch (e) {
      console.error(e);
      alert("Error al recortar la imagen.");
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
        if (imageFile) {
          formData.set("image", imageFile);
        }
        const result = await saveCatch(formData);
        if (result?.success) {
          alert("¡Captura guardada con éxito!");
          router.push("/");
        }
      } catch (error: any) {
        alert(error.message || "Hubo un error desconocido al guardar la pesca.");
        console.error(error);
      }
    });
  };

  // Si hay imagen en crudo, mostramos pantalla completa de recorte
  if (rawImage) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="relative flex-1">
          <Cropper
            image={rawImage}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
          {/* Silueta de Pez Realista (Guía visual) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 opacity-60">
            <svg viewBox="0 0 100 100" fill="none" stroke="#A4FF3D" strokeWidth="1.5" strokeDasharray="4 4" className="w-[85%] h-[85%] drop-shadow-[0_0_8px_rgba(164,255,61,0.8)]">
              {/* Cuerpo y cola del pez realista */}
              <path d="M 90,50 C 90,30 60,20 40,30 C 25,35 15,40 5,25 L 10,50 L 5,75 C 15,60 25,65 40,70 C 60,80 90,70 90,50 Z" />
              {/* Aleta superior */}
              <path d="M 45,28 C 55,15 70,18 75,25" />
              {/* Ojo */}
              <circle cx="75" cy="45" r="2" fill="#A4FF3D" />
              {/* Agalla */}
              <path d="M 65,40 C 62,45 62,55 65,60" />
            </svg>
          </div>
          <div className="absolute top-10 left-0 w-full text-center z-10 pointer-events-none">
            <p className="text-white font-bold text-shadow drop-shadow-lg uppercase tracking-wider text-sm bg-black/30 inline-block px-4 py-1 rounded-full backdrop-blur-md">
              Centra tu captura en el marco
            </p>
          </div>
        </div>
        <div className="h-32 bg-deep-black flex items-center justify-between px-6 pb-safe">
          <button 
            type="button" 
            onClick={() => setRawImage(null)} 
            className="w-14 h-14 bg-charcoal rounded-full flex items-center justify-center text-white border border-forest-green/30"
          >
            <X size={24} />
          </button>
          <button 
            type="button" 
            onClick={handleCropSave}
            className="h-14 px-8 bg-lime text-deep-black font-bold rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(164,255,61,0.3)]"
          >
            <Check size={24} /> Recortar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-5 pb-10">
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
            <span className="text-sm font-medium">Añadir Foto</span>
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
        <label className="text-sm text-light-gray/70 font-medium">Especie</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-forest-green">
            <Fish size={20} />
          </div>
          <input 
            type="text" 
            name="species"
            required
            placeholder="ej. Trucha, Lenguado"
            className="w-full bg-charcoal text-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-forest-green/20 focus:border-lime transition-colors"
          />
        </div>
      </div>

      {/* Dimensions (Length & Weight) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-light-gray/70 font-medium">Longitud</label>
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
          <label className="text-sm text-light-gray/70 font-medium">Peso</label>
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
          <div className="flex justify-between items-center">
            <label className="text-sm text-light-gray/70 font-medium">Ubicación</label>
            <button 
              type="button" 
              onClick={() => setIsManualLocation(!isManualLocation)}
              className="text-xs text-lime font-medium underline"
            >
              {isManualLocation ? "Usar mi GPS" : "Elegir en mapa"}
            </button>
          </div>

          {!isManualLocation ? (
            <button 
              type="button"
              onClick={handleLocation}
              className="w-full flex items-center justify-between bg-charcoal rounded-2xl p-4 border border-forest-green/20 hover:border-lime transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className={coords ? "text-lime" : "text-light-gray/50"} size={20} />
                <div className="text-left">
                  <p className="text-white text-sm">
                    {coords ? "Ubicación fijada ✓" : "Obtener ubicación actual"}
                  </p>
                  <p className="text-light-gray/50 text-xs mt-0.5">
                    {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Toca para leer GPS"}
                  </p>
                </div>
              </div>
            </button>
          ) : ( <LocationPickerDynamic position={coords} setPosition={setCoords} /> )} </div>

      {/* Save Button */}
      <button 
        type="submit" 
        disabled={isPending}
        className="flex justify-center items-center gap-2 w-full bg-lime text-deep-black font-bold text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(164,255,61,0.2)] hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 mb-8"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            Guardando...
          </>
        ) : (
          "Guardar Captura"
        )}
      </button>
    </form>
  );
}
