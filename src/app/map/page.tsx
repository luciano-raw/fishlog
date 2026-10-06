import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import MapDynamic from "@/components/MapDynamic";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function MapPage() {
  const { userId } = await auth();
  
  let catches: any[] = [];
  if (userId) {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }]
      }
    });
    const friendIds = friendships.map(f => f.userId === userId ? f.friendId : f.userId);

    catches = await prisma.catch.findMany({
      where: { userId: { in: [userId, ...friendIds] } },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black relative">
      {/* Header flotante */}
      <header className="absolute top-0 left-0 w-full p-4 z-10 flex items-center bg-gradient-to-b from-deep-black/80 to-transparent pointer-events-none">
        <Link href="/" className="pointer-events-auto p-2 bg-charcoal/80 rounded-full text-lime backdrop-blur-sm border border-forest-green/50">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-white drop-shadow-md ml-3">Explorar Hitos</h1>
      </header>

      {/* Mapa Interactivo */}
      <main className="flex-1">
        <MapDynamic catches={catches} interactive={true} />
      </main>
    </div>
  );
}
