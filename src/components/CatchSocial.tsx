"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { Fish, Share2, Loader2 } from "lucide-react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { setCatchReaction } from "@/app/actions/community";

export default function CatchSocial({ id }: { id: string }) {
  const { isSignedIn } = useAuth();
  const root = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ count: number; reacted: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
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
  const buttonClass = `inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold ${state?.reacted ? "border-lime bg-lime/10 text-lime" : "border-forest-green/40 text-light-gray/70"}`;
  const contents = <><Fish size={17} fill={state?.reacted ? "currentColor" : "none"} />{state?.count ?? "—"}</>;
  return <div ref={root} className="space-y-1">
    <div className="flex flex-wrap items-center gap-2">
      {isSignedIn ? <button type="button" disabled={pending || !state} aria-label={state?.reacted ? "Quitar mi pez" : "Dar un pez"} aria-pressed={state?.reacted ?? false} className={buttonClass} onClick={() => startTransition(async () => {
        setError(null);
        try { const result = await setCatchReaction(id, !state?.reacted); setState(result); window.dispatchEvent(new CustomEvent("fishlog-reaction", { detail: { id, ...result } })); }
        catch { setError("No se pudo guardar tu reacción. Vuelve a intentarlo."); }
      })}>{pending ? <Loader2 size={15} className="animate-spin" /> : contents}</button> : <SignInButton mode="modal"><button type="button" className={buttonClass} aria-label="Inicia sesión para dar un pez">{contents}</button></SignInButton>}
      <Link href={`/catches/${encodeURIComponent(id)}`} className="inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-lime"><Share2 size={14} />Ver / compartir</Link>
    </div>
    {error && <p role="alert" className="text-[11px] text-amber-200">{error}</p>}
  </div>;
}
