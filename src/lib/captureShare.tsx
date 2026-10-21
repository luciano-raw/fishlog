import "server-only";
import { ImageResponse } from "next/og";
import { prisma } from "./prisma";
import { lureLabel } from "./lures";

export function publicOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || "https://fishlog-cnc2.vercel.app";
  return new URL(configured).origin;
}

export async function captureImage(id: string, download = false) {
  const item = await prisma.catch.findUnique({ where: { id }, select: { species: true, imageUrl: true, weight: true, length: true, lureType: true, user: { select: { username: true } } } });
  if (!item) return new Response("Captura no encontrada", { status: 404 });
  let photo: string | null = null;
  if (item.imageUrl && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const url = new URL(item.imageUrl);
      const storage = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
      if (url.protocol === "https:" && url.origin === storage.origin && url.pathname.startsWith("/storage/v1/object/public/catches/")) {
        const response = await fetch(url, { signal: AbortSignal.timeout(8000), redirect: "error" });
        const mime = response.headers.get("content-type")?.split(";")[0];
        if (response.ok && mime && ["image/jpeg", "image/png", "image/webp"].includes(mime)) {
          const bytes = await response.arrayBuffer();
          if (bytes.byteLength <= 5_000_000) photo = `data:${mime};base64,${Buffer.from(bytes).toString("base64")}`;
        }
      }
    } catch { /* A missing photo must not prevent sharing the capture. */ }
  }
  const measures = [item.weight != null ? `${item.weight} kg` : null, item.length != null ? `${item.length} cm` : null].filter(Boolean).join(" · ");
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#101810", color: "white", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", width: 600, height: 630, background: "#203e29", alignItems: "center", justifyContent: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        {photo ? <img src={photo} width={600} height={630} style={{ objectFit: "cover" }} /> : <svg width="340" height="240" viewBox="0 0 100 70"><path d="M88 35C73 9 38 7 20 27L3 15L7 35L3 55L20 43C38 63 73 61 88 35Z" fill="none" stroke="#a4ff3d" strokeWidth="3"/><circle cx="70" cy="30" r="3" fill="#a4ff3d"/></svg>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: 600, padding: "48px 40px", justifyContent: "space-between" }}>
        <div style={{ display: "flex", color: "#a4ff3d", fontSize: 30, fontWeight: 700, letterSpacing: 5 }}>FISHLOG</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 46, fontWeight: 700, display: "flex" }}>{item.species.slice(0, 60)}</div>
          {measures && <div style={{ fontSize: 32, color: "#a4ff3d", display: "flex" }}>{measures}</div>}
          <div style={{ fontSize: 23, color: "#ccd8cc", display: "flex" }}>Captura de {(item.user.username || "un pescador").slice(0, 35)}</div>
          {lureLabel(item.lureType) && <div style={{ fontSize: 20, color: "#a9b8a9", display: "flex" }}>Con: {lureLabel(item.lureType)}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}><div style={{ fontSize: 23, display: "flex" }}>Descubre la historia y su ubicación</div><div style={{ fontSize: 16, color: "#a4ff3d", display: "flex", overflowWrap: "anywhere" }}>{publicOrigin().replace("https://", "")}/catches/{id}</div></div>
      </div>
    </div>,
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=300", ...(download ? { "Content-Disposition": 'attachment; filename="captura-fishlog.png"' } : {}) } },
  );
}
