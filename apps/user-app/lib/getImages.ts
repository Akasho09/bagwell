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

export async function getRandomImages(limit: number = 10) {
  return prisma.$queryRaw<
    {
      id: string;
      imagePath: string;
      category: string;
      prompt: string | null;
      like: number;
      createdAt: Date;
    }[]
  >`
    SELECT *
    FROM "public"."Image"
    ORDER BY RANDOM()
    LIMIT ${limit};
  `;
}


export async function getRandomImagesByCategory(
  category: string,
  limit: number = 10
) {
  return prisma.$queryRaw`
    SELECT *
    FROM "public"."Image"
    WHERE category = ${category}
    ORDER BY RANDOM()
    LIMIT ${limit};
  `;
}
