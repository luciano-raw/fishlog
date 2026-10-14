"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function saveSpot(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Usuario no encontrado en Clerk.");

  const lat = parseFloat(formData.get("lat") as string);
  const lng = parseFloat(formData.get("lng") as string);
  const name = formData.get("name") as string;
  const species = formData.get("species") as string | null;

  if (isNaN(lat) || isNaN(lng) || !name) {
    throw new Error("Datos inválidos: faltan coordenadas o nombre del lugar.");
  }

  let imageUrl: string | null = null;
  const rawFile = formData.get("image") || formData.get("file");
  const file = rawFile instanceof File && rawFile.size > 0 ? rawFile : null;

  if (file) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `spot-${userId}-${Date.now()}.${fileExt}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("catches")
        .upload(fileName, buffer, {
          contentType: file.type || "image/jpeg",
          cacheControl: "3600",
          upsert: false,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("catches")
          .getPublicUrl(uploadData.path);
        imageUrl = publicUrlData.publicUrl;
      } else if (uploadError) {
        console.error("Error subiendo foto de spot a Supabase:", uploadError);
      }
    } catch (err) {
      console.error("Error procesando imagen de spot:", err);
    }
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

  await prisma.spot.create({
    data: {
      userId,
      name,
      speciesSeen: species?.trim() ? species.trim() : null,
      imageUrl,
      locationLat: lat,
      locationLng: lng,
    },
  });

  revalidatePath("/");
  revalidatePath("/map");

  return { success: true };
}
