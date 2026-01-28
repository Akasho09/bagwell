"use client";

import Image from "next/image";
import { useState } from "react";
import { 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Download, 
  Bookmark,
  ExternalLink,
  Copy,
  Flag,
  Eye
} from "lucide-react";

interface ImageCardProps {
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
  onImageClick?: (id: string) => void;
  onSave?: (id: string) => void;
  onLike?: (id: string, liked: boolean) => void;
}

export function ImageCard({
  id,
  imagePath,
  prompt,
  category,
  like,
  createdAt,
  user,
  onImageClick,
  onSave,
  onLike,
}: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(like);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    onSave?.(id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);
    onLike?.(id, newLikedState);
  };

  const handleCardClick = () => {
    onImageClick?.(id);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pin-${id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = (platform: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.location.origin + `/pin/${id}`;
    const text = prompt || 'Check out this pin!';

    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
      copy: url,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setShowShareMenu(false);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div
      className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
        setShowShareMenu(false);
      }}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-slate-100">
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
        )}

        {/* Main Image */}
        <Image
          src={imagePath}
          alt={prompt || "Pin image"}
          width={600}
          height={800}
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
          onLoad={() => setImageLoaded(true)}
          priority={false}
        />

        {/* Gradient Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Category Badge (Always Visible) */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 shadow-lg border border-white/20 uppercase tracking-wide">
            {category}
          </span>
        </div>

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
            onClick={(e) => {
              e.stopPropagation();
              setShowShareMenu(!showShareMenu);
            }}
            className="p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 group/btn relative"
            title="Share"
          >
            <Share2 size={18} className="text-slate-700 group-hover/btn:text-rose-500" />
            
            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute left-full ml-2 top-0 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 min-w-[160px] z-20">
                <button
                  onClick={handleShare('twitter')}
                  className="w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={14} />
                  Twitter
                </button>
                <button
                  onClick={handleShare('facebook')}
                  className="w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={14} />
                  Facebook
                </button>
                <button
                  onClick={handleShare('copy')}
                  className="w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Copy size={14} />
                  Copy Link
                </button>
              </div>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 group/btn relative"
            title="More"
          >
            <MoreHorizontal size={18} className="text-slate-700 group-hover/btn:text-rose-500" />
            
            {/* More Menu */}
            {showMenu && (
              <div className="absolute left-full ml-2 top-0 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 min-w-[160px] z-20">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Eye size={14} />
                  Hide Pin
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Flag size={14} />
                  Report
                </button>
              </div>
            )}
          </button>
        </div>

        {/* Bottom Info (Visible on Hover) */}
        <div 
          className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Prompt/Title */}
          {prompt && (
            <h3 className="text-white font-bold text-base mb-3 line-clamp-2 drop-shadow-2xl leading-tight">
              {prompt}
            </h3>
          )}

          {/* User Info & Engagement */}
          <div className="flex items-center justify-between">
            {/* User */}
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/60 shadow-lg">
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} width={36} height={36} className="rounded-full" />
                  ) : (
                    user.name[0]?.toUpperCase()
                  )}
                </div>
                <span className="text-white font-semibold text-sm drop-shadow-xl">
                  {user.name}
                </span>
              </div>
            )}

            {/* Engagement Actions */}
            <div className="flex items-center gap-3">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-200 group/like"
              >
                <Heart 
                  size={16} 
                  className={`transition-all duration-200 ${
                    liked 
                      ? "fill-rose-500 text-rose-500 scale-110" 
                      : "text-white group-hover/like:scale-110"
                  }`}
                />
                <span className="text-white text-xs font-bold">{likeCount}</span>
              </button>

              {/* Bookmark */}
              <button className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110">
                <Bookmark 
                  size={16} 
                  className={`text-white ${saved ? "fill-white" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card Footer (Always Visible - Optional) */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {Math.floor(Math.random() * 1000)}
          </span>
        </div>
      </div>
    </div>
  );
}