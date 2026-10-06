import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function InvitePage({ params }: { params: { id: string } }) {
  const { id: inviterId } = params;
  const { userId } = await auth();
  
  if (!userId) {
    // Si no está logueado, Clerk middleware o un layout debería enviarlo a Sign In
    // Pero por si acaso, lo forzamos a loguearse y luego volver aquí.
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-xl text-white mb-2">¡Te han invitado a pescar!</h2>
        <p className="text-light-gray/70">Inicia sesión o regístrate para conectar con esta persona.</p>
      </div>
    );
  }

  if (userId === inviterId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-xl text-white mb-2">¡Este es tu propio enlace!</h2>
        <Link href="/" className="mt-4 px-6 py-2 bg-lime text-black rounded-full font-bold">Volver al Home</Link>
      </div>
    );
  }

  // Sincronizar al usuario visitante en nuestra BD por si acaba de registrarse
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress || `${userId}@no-email.com`;
  
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: email,
      username: clerkUser?.username || clerkUser?.firstName || "Angler",
      avatarUrl: clerkUser?.imageUrl,
    }
  });

  // Crear la amistad bidireccional
  try {
    // 1. Visitante agrega a Inviter
    await prisma.friendship.upsert({
      where: {
        userId_friendId: { userId: userId, friendId: inviterId }
      },
      update: {},
      create: { userId: userId, friendId: inviterId }
    });

    // 2. Inviter agrega a Visitante
    await prisma.friendship.upsert({
      where: {
        userId_friendId: { userId: inviterId, friendId: userId }
      },
      update: {},
      create: { userId: inviterId, friendId: userId }
    });
  } catch (error) {
    console.error("Error creando amistad:", error);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-4 text-center bg-deep-black">
      <CheckCircle size={64} className="text-lime mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">¡Amigos Conectados!</h2>
      <p className="text-light-gray/70 mb-8">Ahora podrán ver las capturas el uno del otro en el mapa y el historial.</p>
      <Link href="/" className="px-8 py-3 bg-lime text-black rounded-full font-bold shadow-[0_0_15px_rgba(164,255,61,0.2)]">
        Ir a la app
      </Link>
    </div>
  );
}
