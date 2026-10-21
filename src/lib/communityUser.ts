import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function communityUser() {
  const user = await currentUser();
  if (!user) throw new Error("Inicia sesión para colaborar.");
  await prisma.user.upsert({ where: { id: user.id }, update: {}, create: {
    id: user.id, email: user.primaryEmailAddress?.emailAddress ?? `${user.id}@no-email.com`,
    username: user.username || user.firstName || "Pescador", avatarUrl: user.imageUrl,
  } });
  return user.id;
}
