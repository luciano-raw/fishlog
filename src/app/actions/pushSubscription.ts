"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function savePushSubscription(sub: {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  if (!sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
    throw new Error("Datos de suscripción incompletos");
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    update: {
      userId,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
    create: {
      userId,
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
  });

  return { success: true };
}

export async function removePushSubscription(endpoint: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  await prisma.pushSubscription.deleteMany({
    where: { endpoint },
  });

  return { success: true };
}
