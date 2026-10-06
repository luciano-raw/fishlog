import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    console.log("Probando crear usuario...");
    const user = await prisma.user.upsert({
      where: { id: "test-user-123" },
      update: {},
      create: {
        id: "test-user-123",
        email: "test@example.com",
        username: "TestAngler",
        avatarUrl: null,
      }
    });
    console.log("Usuario OK:", user);

    console.log("Probando crear Catch...");
    const newCatch = await prisma.catch.create({
      data: {
        userId: "test-user-123",
        species: "Test Fish",
        length: 20,
        weight: 1.5,
        locationLat: 0,
        locationLng: 0,
      }
    });
    console.log("Catch OK:", newCatch);
  } catch (error) {
    console.error("Error en DB:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
