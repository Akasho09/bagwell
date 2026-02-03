"use server";

import { prisma } from "@repo/db/client";

export async function createImage(data: {
  category: string;
  prompt?: string;
  imagePath: string;
  gender? : "Male" | "Female" | "Unisex"
}) {
  return prisma.image.create({
    data
  });
}
