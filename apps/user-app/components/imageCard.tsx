"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Download, Share2, ExternalLink } from "lucide-react";
import { getImageUrl } from "../lib/urls";

interface ImageCardProps {
  id: string;
  imagePath: string;
  prompt: string | null;
  category: string;
  like: number;
  onClick: () => void;
}

export function ImageCard({
  id,
  imagePath,
  prompt,
  category,
  like,
  onClick,
}: ImageCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(like);
  const [showActions, setShowActions] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(getImageUrl(imagePath));
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pin-${id}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: prompt || "Check out this pin!",
        url: `${window.location.origin}/pin/${id}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/pin/${id}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div
      className="group relative cursor-pointer break-inside-avoid mb-4"
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-md hover:shadow-2xl transition-all duration-300">
        {/* Image */}
        <div className="relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
          )}
          <Image
            src={getImageUrl(imagePath)}
            alt={prompt || "Pin image"}
            width={500}
            height={600}
            className={`w-full h-auto object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Overlay on Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
              showActions ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Action Buttons */}
          <div
            className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
              showActions ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            <button
              onClick={handleLike}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-lg ${
                liked
                  ? "bg-rose-500 text-white"
                  : "bg-white/90 text-slate-700 hover:bg-white"
              }`}
              title="Like"
            >
              <Heart
                size={18}
                className={liked ? "fill-white" : ""}
              />
            </button>
            <button
              onClick={handleDownload}
              className="p-2.5 bg-white/90 hover:bg-white rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-lg"
              title="Download"
            >
              <Download size={18} className="text-slate-700" />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 bg-white/90 hover:bg-white rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-lg"
              title="Share"
            >
              <Share2 size={18} className="text-slate-700" />
            </button>
          </div>

          {/* Bottom Info on Hover */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
              showActions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {prompt && (
              <p className="text-white font-semibold text-sm line-clamp-2 mb-2 drop-shadow-lg">
                {prompt}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-slate-700">
                {category}
              </span>
              {likeCount > 0 && (
                <div className="flex items-center gap-1 text-white text-sm font-medium">
                  <Heart size={14} className="fill-white" />
                  <span>{likeCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick View Indicator */}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
            showActions ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
            <ExternalLink className="text-white" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}