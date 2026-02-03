import Image from "next/image";
import { getImageUrl } from "../lib/urls";

interface ImageCardProps {
  id: string;
  imagePath: string;
  prompt: string | null;
  category: string;
  onClick: () => void;
}

export const ImageCard = function ImageCard({
  imagePath,
  prompt,
  category,
  onClick,
}: ImageCardProps) {

  return (
    <div
      className="group relative cursor-pointer break-inside-avoid mb-4"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition">

        {/* Image */}
        <Image
          src={getImageUrl(imagePath)}
          alt={prompt || "Pin image"}
          width={500}
          height={600}
          sizes="(max-width:768px) 100vw, 25vw"
          className={`w-full h-auto object-cover transition duration-300 group-hover:scale-105`}
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition" />

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition">

          {prompt && (
            <p className="!text-white text-sm font-semibold line-clamp-2 mb-2">
              {prompt}
            </p>
          )}

          <span className="px-3 py-1 bg-white/90 !text-black rounded-full text-xs font-semibold">
            {category}
          </span>

        </div>
      </div>
    </div>
  );
};
