import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { recordId } from "@/lib/communityInput";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try { recordId(id); } catch { return Response.json({ error: "Registro inválido" }, { status: 400 }); }
  const { userId } = await auth();
  const [count, reaction] = await Promise.all([
    prisma.catchReaction.count({ where: { catchId: id } }),
    userId ? prisma.catchReaction.findUnique({ where: { catchId_userId: { catchId: id, userId } }, select: { catchId: true } }) : null,
  ]);
  return Response.json({ count, reacted: !!reaction }, { headers: { "Cache-Control": "private, no-store" } });
}
