import { prisma } from "@repo/db/client";

export async function getImages() {
  return prisma.image.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getImagesByCategory(category?: string) {
  return prisma.image.findMany({
    where: category ? { category } : {},
    orderBy: { createdAt: "desc" }
  });
}

