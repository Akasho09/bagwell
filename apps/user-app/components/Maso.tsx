"use client";

import { useRouter } from "next/navigation";
import { ImageCard } from "./imageCard";

/* ---------------- TYPES ---------------- */

interface Image {
  id: string;
  imagePath?: string;
  prompt?: string | null;
  category?: string;
  skeleton?: boolean;
}

interface MasonryGridProps {
  images: Image[];
}

/* ---------------- SKELETON CARD ---------------- */

export function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-2xl mb-4 break-inside-avoid"
      style={{ 
             height: 240,
             background: "var(--border-color)"
            }}
    />
  );
}

/* ---------------- GRID ---------------- */

export function MasonryGrid({ images }: MasonryGridProps) {
  const router = useRouter();

  if (!images.length) {
    return (
      <div className="text-center py-20 text-slate-500">
        No pins found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">

        {images.map((image) => {

          /* ---------- Skeleton ---------- */
          if (image.skeleton) {
            return <SkeletonCard key={image.id} />;
          }

          /* ---------- Real Image ---------- */
          return (
            <div
              key={image.id}
              className="break-inside-avoid "
              // onClick={() => router.push(`/pin/${image.id}`)}
            >
              <ImageCard
                id={image.id}
                imagePath={image.imagePath!}
                prompt={image.prompt ?? null}
                category={image.category!}
                onClick={() => router.push(`/pin/${image.id}`)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
