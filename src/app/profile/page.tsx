import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { RedirectToSignIn } from "@clerk/nextjs";
import { Users, Fish, MapPin, UserCheck, Shield } from "lucide-react";
import { InviteButtons, ClerkSettingsToggle } from "@/components/ProfileClientComponents";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) {
    return <RedirectToSignIn redirectUrl="/profile" />;
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress || `${userId}@no-email.com`;
  const username = clerkUser?.username || clerkUser?.firstName || "Pescador";
  const avatarUrl = clerkUser?.imageUrl;

  // Asegurar que el usuario existe en nuestra BD (Upsert)
  await prisma.user.upsert({
    where: { id: userId },
    update: {
      email,
      username,
      avatarUrl,
    },
    create: {
      id: userId,
      email,
      username,
      avatarUrl,
    },
  });

  // Estadísticas del usuario
  const [totalCatches, totalSpots] = await Promise.all([
    prisma.catch.count({ where: { userId } }),
    prisma.spot.count({ where: { userId } }),
  ]);

  // Buscar lista de amigos
  const friendships = await prisma.friendship.findMany({
    where: { userId },
    include: {
      friend: {
        include: {
          _count: {
            select: {
              catches: true,
              spots: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const friends = friendships.map((f) => f.friend);

  return (
    <div className="flex flex-col min-h-screen bg-deep-black pb-32">
      {/* Cabecera del Perfil */}
      <div className="p-6 bg-charcoal border-b border-forest-green/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-lime/50 bg-deep-black flex items-center justify-center shrink-0 shadow-lg">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-lime">{username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{username}</h1>
            <p className="text-xs text-light-gray/60 truncate">{email}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-lime/10 text-lime border border-lime/30">
              <Shield size={12} /> Pescador Fishlog
            </span>
          </div>
        </div>

        {/* Resumen de estadísticas */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-forest-green/20 text-center">
          <div className="bg-deep-black/60 p-3 rounded-2xl border border-forest-green/20">
            <p className="text-xl font-bold text-white">{totalCatches}</p>
            <p className="text-[10px] text-light-gray/60 uppercase font-semibold mt-0.5">Capturas</p>
          </div>
          <div className="bg-deep-black/60 p-3 rounded-2xl border border-forest-green/20">
            <p className="text-xl font-bold text-white">{totalSpots}</p>
            <p className="text-[10px] text-light-gray/60 uppercase font-semibold mt-0.5">Spots</p>
          </div>
          <div className="bg-deep-black/60 p-3 rounded-2xl border border-forest-green/20">
            <p className="text-xl font-bold text-lime">{friends.length}</p>
            <p className="text-[10px] text-light-gray/60 uppercase font-semibold mt-0.5">Amigos</p>
          </div>
        </div>
      </div>

      <main className="p-4 space-y-6">
        {/* Sección: Invitar Amigos */}
        <section className="bg-charcoal p-5 rounded-3xl border border-forest-green/20 space-y-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-lime" />
            <h2 className="text-white font-bold text-base">Conectar Pescadores</h2>
          </div>
          <p className="text-xs text-light-gray/70 leading-relaxed">
            Comparte tu enlace personal con tus compañeros de pesca. Al unirse, podrán ver sus capturas y spots en el mapa interactivo.
          </p>
          <InviteButtons userId={userId} />
        </section>

        {/* Sección: Lista de Amigos */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold text-light-gray/60 uppercase tracking-wider flex items-center gap-2">
              <Users size={14} className="text-forest-green" />
              Mis Amigos de Pesca ({friends.length})
            </h2>
          </div>

          {friends.length > 0 ? (
            <div className="space-y-2">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-4 bg-charcoal rounded-2xl border border-forest-green/20 shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-deep-black border border-forest-green/40 flex items-center justify-center shrink-0">
                      {friend.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={friend.avatarUrl} alt={friend.username || "Amigo"} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-forest-green">
                          {(friend.username || "A").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate">{friend.username || "Amigo"}</p>
                      <div className="flex items-center gap-3 text-[11px] text-light-gray/60 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Fish size={12} className="text-lime" /> {friend._count.catches} capturas
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-[#3b82f6]" /> {friend._count.spots} spots
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] text-lime font-medium bg-lime/10 px-2.5 py-1 rounded-full border border-lime/20 shrink-0">
                    <UserCheck size={12} /> Conectado
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-charcoal rounded-3xl border border-dashed border-forest-green/30 text-center space-y-2">
              <Users size={32} className="mx-auto text-forest-green/50" />
              <p className="text-white font-medium text-sm">Aún no tienes amigos conectados</p>
              <p className="text-xs text-light-gray/60 max-w-xs mx-auto">
                Usa el botón de WhatsApp de arriba para invitar a tus amigos y empezar a compartir sus jornadas.
              </p>
            </div>
          )}
        </section>

        {/* Sección: Configuración de la cuenta */}
        <section className="pt-2">
          <ClerkSettingsToggle />
        </section>
      </main>
    </div>
  );
}
