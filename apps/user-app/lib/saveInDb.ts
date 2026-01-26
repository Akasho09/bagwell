"use server";

import { prisma } from "@repo/db/client";

export async function createImage(data: {
  category: string;
  description?: string;
  imagePath: string;
}) {
  return prisma.image.create({
    data
  });
}
