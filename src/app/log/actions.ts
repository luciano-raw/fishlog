"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveCatch(formData: FormData) {
  // 1. Verificar Autenticación
  const { userId } = await auth();
  if (!userId) throw new Error("No estás autenticado.");

  // 2. Obtener datos del usuario de Clerk (por si hay que crearlo en BD)
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Usuario no encontrado en Clerk.");

  // 3. Extraer los datos del formulario
  const file = formData.get("image") as File | null;
  const species = formData.get("species") as string;
  const length = formData.get("length") as string;
  const weight = formData.get("weight") as string;
  const lat = formData.get("lat") as string;
  const lng = formData.get("lng") as string;

  if (!species) throw new Error("La especie es obligatoria.");

  let imageUrl = null;

  // 4. Subir la imagen a Supabase (si existe)
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('catches')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Error subiendo imagen:", error);
      throw new Error("No se pudo subir la imagen.");
    }

    // Obtener la URL pública
    const { data: publicUrlData } = supabase.storage
      .from('catches')
      .getPublicUrl(fileName);
      
    imageUrl = publicUrlData.publicUrl;
  }

  // 5. Sincronizar el usuario en nuestra BD (Upsert)
  const email = clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0 
    ? clerkUser.emailAddresses[0].emailAddress 
    : `${userId}@no-email.com`;

  try {
    await prisma.user.upsert({
      where: { id: userId },
      update: {}, 
      create: {
        id: userId,
        email: email,
        username: clerkUser.username || clerkUser.firstName || "Angler",
        avatarUrl: clerkUser.imageUrl,
      }
    });

    // 6. Guardar la pesca en Postgres vía Prisma
    await prisma.catch.create({
      data: {
        userId,
        species,
        length: length ? parseFloat(length) : null,
        weight: weight ? parseFloat(weight) : null,
        imageUrl,
        locationLat: lat ? parseFloat(lat) : null,
        locationLng: lng ? parseFloat(lng) : null,
      }
    });
  } catch (error) {
    console.error("Error en base de datos:", error);
    throw new Error("Error al guardar en la base de datos.");
  }

  // 7. Refrescar la página principal y redirigir
  revalidatePath("/");
  redirect("/");
}
