import { CategoryFilter } from "../components/CategoryFilter";
import { MasonryGrid } from "../components/Maso";
import { TopBar } from "../components/topBar2";
import { getImages } from "../lib/getImages";

export default async function Home() {
  const images = await getImages();
  
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-rose-50/30">
      
      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="shrink-0 border-b border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-sm sticky top-0 z-50">
          <TopBar />
          {/* Category Filter Bar */}
          <div className="border-t border-slate-200/40 px-6 py-3">
            <CategoryFilter />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <MasonryGrid images={images} />
        </div>
      </main>
    </div>
  );
}