"use client";

import { useEffect, useRef, type ReactNode, type TouchEvent } from "react";
import { useSearchParams } from "next/navigation";
import { House, Users } from "lucide-react";

type Feed = "home" | "friends";

export default function HomeTabs({ children, friends }: { children: ReactNode; friends: ReactNode }) {
  const params = useSearchParams();
  const active: Feed = params.get("feed") === "friends" ? "friends" : "home";
  const root = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const scroller = root.current?.closest("main");
    if (!scroller) return;
    const key = `fishlog-feed-scroll-${active}`;
    try { scroller.scrollTop = Number(sessionStorage.getItem(key)) || 0; } catch { /* Storage may be unavailable. */ }
    const save = () => {
      try { sessionStorage.setItem(key, String(scroller.scrollTop)); } catch { /* Keep navigation working without storage. */ }
    };
    scroller.addEventListener("scroll", save, { passive: true });
    return () => { scroller.removeEventListener("scroll", save); };
  }, [active]);

  function select(feed: Feed) {
    if (feed === active) return;
    const query = new URLSearchParams(params.toString());
    if (feed === "friends") query.set("feed", "friends");
    else query.delete("feed");
    window.history.replaceState(null, "", query.size ? `/?${query}` : "/");
  }

  function touchStart(event: TouchEvent) {
    if (event.touches.length !== 1 || (event.target as HTMLElement).closest(".leaflet-container, button, a, [role='dialog'], img")) {
      start.current = null;
      return;
    }
    start.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  function touchEnd(event: TouchEvent) {
    const origin = start.current;
    start.current = null;
    if (!origin || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - origin.x;
    const dy = event.changedTouches[0].clientY - origin.y;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      select(dx < 0 ? "friends" : "home");
    }
  }

  return (
    <div ref={root} onTouchStart={touchStart} onTouchEnd={touchEnd} onTouchCancel={() => { start.current = null; }}>
      <div role="tablist" aria-label="Feeds" className="sticky top-0 z-20 mb-4 flex gap-2 rounded-2xl border border-forest-green/30 bg-deep-black/95 p-1.5 backdrop-blur-md">
        {(["home", "friends"] as const).map(feed => {
          const Icon = feed === "home" ? House : Users;
          return <button key={feed} id={`tab-${feed}`} role="tab" type="button"
            aria-selected={active === feed} aria-controls={`panel-${feed}`} tabIndex={active === feed ? 0 : -1}
            onClick={() => select(feed)}
            onKeyDown={event => {
              if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
                event.preventDefault();
                const next = event.key === "Home" ? "home" : event.key === "End" ? "friends" : active === "home" ? "friends" : "home";
                select(next);
                document.getElementById(`tab-${next}`)?.focus();
              }
            }}
            className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${active === feed ? "bg-lime text-deep-black" : "text-light-gray/60 hover:text-white"}`}>
            <Icon size={18} aria-hidden="true" />{feed === "home" ? "Inicio" : "Amigos"}
          </button>;
        })}
      </div>
      <div id="panel-home" role="tabpanel" aria-labelledby="tab-home" hidden={active !== "home"} className="space-y-4">{children}</div>
      <div id="panel-friends" role="tabpanel" aria-labelledby="tab-friends" hidden={active !== "friends"}>{friends}</div>
    </div>
  );
}
