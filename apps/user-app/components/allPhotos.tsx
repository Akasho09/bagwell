import {getImages} from "../lib/getImages";
import { getImageUrl } from "../lib/urls";

export async function Photos() {
  const images = await getImages();

  return (
    <div className="h-full w-full bg-green-100 p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img: any) => {
          if (!img.imagePath) return null;
          return (
            <div key={img.id}>
              <img
                src={getImageUrl(img.imagePath)}
                alt={img.description ?? "image"}
                width={300}
              />
              <p className="text-xs break-all">
                {img.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
