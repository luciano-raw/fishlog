import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MapPointLink from "@/components/MapPointLink";
import ImageWithFullscreen from "@/components/ImageWithFullscreen";
import { CommentForm, DeleteComment } from "@/components/PointComments";

const format = new Intl.DateTimeFormat("es-CL", { timeZone: "America/Santiago", dateStyle: "medium", timeStyle: "short" });
export default async function PointPage({ params, searchParams }: { params: Promise<{ type: string; id: string }>; searchParams: Promise<{ page?: string }> }) {
  const { type, id } = await params;
  if (type !== "spot" && type !== "hazard") notFound();
  const query = await searchParams;
  const page = Math.min(100, Math.max(1, Math.floor(Number(query.page) || 1)));
  const point = type === "spot"
    ? await prisma.spot.findUnique({ where: { id }, select: { id: true, name: true, speciesSeen: true, imageUrl: true, locationLat: true, locationLng: true, createdAt: true, updatedAt: true } })
    : await prisma.hazard.findUnique({ where: { id }, select: { id: true, name: true, note: true, locationLat: true, locationLng: true, createdAt: true, updatedAt: true } });
  if (!point) notFound();
  const { userId } = await auth();
  const [comments, viewer] = await Promise.all([
    prisma.pointComment.findMany({ where: type === "spot" ? { spotId: id } : { hazardId: id }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: page * 20 + 1, select: { id: true, body: true, createdAt: true, userId: true, user: { select: { username: true } } } }),
    userId ? prisma.user.findUnique({ where: { id: userId }, select: { role: true } }) : null,
  ]);
  return <div className="mx-auto max-w-xl space-y-6 p-5">
    <Link href="/map" className="inline-block py-2 text-sm text-lime">← Volver al mapa</Link>
    <header className="space-y-2"><p className={`text-xs font-semibold uppercase ${type === "spot" ? "text-blue-400" : "text-red-400"}`}>{type === "spot" ? "Spot" : "Peligro"}</p><h1 className="text-2xl font-bold text-white">{point.name}</h1><p className="text-xs text-light-gray/50">Creado: {format.format(point.createdAt)}</p><p className="text-xs text-light-gray/50">Última edición del punto: {format.format(point.updatedAt)}</p></header>
    {"imageUrl" in point && point.imageUrl && <ImageWithFullscreen src={point.imageUrl} alt={point.name} className="max-h-80 w-full rounded-2xl object-cover" />}
    {"speciesSeen" in point && point.speciesSeen && <p className="text-sm">Especies observadas: {point.speciesSeen}</p>}
    {"note" in point && point.note && <p className="whitespace-pre-wrap text-sm">{point.note}</p>}
    <MapPointLink type={type} point={point} />
    <section className="space-y-4 border-t border-forest-green/30 pt-5"><h2 className="text-xl font-bold text-white">Comentarios y novedades</h2>
      {userId ? <CommentForm type={type} id={id} /> : <Link href={`/sign-in?redirect_url=${encodeURIComponent(`/points/${type}/${id}`)}`} className="inline-block rounded-xl border border-lime/30 p-3 text-sm text-lime">Inicia sesión para comentar</Link>}
      <p className="text-xs text-light-gray/40">Más recientes primero · Los comentarios son aportes de la comunidad.</p>
      {comments.length === 0 && <p className="rounded-2xl bg-charcoal p-5 text-sm text-light-gray/60">Aún no hay comentarios. Comparte la primera novedad del lugar.</p>}
      {comments.slice(0, page * 20).map(comment => <article key={comment.id} className="space-y-2 rounded-2xl border border-forest-green/25 bg-charcoal p-4"><p className="text-sm font-semibold text-white">{comment.user.username || "Pescador"}</p><time dateTime={comment.createdAt.toISOString()} className="block text-xs text-light-gray/45">{format.format(comment.createdAt)}</time><p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{comment.body}</p>{(userId === comment.userId || viewer?.role === "ADMIN") && <DeleteComment id={comment.id} />}</article>)}
      {comments.length > page * 20 && page < 100 && <Link href={`?page=${page + 1}`} scroll={false} className="block py-3 text-center text-sm text-lime">Ver comentarios anteriores</Link>}
    </section>
  </div>;
}
