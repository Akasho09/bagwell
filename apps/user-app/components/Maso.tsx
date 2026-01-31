"use client";

import { useRouter } from "next/navigation";
import { ImageCard } from "./imageCard";

interface Image {
  id: string;
  imagePath: string;
  prompt: string | null;
  category: string;
  like: number;
}

interface MasonryGridProps {
  images: Image[];
}

export function MasonryGrid({ images }: MasonryGridProps) {
  const router = useRouter();

  const handleImageClick = (id: string) => {
    router.push(`/pin/${id}`);
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-32 h-32 mb-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
          <svg
            className="w-16 h-16 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">No pins found</h3>
        <p className="text-slate-600 mb-6">Try a different category or search term</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            id={image.id}
            imagePath={image.imagePath}
            prompt={image.prompt}
            category={image.category}
            like={image.like}
            onClick={() => handleImageClick(image.id)}
          />
        ))}
      </div>

      {/* Load More Indicator (optional - for future pagination) */}
      {images.length >= 20 && (
        <div className="flex justify-center mt-12 mb-8">
          <div className="text-slate-500 text-sm font-medium">
            Showing {images.length} pins
          </div>
        </div>
      )}
    </div>
  );
}