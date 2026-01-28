// app/components/Maso.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Heart, Share2, MoreHorizontal, Download, Bookmark } from "lucide-react";
import { getImageUrl } from "../lib/urls";

interface PinImage {
  id: string;
  imagePath: string;
  prompt: string | null;
  category: string;
  like: number;
  createdAt: Date;
  user?: {
    name: string;
    avatar?: string;
    id?: string;
  };
  saves?: number;
  height?: number;
}

interface MasonryGridProps {
  images: PinImage[];
  onLoadMore?: () => void;
}

export function MasonryGrid({ images, onLoadMore }: MasonryGridProps) {
  const [columns, setColumns] = useState(4);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Responsive columns
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(2);
      else if (width < 1024) setColumns(3);
      else if (width < 1536) setColumns(4);
      else setColumns(5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!onLoadMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [onLoadMore]);

  // Distribute images into columns
  const distributeImages = () => {
    const cols: PinImage[][] = Array.from({ length: columns }, () => []);
    const colHeights = Array(columns).fill(0);

    images.forEach((img) => {
      const shortestCol = colHeights.indexOf(Math.min(...colHeights));
      cols[shortestCol]?.push(img);
      colHeights[shortestCol] += img.height || 300;
    });

    return cols;
  };

  const columnImages = distributeImages();

  return (
    <div className="w-full px-4 py-6">
      {/* Empty State */}
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
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
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No pins yet</h2>
          <p className="text-slate-500 text-center max-w-md">
            Start creating and saving pins to build your collection
          </p>
        </div>
      ) : (
        /* Masonry Grid */
        <div 
          className="flex gap-4 max-w-[2000px] mx-auto"
          style={{ columnCount: columns }}
        >
          {columnImages.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4" style={{ flex: 1 }}>
              {column.map((image, index) => (
                <PinCard
                  key={image.id}
                  image={image}
                  isHovered={hoveredId === image.id}
                  onHover={() => setHoveredId(image.id)}
                  onLeave={() => setHoveredId(null)}
                  index={index}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      {onLoadMore && images.length > 0 && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}
    </div>
  );
}

function PinCard({ 
  image, 
  isHovered, 
  onHover, 
  onLeave,
  index 
}: { 
  image: PinImage; 
  isHovered: boolean; 
  onHover: () => void; 
  onLeave: () => void;
  index: number;
}) {
  const [saved, setSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [likes, setLikes] = useState(image.like);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    setSaved(!saved);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    const url = `${window.location.origin}/pin/${image.id}`;
    navigator.clipboard.writeText(url);
    // Optional: Show toast notification
    alert("Link copied to clipboard!");
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    try {
      const response = await fetch(image.imagePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pin-${image.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <Link 
      href={`/pin/${image.id}`}
      className="block"
    >
      <div
        className="group relative rounded-2xl overflow-hidden cursor-pointer break-inside-avoid bg-white shadow-md hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        style={{
          animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`,
        }}
      >
        {/* Image Container */}
        <div className="relative bg-slate-100">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
          )}

          {/* Main Image */}
          <Image
            src={getImageUrl(image.imagePath)}
            alt={image.prompt || "Pin"}
            width={400}
            height={image.height || 500}
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Category Badge (Always Visible) */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 shadow-lg border border-white/20 uppercase tracking-wide">
              {image.category}
            </span>
          </div>

          {/* Gradient Overlay (Hover) */}
          <div 
            className={`absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Save Button (Top Right) */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-xl transition-all duration-300 transform hover:scale-110 ${
                saved
                  ? "bg-slate-900 text-white"
                  : "bg-rose-500 text-white hover:bg-rose-600"
              }`}
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          {/* Quick Action Buttons (Left Side - Appear on Hover) */}
          <div 
            className={`absolute top-16 left-3 flex flex-col gap-2 transition-all duration-300 z-10 ${
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
          >
            <button
              onClick={handleDownload}
              className="p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 group/btn"
              title="Download"
            >
              <Download size={18} className="text-slate-700 group-hover/btn:text-rose-500" />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 group/btn"
              title="Share"
            >
              <Share2 size={18} className="text-slate-700 group-hover/btn:text-rose-500" />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 group/btn"
              title="More"
            >
              <MoreHorizontal size={18} className="text-slate-700 group-hover/btn:text-rose-500" />
            </button>
          </div>

          {/* Bottom Info (Visible on Hover) */}
          <div 
            className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Prompt/Title */}
            {image.prompt && (
              <h3 className="text-white font-bold text-base mb-3 line-clamp-2 drop-shadow-2xl leading-tight">
                {image.prompt}
              </h3>
            )}

            {/* User Info & Engagement */}
            <div className="flex items-center justify-between">
              {/* User */}
              {image.user ? (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/60 shadow-lg">
                    {image.user.avatar ? (
                      <Image src={image.user.avatar} alt={image.user.name} width={36} height={36} className="rounded-full" />
                    ) : (
                      image.user.name[0]?.toUpperCase()
                    )}
                  </div>
                  <span className="text-white font-semibold text-sm drop-shadow-xl">
                    {image.user.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Heart 
                    size={16} 
                    className={`${isLiked ? "fill-rose-500 text-rose-500" : "text-white"}`}
                  />
                  <span className="text-white text-sm font-medium">{likes}</span>
                </div>
              )}

              {/* Engagement Actions */}
              <div className="flex items-center gap-2">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-200 group/like"
                >
                  <Heart 
                    size={16} 
                    className={`transition-all duration-200 ${
                      isLiked 
                        ? "fill-rose-500 text-rose-500 scale-110" 
                        : "text-white group-hover/like:scale-110"
                    }`}
                  />
                </button>

                {/* Bookmark */}
                <button 
                  onClick={handleSave}
                  className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110"
                >
                  <Bookmark 
                    size={16} 
                    className={`text-white ${saved ? "fill-white" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </Link>
  );
}