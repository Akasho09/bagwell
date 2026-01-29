import { CategoryFilter } from "../components/CategoryFilter";
import { MasonryGrid } from "../components/Maso";
import { TopBar } from "../components/topBar2";
import { getImages } from "../lib/getImages";
import { Suspense } from "react";

// Loading fallback for CategoryFilter
function CategoryFilterSkeleton() {
  return (
    <div className="flex items-center gap-2 px-6 py-3 overflow-x-auto">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="px-5 py-2.5 rounded-full bg-slate-100 animate-pulse"
          style={{ width: `${80 + Math.random() * 40}px`, height: '36px' }}
        />
      ))}
    </div>
  );
}

export default async function Home() {
  const images = await getImages();
  
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-rose-50/30">
      
      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="shrink-0 border-b border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-sm sticky top-0 z-50">
          <div className="h-16">
            <TopBar />
          </div>
          
          {/* Category Filter with Suspense */}
          <div className="border-t border-slate-200/40">
            <Suspense fallback={<CategoryFilterSkeleton />}>
              <CategoryFilter />
            </Suspense>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6">
              <div className="w-32 h-32 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                <svg 
                  className="w-16 h-16 text-rose-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                No pins yet
              </h2>
              <p className="text-slate-500 text-center max-w-md mb-6">
                Start creating and saving pins to build your collection
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full font-semibold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 hover:scale-105">
                Create Your First Pin
              </button>
            </div>
          ) : (
            <MasonryGrid images={images} />
          )}
        </div>
      </main>
    </div>
  );
}