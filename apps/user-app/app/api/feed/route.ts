import { NextRequest, NextResponse } from "next/server";
import { getFilteredImages } from "../../../lib/getImages";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const cursor = searchParams.get("cursor") || undefined;
  const gender = searchParams.get("gender") || undefined;
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;

  const images = await getFilteredImages({
    cursor,
    gender: gender as any,
    category: category as any,
    search,
  });

  return NextResponse.json({
    images,
    nextCursor: images.at(-1)?.id || null,
  });
}
