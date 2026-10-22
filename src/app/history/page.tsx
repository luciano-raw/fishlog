import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import HistoryClient from "./HistoryClient";
import { lureLabel } from "@/lib/lures";

export default async function HistoryPage() {
  const { userId } = await auth.protect();

  // Fetch solo lo de este usuario (es su LOG personal)
  const catches = await prisma.catch.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const spots = await prisma.spot.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const hazards = await prisma.hazard.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Transformar todo a un arreglo unificado
  const items = [
    ...catches.map(c => ({
      id: c.id,
      type: 'catch' as const,
      title: c.species,
      subtitle: [c.weight ? `${c.weight} kg` : null, c.length ? `${c.length} cm` : null, lureLabel(c.lureType)].filter(Boolean).join(' · ') || 'Captura',
      date: new Date(c.createdAt).toLocaleDateString(),
      createdAt: c.createdAt,
      imageUrl: c.imageUrl
    })),
    ...spots.map(s => ({
      id: s.id,
      type: 'spot' as const,
      title: s.name,
      subtitle: s.speciesSeen ? `Visto: ${s.speciesSeen}` : 'Lugar marcado',
      date: new Date(s.createdAt).toLocaleDateString(),
      createdAt: s.createdAt,
      imageUrl: s.imageUrl,
      thumbnailUrl: s.thumbnailUrl
    })),
    ...hazards.map(h => ({
      id: h.id,
      type: 'hazard' as const,
      title: h.name,
      subtitle: h.note || 'Peligro',
      date: new Date(h.createdAt).toLocaleDateString(),
      createdAt: h.createdAt,
      imageUrl: h.imageUrl,
      thumbnailUrl: h.thumbnailUrl
    }))
  ];

  // Ordenar todo por fecha
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Calcular stats
  const stats = {
    totalCatches: catches.length,
    maxWeight: catches.reduce((max, c) => (c.weight && c.weight > max ? c.weight : max), 0),
  };

  return (
    <div className="min-h-screen p-4 flex flex-col space-y-6">
      <header className="mt-2">
        <h1 className="text-white text-2xl font-bold tracking-tight">Mi actividad</h1>
        <p className="text-light-gray/70 text-sm font-medium">Historial y estadísticas de pesca</p>
      </header>

      <HistoryClient items={items} stats={stats} />
    </div>
  );
}
