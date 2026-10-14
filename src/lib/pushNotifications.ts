import webpush from "web-push";
import { prisma } from "@/lib/prisma";
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } from "./vapidConstants";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export async function sendPushToFriends(
  authorUserId: string,
  payload: {
    title: string;
    body: string;
    url?: string;
  }
) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn("VAPID keys no están configuradas. No se puede enviar push.");
    return;
  }

  try {
    // 1. Obtener los IDs de los amigos del autor
    const friendships = await prisma.friendship.findMany({
      where: { userId: authorUserId },
      select: { friendId: true },
    });

    const friendIds = friendships.map((f) => f.friendId);
    if (friendIds.length === 0) return;

    // 2. Obtener todas las suscripciones push de los amigos
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId: { in: friendIds },
      },
    });

    if (subscriptions.length === 0) return;

    const payloadString = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || "/",
      icon: "/icons/icon-192x192.png",
    });

    // 3. Enviar a cada dispositivo en paralelo
    const sendPromises = subscriptions.map(async (sub) => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushConfig, payloadString);
      } catch (err: any) {
        // Si el endpoint expiró o fue desuscrito por el navegador (404 o 410)
        if (err.statusCode === 404 || err.statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        } else {
          console.error("Error enviando push notification individual:", err?.message);
        }
      }
    });

    await Promise.allSettled(sendPromises);
  } catch (error) {
    console.error("Error general en sendPushToFriends:", error);
  }
}
