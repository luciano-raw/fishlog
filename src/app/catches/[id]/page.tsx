import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { lureLabel } from "@/lib/lures";
import { publicOrigin } from "@/lib/captureShare";
import ImageWithFullscreen from "@/components/ImageWithFullscreen";
import MapPointLink from "@/components/MapPointLink";
import CatchSocial from "@/components/CatchSocial";
import ShareCapture from "@/components/ShareCapture";
import { cache } from "react";

const getCapture = cache((id: string) => prisma.catch.findUnique({ where: { id }, select: {
  id: true, species: true, weight: true, length: true, lureType: true, imageUrl: true, createdAt: true,
  locationLat: true, locationLng: true, user: { select: { username: true } },
} }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await getCapture(id);
  if (!item) return { title: "Captura no encontrada | Fishlog" };
  const title = `${item.species} · Fishlog`, description = `Captura de ${item.user.username || "un pescador"}. Descubre su foto y ubicación en Fishlog.`;
  const url = `${publicOrigin()}/catches/${encodeURIComponent(id)}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "article", images: [{ url: `${url}/card`, width: 1200, height: 630 }] }, twitter: { card: "summary_large_image", title, description, images: [`${url}/card`] } };
}

export default async function CapturePage({ params }: { params: Promise<{ id: string }> }) {
  const item = await getCapture((await params).id);
  if (!item) notFound();
  return <div className="mx-auto max-w-xl space-y-5 p-5">
    <Link href="/" className="inline-block py-2 text-sm text-lime">← Fishlog</Link>
    <header className="space-y-2"><p className="text-xs uppercase tracking-widest text-lime">Captura de la comunidad</p><h1 className="text-3xl font-bold text-white">{item.species}</h1><p className="text-sm text-light-gray/65">Por {item.user.username || "un pescador"}</p><time dateTime={item.createdAt.toISOString()} className="block text-xs text-light-gray/45">{new Intl.DateTimeFormat("es-CL", { timeZone: "America/Santiago", dateStyle: "long" }).format(item.createdAt)}</time></header>
    {item.imageUrl && <ImageWithFullscreen src={item.imageUrl} alt={item.species} className="max-h-[65vh] w-full rounded-3xl object-cover" />}
    <div className="flex flex-wrap gap-3 text-lg font-semibold text-white">{item.weight != null && <span>{item.weight} kg</span>}{item.length != null && <span>{item.length} cm</span>}</div>
    {lureLabel(item.lureType) && <p className="text-sm text-light-gray/70">Con: {lureLabel(item.lureType)}</p>}
    <MapPointLink type="catch" point={item} />
    <CatchSocial id={item.id} />
    <ShareCapture id={item.id} species={item.species} />
    <div className="rounded-2xl border border-forest-green/30 bg-charcoal p-5"><h2 className="font-semibold text-white">Tu próxima historia también puede estar aquí</h2><div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-lime"><Link href="/map">Explorar el mapa</Link><Link href="/log">Compartir mi captura</Link></div></div>
  </div>;
}
