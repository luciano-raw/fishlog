"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { Fish, Share2, MapPin } from "lucide-react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { setCatchReaction } from "@/app/actions/community";

export default function CatchSocial({ id, mapHref }: { id: string; mapHref?: string }) {
  const { isSignedIn } = useAuth();
  const root = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ count: number; reacted: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [burst, setBurst] = useState(0);
  useEffect(() => {
    let active = true;
    const abort = new AbortController();
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      fetch(`/api/catches/${encodeURIComponent(id)}/reaction`, { cache: "no-store", signal: abort.signal }).then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      }).then(data => { if (active) setState(data); }).catch(() => { if (active && !abort.signal.aborted) setError("No se pudieron cargar las reacciones."); });
    });
    if (root.current) observer.observe(root.current);
    const sync = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail.id === id) setState({ count: detail.count, reacted: detail.reacted });
    };
    window.addEventListener("fishlog-reaction", sync);
    return () => { active = false; abort.abort(); observer.disconnect(); window.removeEventListener("fishlog-reaction", sync); };
  }, [id, isSignedIn]);
  const buttonClass = `relative inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1 rounded-xl px-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-lime ${state?.reacted ? "bg-lime/10 text-lime" : "text-light-gray/60 hover:bg-white/5 hover:text-lime"}`;
  const contents = <><span key={burst} className={`relative inline-flex ${burst && state?.reacted ? "fish-reaction-pop" : ""}`}>
    <Fish size={20} fill={state?.reacted ? "currentColor" : "none"} aria-hidden="true" />
    {burst > 0 && state?.reacted && <span className="fish-reaction-ring" aria-hidden="true" />}
  </span><span className="min-w-2 tabular-nums" aria-live="polite">{state?.count ?? "—"}</span></>;
  return <div ref={root} className="space-y-1">
    <div className="flex min-w-0 items-center justify-between">
      {isSignedIn ? <button type="button" disabled={pending || !state} aria-busy={pending} aria-label={state?.reacted ? "Quitar mi pez" : "Dar un pez"} title={state?.reacted ? "Quitar mi pez" : "Dar un pez"} aria-pressed={state?.reacted ?? false} className={buttonClass} onClick={() => {
        if (!state) return;
        const previous = state;
        const reacted = !previous.reacted;
        setState({ reacted, count: Math.max(0, previous.count + (reacted ? 1 : -1)) });
        if (reacted) setBurst(value => value + 1);
        startTransition(async () => {
        setError(null);
        try { const result = await setCatchReaction(id, reacted); setState(result); window.dispatchEvent(new CustomEvent("fishlog-reaction", { detail: { id, ...result } })); }
        catch { setState(previous); setError("No se pudo guardar tu reacción. Vuelve a intentarlo."); }
        });
      }}>{contents}</button> : <SignInButton mode="modal"><button type="button" className={buttonClass} aria-label="Inicia sesión para dar un pez">{contents}</button></SignInButton>}
      {mapHref && <Link href={mapHref} title="Ver en el mapa" aria-label="Ver en el mapa" className="inline-flex h-11 w-10 min-w-8 items-center justify-center rounded-xl text-light-gray/55 transition-colors hover:bg-white/5 hover:text-lime focus-visible:outline-2 focus-visible:outline-lime"><MapPin size={19} aria-hidden="true" /></Link>}
      <Link href={`/catches/${encodeURIComponent(id)}`} aria-label="Ver captura y compartir" title="Ver captura y compartir" className="inline-flex h-11 w-10 min-w-8 items-center justify-center rounded-xl text-light-gray/60 transition-colors hover:bg-white/5 hover:text-lime focus-visible:outline-2 focus-visible:outline-lime"><Share2 size={19} aria-hidden="true" /></Link>
    </div>
    {error && <p role="alert" className="text-[11px] text-amber-200">{error}</p>}
  </div>;
}
