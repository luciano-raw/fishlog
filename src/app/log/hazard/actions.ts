"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendPushToFriends } from "@/lib/pushNotifications";

export async function saveHazard(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Usuario no encontrado en Clerk.");

  const lat = parseFloat(formData.get("lat") as string);
  const lng = parseFloat(formData.get("lng") as string);
  const name = formData.get("name") as string;
  const note = formData.get("note") as string | null;

  if (isNaN(lat) || isNaN(lng) || !name) {
    throw new Error("Datos inválidos: faltan coordenadas o nombre del peligro.");
  }

  // Asegurar que el usuario existe en nuestra base de datos (Upsert)
  const email = clerkUser.emailAddresses?.[0]?.emailAddress || `${userId}@no-email.com`;
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: email,
      username: clerkUser.username || clerkUser.firstName || "Angler",
      avatarUrl: clerkUser.imageUrl,
    },
  });

  await prisma.hazard.create({
    data: {
      userId,
      name,
      note,
      locationLat: lat,
      locationLng: lng,
    },
  });

  // Enviar push a los amigos conectados
  sendPushToFriends(userId, {
    title: "⚠️ Peligro reportado en la zona",
    body: `${clerkUser.username || clerkUser.firstName || "Un amigo"} reportó: "${name}"${note ? ` (${note})` : ""}.`,
    url: "/map",
  }).catch((err) => console.error("Error enviando push de peligro:", err));

  revalidatePath("/");
  revalidatePath("/map");

  return { success: true };
}
