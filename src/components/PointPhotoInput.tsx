"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Cropper, { type Area } from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { Camera, Loader2, TriangleAlert } from "lucide-react";
import getCroppedImg from "@/lib/cropImage";

export type PointPhoto = { image: File; thumbnail: File };

export default function PointPhotoInput({ hazard = false, onChange, onBusyChange }: {
  hazard?: boolean; onChange: (photo: PointPhoto | null) => void; onBusyChange: (busy: boolean) => void;
}) {
  const [source, setSource] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const accepted = useRef<{ image: File; crop: { x: number; y: number }; zoom: number } | null>(null);
  useEffect(() => () => { if (sourceUrl) URL.revokeObjectURL(sourceUrl); }, [sourceUrl]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  useEffect(() => { onBusyChange(busy || editing); }, [busy, editing, onBusyChange]);
  useEffect(() => {
    if (!editing) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) setEditing(false);
      if (event.key === "Tab") {
        const controls = dialog.current?.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled)");
        const first = controls?.[0], last = controls?.[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", keydown);
    return () => { window.removeEventListener("keydown", keydown); previous?.focus(); };
  }, [editing, busy]);

  async function select(file?: File) {
    if (!file) return;
    setError(""); setBusy(true);
    try {
      const image = await imageCompression(file, { maxSizeMB: 0.65, maxWidthOrHeight: 2000, fileType: "image/jpeg", useWebWorker: true });
      if (image.size > 750000) throw new Error("size");
      setSource(image); setSourceUrl(URL.createObjectURL(image)); setCrop({ x: 0, y: 0 }); setZoom(1); setArea(null); setEditing(true);
    } catch { setError("No pudimos abrir esa foto. Prueba con una imagen JPG, PNG o WebP, o continúa sin foto."); }
    finally { setBusy(false); }
  }
  async function confirm() {
    if (!source || !sourceUrl || !area) return;
    setBusy(true); setError("");
    try {
      const cropped = await getCroppedImg(sourceUrl, area);
      const thumbnail = await imageCompression(cropped, { maxSizeMB: 0.18, maxWidthOrHeight: 800, fileType: "image/jpeg", useWebWorker: true });
      if (thumbnail.size > 250000) throw new Error("size");
      accepted.current = { image: source, crop, zoom };
      setPreviewUrl(URL.createObjectURL(thumbnail)); onChange({ image: source, thumbnail }); setEditing(false);
    } catch { setError("No pudimos ajustar la foto. Intenta otra vez o continúa sin foto."); }
    finally { setBusy(false); }
  }
  return <div className="space-y-2">
    <input ref={input} type="file" accept="image/*" aria-label="Elegir foto opcional" className="sr-only" disabled={busy} onChange={event => { void select(event.target.files?.[0]); event.target.value = ""; }} />
    <button type="button" disabled={busy} onClick={() => input.current?.click()} className="flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-forest-green/30 bg-charcoal text-light-gray/70">
      {busy ? <Loader2 className="animate-spin" /> : previewUrl ? <img src={previewUrl} alt="Encuadre de la foto" className="h-full w-full object-cover" /> : <>{hazard ? <TriangleAlert size={40} className="mb-2 text-red-400" /> : <Camera size={40} className="mb-2" />}<span className="text-sm">Añadir foto (opcional)</span></>}
    </button>
    <p className="text-xs text-light-gray/60">{hazard ? "Puedes reportar sin foto. Mostraremos el símbolo de peligro." : "Elige el encuadre de la vista previa; al abrirla se verá la foto completa."}</p>
    {previewUrl && <div className="flex gap-4 text-xs text-lime"><button type="button" disabled={busy} className="min-h-11" onClick={() => {
      if (!accepted.current) return;
      setSource(accepted.current.image); setSourceUrl(URL.createObjectURL(accepted.current.image));
      setCrop(accepted.current.crop); setZoom(accepted.current.zoom); setArea(null); setEditing(true); setError("");
    }}>Ajustar encuadre</button><button type="button" disabled={busy} className="min-h-11" onClick={() => { accepted.current = null; setPreviewUrl(null); setSource(null); setSourceUrl(null); onChange(null); }}>Quitar foto</button></div>}
    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    {editing && sourceUrl && createPortal(<div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="photo-crop-title" className="fixed inset-0 z-[10000] flex flex-col bg-black">
      <div className="flex items-center justify-between gap-3 p-4"><h2 id="photo-crop-title" className="font-semibold text-white">Acomoda la vista previa</h2><button type="button" disabled={busy} className="min-h-11 px-3 text-light-gray" onClick={() => setEditing(false)}>Cancelar</button></div>
      <div className="relative min-h-0 flex-1"><Cropper image={sourceUrl} crop={crop} zoom={zoom} aspect={4 / 3} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, pixels) => setArea(pixels)} /></div>
      <div className="space-y-3 bg-charcoal p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"><p className="text-xs text-light-gray/70">Arrastra la foto y ajusta el zoom. La imagen completa se conserva.</p><label className="flex items-center gap-3 text-sm text-white">Zoom<input type="range" min={1} max={3} step={0.05} value={zoom} disabled={busy} onChange={event => setZoom(Number(event.target.value))} className="w-full accent-lime" /></label>{error && <p role="alert" className="text-sm text-red-300">{error}</p>}<button type="button" disabled={busy || !area} onClick={confirm} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-lime font-semibold text-deep-black disabled:opacity-50">{busy && <Loader2 className="animate-spin" size={18} />}Usar este encuadre</button></div>
    </div>, document.body)}
  </div>;
}
