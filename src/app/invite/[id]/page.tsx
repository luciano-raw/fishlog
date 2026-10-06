import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { CheckCircle, Fish } from "lucide-react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export default async function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: inviterId } = await params;
  const { userId } = await auth();

  // Buscar quién es el invitador para mostrar su nombre
  const inviter = await prisma.user.findUnique({
    where: { id: inviterId }
  });

  const inviterName = inviter?.username || "Un amigo";

  if (!userId) {
    // Si el amigo NO ha iniciado sesión, le mostramos la invitación bonita
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-6 text-center bg-deep-black">
        <div className="w-20 h-20 bg-charcoal rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(164,255,61,0.2)]">
          <Fish size={40} className="text-lime" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">¡{inviterName} te ha invitado!</h2>
        <p className="text-light-gray/70 mb-8 max-w-sm">
          Únete a Fishlog para compartir tus mejores spots de pesca, fotos y competir amistosamente.
        </p>
        
        {/* Clerk Sign In con redirección de vuelta a esta misma página */}
        <SignInButton mode="modal" fallbackRedirectUrl={`/invite/${inviterId}`}>
          <button className="w-full max-w-xs px-8 py-4 bg-lime text-deep-black rounded-2xl font-bold shadow-[0_0_15px_rgba(164,255,61,0.3)] hover:scale-105 transition-transform">
            Aceptar Invitación
          </button>
        </SignInButton>
      </div>
    );
  }

  if (userId === inviterId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-4 text-center bg-deep-black">
        <h2 className="text-xl text-white mb-2">¡Este es tu propio enlace!</h2>
        <Link href="/" className="mt-4 px-6 py-2 bg-charcoal text-lime rounded-full font-bold border border-lime/50">Volver al Home</Link>
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

  // Crear la amistad bidireccional automáticamente
  try {
    await prisma.friendship.upsert({
      where: { userId_friendId: { userId: userId, friendId: inviterId } },
      update: {},
      create: { userId: userId, friendId: inviterId }
    });

    await prisma.friendship.upsert({
      where: { userId_friendId: { userId: inviterId, friendId: userId } },
      update: {},
      create: { userId: inviterId, friendId: userId }
    });
  } catch (error) {
    console.error("Error creando amistad:", error);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-4 text-center bg-deep-black">
      <CheckCircle size={80} className="text-lime mb-6 shadow-lime rounded-full drop-shadow-[0_0_20px_rgba(164,255,61,0.4)]" />
      <h2 className="text-3xl font-bold text-white mb-3">¡Conectados!</h2>
      <p className="text-light-gray/80 mb-8 max-w-xs">
        Tú y {inviterName} ya son amigos en Fishlog. Ahora podrán ver las capturas del otro.
      </p>
      <Link href="/" className="w-full max-w-xs px-8 py-4 bg-lime text-deep-black rounded-2xl font-bold shadow-[0_0_15px_rgba(164,255,61,0.2)] hover:scale-105 transition-transform">
        Ir al Mapa
      </Link>
    </div>
  );
}
