"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { parseShopInput } from "@/lib/shopInput";
import { revalidatePath } from "next/cache";

export async function saveShop(formData: FormData) {
  const admin = await requireAdmin();
  const data = parseShopInput(formData);
  const id = formData.get("id");
  if (id !== null && (typeof id !== "string" || !id || id.length > 100)) throw new Error("Identificador inválido.");
  const shop = typeof id === "string"
    ? await prisma.shop.update({ where: { id }, data })
    : await prisma.shop.create({ data: { ...data, createdById: admin.id } });
  revalidatePath("/map");
  revalidatePath("/");
  revalidatePath("/admin/shops");
  return { id: shop.id };
}

export async function deleteShop(id: string) {
  await requireAdmin();
  if (typeof id !== "string" || !id || id.length > 100) throw new Error("Identificador inválido.");
  await prisma.shop.delete({ where: { id } });
  revalidatePath("/map");
  revalidatePath("/");
  revalidatePath("/admin/shops");
}
