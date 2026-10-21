"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { communityUser } from "@/lib/communityUser";
import { commentBody, pointType, recordId } from "@/lib/communityInput";
import { revalidatePath } from "next/cache";

export async function setCatchReaction(id: string, reacted: boolean) {
  const userId = await communityUser();
  const catchId = recordId(id);
  if (typeof reacted !== "boolean") throw new Error("Reacción inválida.");
  if (reacted) await prisma.catchReaction.upsert({ where: { catchId_userId: { catchId, userId } }, create: { catchId, userId }, update: {} });
  else await prisma.catchReaction.deleteMany({ where: { catchId, userId } });
  const count = await prisma.catchReaction.count({ where: { catchId } });
  return { count, reacted };
}

export async function addPointComment(type: string, id: string, body: string) {
  const userId = await communityUser();
  const kind = pointType(type), targetId = recordId(id), text = commentBody(body);
  await prisma.$transaction(async tx => {
    // Serialize comment submissions for each user, including concurrent requests.
    await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${userId} FOR UPDATE`;
    const last = await tx.pointComment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" }, select: { createdAt: true } });
    if (last && Date.now() - last.createdAt.getTime() < 10000) throw new Error("Espera unos segundos antes de comentar de nuevo.");
    await tx.pointComment.create({ data: { userId, body: text, ...(kind === "spot" ? { spotId: targetId } : { hazardId: targetId }) } });
  });
  revalidatePath(`/points/${kind}/${targetId}`);
}

export async function deletePointComment(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Inicia sesión.");
  const commentId = recordId(id);
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  const comment = await prisma.pointComment.findUnique({ where: { id: commentId }, select: { userId: true, spotId: true, hazardId: true } });
  if (!comment || (comment.userId !== userId && user?.role !== "ADMIN")) throw new Error("No puedes eliminar este comentario.");
  await prisma.pointComment.delete({ where: { id: commentId } });
  revalidatePath(`/points/${comment.spotId ? "spot" : "hazard"}/${comment.spotId ?? comment.hazardId}`);
}
