"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteItem(id: string, type: 'catch' | 'spot' | 'hazard') {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  try {
    if (type === 'catch') {
      await prisma.catch.delete({
        where: { id, userId }
      });
    } else if (type === 'spot') {
      await prisma.spot.delete({
        where: { id, userId }
      });
    } else if (type === 'hazard') {
      await prisma.hazard.delete({
        where: { id, userId }
      });
    }
    
    revalidatePath('/history');
    revalidatePath('/');
    revalidatePath('/map');
    
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar:", error);
    return { success: false, error: "No se pudo eliminar el registro" };
  }
}
