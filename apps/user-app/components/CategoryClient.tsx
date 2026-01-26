import { getImagesByCategory } from "../lib/getImages";
import { getImageUrl } from "../lib/urls";

export default async function PhotosPageclient(category : string) {
  const images = await getImagesByCategory(category);

  return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="rounded bg-white shadow">
            <img
              src={getImageUrl(img.imagePath)}
              className="h-48 w-full object-cover"
              alt={img.prompt ?? "image"}
            />
            {img.prompt && (
              <p className="p-2 text-sm">{img.prompt}</p>
            )}
          </div>
        ))}
      </div>
  );
}
