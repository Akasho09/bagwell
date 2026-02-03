import { InfiniteFeed } from "../../components/InfiniteFeed";
import { getFilteredImages } from "../../lib/getImages";
import { Gender, Category } from "@prisma/client";

export default async function HomePage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {

  const images = await getFilteredImages({
    gender:  searchParams?.gender as Gender | undefined,
    category: searchParams?.category as Category | undefined,
    search: searchParams?.search as string | undefined,
  });

  const nextCursor = images.at(-1)?.id;

  return (
    <InfiniteFeed
      initialImages={images}
      initialCursor={nextCursor}
      filters={searchParams || {}}
    />
  );
}
