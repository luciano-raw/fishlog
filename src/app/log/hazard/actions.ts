"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { sendPushToFriends } from "@/lib/pushNotifications";
import { parsePointInput, pointText } from "@/lib/pointInput";
import { uploadPointPhotos } from "@/lib/pointPhotos";

export async function saveHazard(formData: FormData): Promise<{ success: true } | { success: false; error: string }> {
  let input: ReturnType<typeof parsePointInput>;
  let detail: string | null;
  try { input = parsePointInput(formData); detail = pointText(formData.get("note")); }
  catch (error) { return { success: false, error: error instanceof Error ? error.message : "Revisa los datos del formulario." }; }
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, error: "Tu sesión expiró. Inicia sesión de nuevo para publicar." };
  const userId = clerkUser.id;
  let photos: Awaited<ReturnType<typeof uploadPointPhotos>>;
  try { photos = await uploadPointPhotos(formData, userId, "hazard"); }
  catch { return { success: false, error: "No pudimos subir la foto. Intenta otra vez o quítala para publicar sin foto." }; }
  try {
    await prisma.$transaction(async tx => {
      await tx.user.upsert({
        where: { id: userId }, update: {},
        create: { id: userId, email: clerkUser.primaryEmailAddress?.emailAddress || `${userId}@no-email.com`, username: clerkUser.username || clerkUser.firstName || "Pescador", avatarUrl: clerkUser.imageUrl },
      });
      await tx.hazard.create({ data: { userId, name: input.name, note: detail, imageUrl: photos.imageUrl, thumbnailUrl: photos.thumbnailUrl, locationLat: input.lat, locationLng: input.lng } });
    });
  } catch (error) {
    console.error("Failed to save hazard", error);
    await photos.cleanup();
    return { success: false, error: "No pudimos guardar el registro. Intenta nuevamente en unos momentos." };
  }
  after(async () => {
    try { await sendPushToFriends(userId, { title: "⚠️ Peligro reportado", body: `${clerkUser.username || clerkUser.firstName || "Un amigo"} compartió: ${input.name}`, url: "/map" }); }
    catch (error) { console.error("Point notification failed", error); }
  });
  revalidatePath("/"); revalidatePath("/map"); revalidatePath("/history");
  return { success: true };
}
