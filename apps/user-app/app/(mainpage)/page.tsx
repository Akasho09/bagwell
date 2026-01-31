import { Suspense } from "react";
import { CategoryFilter } from "../../components/CategoryFilter";
import { MasonryGrid } from "../../components/Maso";
import { getImagesByCategory } from "../../lib/getImages";

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.category;
  const searchQuery = params.search;

  // Fetch images with optional filtering
  const images = await getImagesByCategory(category);

  return (
    <div className="min-h-screen bg-white">
      {/* Category Filter */}
      <Suspense fallback={<CategoryFilterSkeleton />}>
        <CategoryFilter />
      </Suspense>

      {/* Image Grid */}
      <Suspense fallback={<GridSkeleton />}>
        {searchQuery && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Search results for "{searchQuery}"
              </h2>
              <span className="text-sm text-slate-500">
                ({images.length} {images.length === 1 ? 'result' : 'results'})
              </span>
            </div>
          </div>
        )}
        <MasonryGrid images={images} />
      </Suspense>
    </div>
  );
}

// Loading skeletons
function CategoryFilterSkeleton() {
  return (
    <div className="border-b border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-2 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-32 bg-slate-200 rounded-full animate-pulse shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="break-inside-avoid mb-4"
          >
            <div
              className="bg-slate-200 rounded-2xl animate-pulse"
              style={{ height: `${200 + Math.random() * 200}px` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Metadata
export const metadata = {
  title: "PinBoard - Discover & Share Creative Ideas",
  description: "Discover and save creative ideas, images, and inspiration. Browse through categories like interior design, nature, fashion, and more.",
};