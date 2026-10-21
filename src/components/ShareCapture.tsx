"use client";
import { useState } from "react";
import { Share2, Download, Copy, Loader2 } from "lucide-react";

export default function ShareCapture({ id, species }: { id: string; species: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const image = `/catches/${encodeURIComponent(id)}/card`;
  const button = "flex min-h-11 items-center justify-center gap-2 rounded-xl border border-forest-green/40 bg-charcoal px-4 text-sm text-white";
  const shareUrl = () => `${window.location.origin}/catches/${encodeURIComponent(id)}`;
  return <div className="space-y-3">
    <button type="button" disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime px-5 font-bold text-deep-black disabled:opacity-50" onClick={async () => {
      setBusy(true); setMessage(null);
      const url = shareUrl(), text = `${species} en Fishlog. ¡Mira esta captura!`;
      try {
        if (navigator.share) {
          const response = await fetch(image);
          if (!response.ok) throw new Error("image");
          const file = new File([await response.blob()], "captura-fishlog.png", { type: "image/png" });
          if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text: `${text}\n${url}`, title: "Fishlog" });
          else await navigator.share({ title: "Fishlog", text, url });
        } else window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank", "noopener,noreferrer");
      } catch (error) {
        if (!(error instanceof Error && error.name === "AbortError")) setMessage("Puedes descargar la tarjeta y copiar el enlace con los botones de abajo.");
      } finally { setBusy(false); }
    }}>{busy ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}Compartir captura</button>
    <div className="grid grid-cols-2 gap-2">
      <a href={`${image}?download=1`} download="captura-fishlog.png" className={button}><Download size={16} />Tarjeta</a>
      <button type="button" className={button} onClick={async () => { try { await navigator.clipboard.writeText(shareUrl()); setMessage("Enlace copiado."); } catch { setMessage(shareUrl()); } }}><Copy size={16} />Copiar enlace</button>
    </div>
    <button type="button" className="min-h-10 w-full text-sm font-semibold text-lime" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${species} en Fishlog\n${shareUrl()}`)}`, "_blank", "noopener,noreferrer")}>Enviar enlace por WhatsApp</button>
    {message && <p role="status" className="break-all text-sm text-light-gray/70">{message}</p>}
  </div>;
}
