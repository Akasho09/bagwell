import { getImagesByCategory } from "../../lib/getImages";
import { getImageUrl } from "../../lib/urls";

export const dynamic = "force-dynamic";

export default async function PhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams; 
  const images = await getImagesByCategory(category);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="rounded bg-white shadow">
            <img
              src={getImageUrl(img.imagePath)}
              className="h-48 w-full object-cover"
              alt={img.description ?? "image"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}