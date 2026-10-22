import { Fish, MapPin, TriangleAlert, Users } from "lucide-react";
import Link from "next/link";
import ImageWithFullscreen from "./ImageWithFullscreen";
import MapPointLink from "./MapPointLink";
import type { FriendActivity } from "@/lib/activityFeed";
import { lureLabel } from "@/lib/lures";
import CatchSocial from "./CatchSocial";

const dateFormat = new Intl.DateTimeFormat("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "long", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("es-CL", { timeZone: "America/Santiago", hour: "2-digit", minute: "2-digit" });

export default function FriendsActivity({ activities, signedIn, hasFriends, nextPage }: {
  activities: FriendActivity[]; signedIn: boolean; hasFriends: boolean; nextPage: number | null;
}) {
  return <section className="space-y-5">
    <div>
      <h2 className="text-xl font-bold text-white">Actividad de tus amigos</h2>
      <p className="mt-1 text-sm text-light-gray/60">Capturas, spots y peligros · Lo más reciente primero</p>
    </div>
    {activities.length === 0 ? (
      <div className="rounded-3xl border border-forest-green/30 bg-charcoal px-6 py-10 text-center">
        <Users className="mx-auto mb-4 text-lime" size={32} />
        <p className="font-semibold text-white">{!signedIn ? "Inicia sesión para ver a tus amigos" : !hasFriends ? "La próxima aventura se comparte" : "Todavía no hay actividad"}</p>
        <p className="mt-2 text-sm text-light-gray/60">{!signedIn ? "Sigue sus jornadas y descubre nuevos lugares juntos." : !hasFriends ? "Agrega o invita amigos desde tu perfil para ver sus novedades aquí." : "Aquí aparecerán las capturas, spots y peligros que registren tus amigos."}</p>
        {(!signedIn || !hasFriends) && <Link href={signedIn ? "/profile" : "/sign-in"} className="mt-5 inline-flex rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-deep-black">{signedIn ? "Invitar amigos" : "Iniciar sesión"}</Link>}
      </div>
    ) : <ol className="space-y-0">
      {activities.map((activity, index) => {
        const date = dateFormat.format(activity.createdAt);
        const showDate = index === 0 || date !== dateFormat.format(activities[index - 1].createdAt);
        const Icon = activity.type === "catch" ? Fish : activity.type === "spot" ? MapPin : TriangleAlert;
        const color = activity.type === "catch" ? "text-lime" : activity.type === "spot" ? "text-blue-400" : "text-red-400";
        const action = activity.type === "catch" ? "capturó" : activity.type === "spot" ? "agregó un spot:" : "reportó un peligro:";
        return <li key={`${activity.type}-${activity.id}`}>
          {showDate && <h3 className="pb-4 pt-3 text-xs font-semibold uppercase tracking-wider text-light-gray/50">{date}</h3>}
          <div className="relative ml-4 border-l border-forest-green/50 pb-6 pl-7">
            <span className={`absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-forest-green bg-deep-black ${color}`}><Icon size={16} aria-hidden="true" /></span>
            <article className="overflow-hidden rounded-2xl border border-forest-green/30 bg-charcoal">
              <div className="space-y-3 p-4">
                <time dateTime={activity.createdAt.toISOString()} className="text-xs text-light-gray/50">{timeFormat.format(activity.createdAt)}</time>
                <p className="text-sm leading-relaxed text-light-gray"><span className="font-semibold text-white">{activity.username || "Un amigo"}</span> {action} <span className={`font-semibold ${color}`}>{activity.name}</span></p>
                {activity.detail && <p className="whitespace-pre-wrap break-words text-sm text-light-gray/65">{activity.detail}</p>}
                {lureLabel(activity.lureType) && <p className="text-xs text-lime/80">Con: {lureLabel(activity.lureType)}</p>}
                {activity.imageUrl && <div className="overflow-hidden rounded-xl"><ImageWithFullscreen src={activity.imageUrl} thumbnailSrc={activity.thumbnailUrl} alt={activity.name} className="aspect-[4/3] max-h-72 w-full object-cover" /></div>}
                {activity.type === "hazard" && !activity.imageUrl && <div className="flex h-24 items-center justify-center rounded-xl bg-red-500/10"><TriangleAlert size={36} className="text-red-400" aria-label="Peligro reportado sin foto" /></div>}
                <MapPointLink type={activity.type} point={activity} fromFriends />
                {activity.type === "catch" ? <CatchSocial id={activity.id} /> : <Link href={`/points/${activity.type}/${encodeURIComponent(activity.id)}`} className="inline-block min-h-10 py-2 text-xs font-semibold text-lime">Comentarios y novedades</Link>}
              </div>
            </article>
          </div>
        </li>;
      })}
    </ol>}
    {nextPage && <Link href={`/?feed=friends&activityPage=${nextPage}`} scroll={false} className="flex min-h-11 items-center justify-center rounded-full border border-lime/30 text-sm font-semibold text-lime">Ver más actividad</Link>}
  </section>;
}
