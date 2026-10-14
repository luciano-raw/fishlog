"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function removeFriend(friendId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  try {
    // Eliminar la amistad bidireccional
    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    revalidatePath("/profile");
    revalidatePath("/map");
    revalidatePath("/");
    revalidatePath("/notifications");

    return { success: true };
  } catch (error: any) {
    console.error("Error al eliminar amigo:", error);
    throw new Error(error?.message || "No se pudo eliminar el amigo");
  }
}
