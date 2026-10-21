"use client";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { addPointComment, deletePointComment } from "@/app/actions/community";

export function CommentForm({ type, id }: { type: "spot" | "hazard"; id: string }) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  return <form className="space-y-3" onSubmit={event => { event.preventDefault(); startTransition(async () => {
    setError(null);
    try { await addPointComment(type, id, body); setBody(""); }
    catch (error) { setError(error instanceof Error ? error.message : "No se pudo comentar."); }
  }); }}>
    <label htmlFor="point-comment" className="block text-sm font-medium text-white">Agrega información del lugar</label>
    <textarea id="point-comment" required maxLength={1000} value={body} onChange={event => setBody(event.target.value)} rows={3} className="w-full rounded-2xl border border-forest-green/40 bg-charcoal p-3 text-white" placeholder="¿Cómo está el lugar? ¿Hubo algún cambio?" />
    <div className="flex items-center justify-between"><span className="text-xs text-light-gray/40">{body.length}/1000</span><button type="submit" disabled={pending || !body.trim()} className="flex min-h-10 items-center gap-2 rounded-full bg-lime px-5 text-sm font-semibold text-deep-black disabled:opacity-50">{pending && <Loader2 size={15} className="animate-spin" />}Comentar</button></div>
    {error && <p role="alert" className="text-sm text-amber-200">{error}</p>}
  </form>;
}

export function DeleteComment({ id }: { id: string }) {
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();
  return <div><button type="button" disabled={pending} className="min-h-9 text-xs text-red-300" onClick={() => {
    if (!confirm("¿Eliminar este comentario?")) return;
    startTransition(async () => { setError(false); try { await deletePointComment(id); } catch { setError(true); } });
  }}>{pending ? "Eliminando..." : "Eliminar"}</button>{error && <p role="alert" className="text-xs text-red-300">No se pudo eliminar.</p>}</div>;
}
