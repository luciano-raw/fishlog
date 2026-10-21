import "server-only";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getAdmin() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
  return user?.role === "ADMIN" ? user : null;
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new Error("Solo un administrador puede gestionar las tiendas.");
  return admin;
}
