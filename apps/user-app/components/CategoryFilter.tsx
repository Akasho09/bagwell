"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  color?: string;
}

const categories: Category[] = [
  { id: "all", name: "All", color: "slate" },
  { id: "interior", name: "Interior Design", color: "amber" },
  { id: "nature", name: "Nature", color: "emerald" },
  { id: "fashion", name: "Fashion", color: "pink" },
  { id: "food", name: "Food & Drink", color: "orange" },
  { id: "travel", name: "Travel", color: "blue" },
  { id: "art", name: "Art", color: "purple" },
  { id: "photography", name: "Photography", color: "indigo" },
  { id: "architecture", name: "Architecture", color: "cyan" },
  { id: "technology", name: "Technology", color: "violet" },
  { id: "fitness", name: "Fitness", color: "green" },
  { id: "beauty", name: "Beauty", color: "rose" },
  { id: "diy", name: "DIY & Crafts", color: "teal" },
  { id: "quotes", name: "Quotes", color: "fuchsia" },
];

const colorVariants: { [key: string]: { bg: string; hover: string; active: string; text: string } } = {
  slate: { bg: "bg-slate-100", hover: "hover:bg-slate-200", active: "bg-slate-900 text-white", text: "text-slate-700" },
  amber: { bg: "bg-amber-100", hover: "hover:bg-amber-200", active: "bg-amber-600 text-white", text: "text-amber-700" },
  emerald: { bg: "bg-emerald-100", hover: "hover:bg-emerald-200", active: "bg-emerald-600 text-white", text: "text-emerald-700" },
  pink: { bg: "bg-pink-100", hover: "hover:bg-pink-200", active: "bg-pink-600 text-white", text: "text-pink-700" },
  orange: { bg: "bg-orange-100", hover: "hover:bg-orange-200", active: "bg-orange-600 text-white", text: "text-orange-700" },
  blue: { bg: "bg-blue-100", hover: "hover:bg-blue-200", active: "bg-blue-600 text-white", text: "text-blue-700" },
  purple: { bg: "bg-purple-100", hover: "hover:bg-purple-200", active: "bg-purple-600 text-white", text: "text-purple-700" },
  indigo: { bg: "bg-indigo-100", hover: "hover:bg-indigo-200", active: "bg-indigo-600 text-white", text: "text-indigo-700" },
  cyan: { bg: "bg-cyan-100", hover: "hover:bg-cyan-200", active: "bg-cyan-600 text-white", text: "text-cyan-700" },
  violet: { bg: "bg-violet-100", hover: "hover:bg-violet-200", active: "bg-violet-600 text-white", text: "text-violet-700" },
  green: { bg: "bg-green-100", hover: "hover:bg-green-200", active: "bg-green-600 text-white", text: "text-green-700" },
  rose: { bg: "bg-rose-100", hover: "hover:bg-rose-200", active: "bg-rose-600 text-white", text: "text-rose-700" },
  teal: { bg: "bg-teal-100", hover: "hover:bg-teal-200", active: "bg-teal-600 text-white", text: "text-teal-700" },
  fuchsia: { bg: "bg-fuchsia-100", hover: "hover:bg-fuchsia-200", active: "bg-fuchsia-600 text-white", text: "text-fuchsia-700" },
};

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "all") {
      router.push("/");
    } else {
      router.push(`/?category=${categoryId}`);
    }
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  return (
    <div className="relative w-full">
      {/* Scroll Container */}
      <div className="relative flex items-center gap-2">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border border-slate-200"
          >
            <ChevronLeft size={20} className="text-slate-700" />
          </button>
        )}

        {/* Categories Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-12"
        >
          {categories.map((category) => {
            const isActive = currentCategory === category.id;
            const colors = colorVariants[category.color || "slate"];

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  relative px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap
                  transition-all duration-300 transform hover:scale-105 shadow-sm
                  ${isActive 
                    ? `${colors?.active} shadow-lg ring-2 ring-offset-2 ring-current` 
                    : `${colors?.bg} ${colors?.text} ${colors?.hover}`
                  }
                `}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border border-slate-200"
          >
            <ChevronRight size={20} className="text-slate-700" />
          </button>
        )}
      </div>

      {/* Active Filter Badge */}
      {currentCategory !== "all" && (
        <div className="mt-4 flex items-center gap-2 px-12">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Active:</span>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg shadow-rose-500/30">
            <span className="capitalize">
              {categories.find(c => c.id === currentCategory)?.name}
            </span>
            <button
              onClick={() => handleCategoryClick("all")}
              className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Clear filter"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Hide scrollbar globally for this component */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}