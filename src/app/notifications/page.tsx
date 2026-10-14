import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, Bell, Fish, MapPin, Sparkles, BookOpen, Users, AlertTriangle } from "lucide-react";
import { RedirectToSignIn } from "@clerk/nextjs";

export default async function NotificationsPage() {
  const { userId } = await auth();

  if (!userId) {
    return <RedirectToSignIn redirectUrl="/notifications" />;
  }

  // 1. Obtener lista de amigos
  const friendships = await prisma.friendship.findMany({
    where: { userId },
    select: { friendId: true },
  });
  const friendIds = friendships.map((f) => f.friendId);

  // 2. Obtener actividad reciente de amigos (últimas capturas y spots)
  const friendCatches = friendIds.length > 0
    ? await prisma.catch.findMany({
        where: { userId: { in: friendIds } },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
    : [];

  const friendSpots = friendIds.length > 0
    ? await prisma.spot.findMany({
        where: { userId: { in: friendIds } },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
    : [];

  // 3. Notificaciones del sistema
  const systemNotifications = [
    {
      id: "sys-encyclopedia",
      type: "system",
      title: "Enciclopedia de Especies Lista",
      description: "Explora 35 fichas técnicas oficiales de peces de Chile, fotos y señuelos recomendados.",
      time: "Reciente",
      link: "/encyclopedia",
      icon: Fish,
      iconColor: "text-lime",
      bgColor: "bg-lime/10",
      borderColor: "border-lime/30",
    },
    {
      id: "sys-regulations",
      type: "system",
      title: "Reglamentos de Pesca 2026",
      description: "Consulta las normativas vigentes por región de Arica a Magallanes, disponible offline.",
      time: "Reciente",
      link: "/regulations",
      icon: BookOpen,
      iconColor: "text-[#3b82f6]",
      bgColor: "bg-[#3b82f6]/10",
      borderColor: "border-[#3b82f6]/30",
    },
    {
      id: "sys-offline",
      type: "system",
      title: "Fishlog sin conexión",
      description: "Agrega la app a tu pantalla de inicio desde tu navegador para usarla en el río sin internet.",
      time: "Consejo",
      link: "/",
      icon: Sparkles,
      iconColor: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/30",
    },
  ];

  // 4. Transformar actividad de amigos a formato unificado
  const activityNotifications = [
    ...friendCatches.map((c) => ({
      id: `catch-${c.id}`,
      type: "friend_catch",
      title: `${c.user?.username || "Un amigo"} registró una captura`,
      description: `${c.species} ${c.weight ? `• ${c.weight} kg` : ""} ${c.length ? `• ${c.length} cm` : ""}`,
      time: new Date(c.createdAt).toLocaleDateString("es-CL", {
        day: "numeric",
        month: "short",
      }),
      link: "/map",
      icon: Fish,
      iconColor: "text-lime",
      bgColor: "bg-lime/10",
      borderColor: "border-lime/30",
    })),
    ...friendSpots.map((s) => ({
      id: `spot-${s.id}`,
      type: "friend_spot",
      title: `${s.user?.username || "Un amigo"} compartió un nuevo Spot`,
      description: `Spot "${s.name}" agregado al mapa colaborativo.`,
      time: new Date(s.createdAt).toLocaleDateString("es-CL", {
        day: "numeric",
        month: "short",
      }),
      link: "/map",
      icon: MapPin,
      iconColor: "text-[#3b82f6]",
      bgColor: "bg-[#3b82f6]/10",
      borderColor: "border-[#3b82f6]/30",
    })),
  ];

  const allNotifications = [...activityNotifications, ...systemNotifications];

  return (
    <div className="flex flex-col min-h-screen bg-deep-black pb-32">
      {/* Header fijo */}
      <header className="sticky top-0 left-0 w-full p-4 z-10 flex items-center bg-deep-black/90 backdrop-blur-md border-b border-forest-green/20">
        <Link
          href="/"
          className="p-2 bg-charcoal rounded-full text-lime border border-forest-green/50 hover:bg-forest-green/20 transition-colors"
        >
          <ChevronLeft size={24} />
        </Link>
        <div className="ml-3 flex items-center gap-2">
          <Bell size={20} className="text-lime" />
          <h1 className="text-lg font-bold text-white">Notificaciones</h1>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Banner de estado de amigos */}
        {friendIds.length === 0 && (
          <div className="bg-charcoal p-4 rounded-3xl border border-forest-green/30 flex items-start gap-3">
            <div className="p-2 bg-lime/10 rounded-2xl text-lime shrink-0">
              <Users size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">Conecta con tus amigos de pesca</h3>
              <p className="text-light-gray/70 text-xs mt-1">
                Aún no tienes amigos agregados. Cuando se conecten, verás aquí sus nuevas capturas y spots al instante.
              </p>
              <Link
                href="/profile"
                className="inline-block mt-3 text-xs text-lime font-bold hover:underline"
              >
                Ir a mi perfil e invitar →
              </Link>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold text-light-gray/60 uppercase tracking-wider">
            Actividad & Avisos ({allNotifications.length})
          </h2>
        </div>

        {/* Lista de notificaciones */}
        <div className="space-y-3">
          {allNotifications.map((notif) => {
            const IconComponent = notif.icon;
            return (
              <Link
                key={notif.id}
                href={notif.link}
                className="flex items-start gap-4 p-4 bg-charcoal rounded-3xl border border-forest-green/20 hover:border-lime/40 transition-all shadow-md group"
              >
                <div
                  className={`w-11 h-11 rounded-2xl ${notif.bgColor} ${notif.borderColor} border flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <IconComponent size={20} className={notif.iconColor} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-white font-bold text-sm group-hover:text-lime transition-colors truncate">
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-light-gray/50 shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-light-gray/80 text-xs mt-1 leading-relaxed line-clamp-2">
                    {notif.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
