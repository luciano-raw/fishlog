"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveSpot(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const lat = parseFloat(formData.get("lat") as string);
  const lng = parseFloat(formData.get("lng") as string);
  const name = formData.get("name") as string;
  const species = formData.get("species") as string | null;

  if (isNaN(lat) || isNaN(lng) || !name) {
    throw new Error("Datos inválidos");
  }

  let imageUrl = null;
  const file = formData.get("file") as File | null;
  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${userId}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("catches")
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage
        .from("catches")
        .getPublicUrl(uploadData.path);
      imageUrl = publicUrlData.publicUrl;
    }
  }

  await prisma.spot.create({
    data: {
      userId,
      name,
      speciesSeen: species,
      imageUrl,
      locationLat: lat,
      locationLng: lng,
    }
  });

  return { success: true };
}
