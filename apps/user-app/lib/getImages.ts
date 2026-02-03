import { prisma } from "@repo/db/client";
import { Gender, Category } from "@prisma/client";

interface FilterOptions {
  gender?: Gender;
  category?: Category;
  search?: string;
  cursor?: string;
  limit?: number;
}

export  async function getFilteredImages({
  gender,
  category,
  search,
  cursor,
  limit = 6,
}: FilterOptions) {
  return prisma.image.findMany({
    take: limit,
    skip: cursor ? 1 : 0,

    cursor: cursor ? { id: cursor } : undefined,

    where: {
      ...(gender && { gender }),
      ...(category && { category }),

      ...(search && {
        OR: [
          { prompt: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}


export async function getImages(){
  return prisma.image.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getImageById(id: string) {
  const image = await prisma.image.findUnique({
    where: { id },
  });
  return image;
}

export async function getImagesByCategory(category?: string) {
  return prisma.image.findMany({
    where: category ? { category } : {},
    orderBy: { createdAt: "desc" }
  });
}

export async function getImageByGender(gender: "Male" | "Female" | "Unisex") {
  try {
    return await prisma.image.findMany({
      where: { gender : gender },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    throw new Error("Failed to fetch images");
  }
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


// NEW: Get related images (same category, exclude current)
export async function getRelatedImages(
  image: {
    id: string;
    category: string;
    gender: Gender;
  },
  limit = 4
) {
  /* ⭐ Smart Related Logic */

  const related = await prisma.image.findMany({
    where: {
      id: { not: image.id },

      OR: [
        { category: image.category },
        { gender: image.gender },
      ],
    },

    orderBy: [{ like: "desc" }, { createdAt: "desc" }],

    take: limit,

  });

  /* ⭐ Fallback if not enough results */

  if (related.length < limit) {
    const fallback = await prisma.image.findMany({
      where: {
        id: {
          notIn: [image.id, ...related.map((i) => i.id)],
        },
      },
      take: limit - related.length,
      orderBy: { createdAt: "desc" },
    });

    return [...related, ...fallback];
  }

  return related;
}