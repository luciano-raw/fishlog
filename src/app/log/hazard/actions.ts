"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function saveHazard(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const lat = parseFloat(formData.get("lat") as string);
  const lng = parseFloat(formData.get("lng") as string);
  const name = formData.get("name") as string;
  const note = formData.get("note") as string | null;

  if (isNaN(lat) || isNaN(lng) || !name) {
    throw new Error("Datos inválidos");
  }

  await prisma.hazard.create({
    data: {
      userId,
      name,
      note,
      locationLat: lat,
      locationLng: lng,
    }
  });

  return { success: true };
}
