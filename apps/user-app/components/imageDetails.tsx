"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { 
  X, 
  Heart, 
  Share2, 
  Download, 
  Bookmark,
  MoreHorizontal,
  Send,
  ExternalLink,
  Copy,
  Flag,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  User
} from "lucide-react";
import { getImageUrl } from "../lib/urls";

interface ImageDetailProps {
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
    bio?: string;
    followers?: number;
  };
  relatedImages?: Array<{
    id: string;
    imagePath: string;
    prompt: string | null;
  }>;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (direction: "prev" | "next") => void;
}

interface Comment {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  text: string;
  createdAt: Date;
  likes: number;
}

export function ImageDetailModal({
  id,
  imagePath,
  prompt,
  category,
  like,
  createdAt,
  user,
  relatedImages = [],
  isOpen,
  onClose,
  onNavigate,
}: ImageDetailProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(like);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: { name: "Emma Wilson", avatar: "" },
      text: "This is absolutely beautiful! Love the composition 😍",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12,
    },
    {
      id: "2",
      user: { name: "Alex Kim", avatar: "" },
      text: "Where can I get this? Amazing work!",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 5,
    },
  ]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Arrow key navigation
  useEffect(() => {
    if (!onNavigate) return;
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onNavigate("prev");
      if (e.key === "ArrowRight") onNavigate("next");
    };
    if (isOpen) {
      document.addEventListener("keydown", handleArrowKeys);
    }
    return () => document.removeEventListener("keydown", handleArrowKeys);
  }, [isOpen, onNavigate]);

  if (!isOpen) return null;

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pin-${id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.origin + `/pin/${id}`;
    const text = prompt || "Check out this pin!";

    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
      copy: url,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setShowShareMenu(false);
    } else {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      user: { name: "You" },
      text: commentText,
      createdAt: new Date(),
      likes: 0,
    };
    
    setComments([newComment, ...comments]);
    setCommentText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-110 group"
      >
        <X size={24} className="text-white group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Navigation Arrows */}
      {onNavigate && (
        <>
          <button
            onClick={() => onNavigate("prev")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button
            onClick={() => onNavigate("next")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-110"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </>
      )}

      {/* Main Content Container */}
      <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center p-4">
        <div className="flex w-full h-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
          
          {/* LEFT: Image Section */}
          <div className="flex-1 flex items-center justify-center bg-slate-900 relative overflow-hidden">
            <Image
              src={getImageUrl(imagePath)}
              alt={prompt || "Pin image"}
              width={1200}
              height={1600}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              priority
            />

            {/* Image Overlay Actions */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-110"
                  title="Download"
                >
                  <Download size={20} className="text-white" />
                </button>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-110 relative"
                  title="Share"
                >
                  <Share2 size={20} className="text-white" />
                  
                  {/* Share Dropdown */}
                  {showShareMenu && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 min-w-[160px]">
                      <button
                        onClick={() => handleShare("twitter")}
                        className="w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <ExternalLink size={14} />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare("facebook")}
                        className="w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <ExternalLink size={14} />
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Copy size={14} />
                        Copy Link
                      </button>
                    </div>
                  )}
                </button>
              </div>

              <button className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-110">
                <MoreHorizontal size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* RIGHT: Details Section */}
          <div className="w-[480px] flex flex-col bg-white overflow-hidden">
            
            {/* Header Actions */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                    liked
                      ? "bg-rose-500 text-white hover:bg-rose-600"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Heart
                    size={18}
                    className={liked ? "fill-white" : ""}
                  />
                  {likeCount}
                </button>
                <button
                  onClick={() => setSaved(!saved)}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                    saved
                      ? "bg-slate-900 text-white"
                      : "bg-rose-500 text-white hover:bg-rose-600"
                  }`}
                >
                  {saved ? "Saved" : "Save"}
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              
              {/* User Info */}
              {user && (
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg ring-2 ring-purple-500/20 shadow-lg">
                        {user.avatar ? (
                          <Image src={user.avatar} alt={user.name} width={48} height={48} className="rounded-full" />
                        ) : (
                          user.name[0]?.toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
                        {user.bio && (
                          <p className="text-sm text-slate-500 mt-1">{user.bio}</p>
                        )}
                        {user.followers !== undefined && (
                          <p className="text-xs text-slate-400 mt-1">
                            {user.followers.toLocaleString()} followers
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setFollowing(!following)}
                      className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                        following
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-rose-500 text-white hover:bg-rose-600"
                      }`}
                    >
                      {following ? "Following" : "Follow"}
                    </button>
                  </div>
                </div>
              )}

              {/* Pin Details */}
              <div className="p-6 border-b border-slate-200">
                {prompt && (
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                    {prompt}
                  </h2>
                )}
                
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="px-3 py-1 bg-slate-100 rounded-full font-semibold text-slate-700">
                    {category}
                  </span>
                  <span>
                    {new Date(createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <MessageCircle size={20} />
                  Comments ({comments.length})
                </h3>

                {/* Comment Input */}
                <div className="mb-6">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                      <User size={18} />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handlePostComment()}
                        placeholder="Add a comment..."
                        className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-rose-500 focus:bg-white outline-none transition-all duration-200 text-sm"
                      />
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <button
                          onClick={handlePostComment}
                          disabled={!commentText.trim()}
                          className="px-4 py-2 bg-rose-500 text-white rounded-full font-semibold text-sm hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Send size={14} />
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {comment.user.avatar ? (
                          <Image src={comment.user.avatar} alt={comment.user.name} width={36} height={36} className="rounded-full" />
                        ) : (
                          comment.user.name[0]?.toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-2xl px-4 py-3">
                          <p className="font-semibold text-sm text-slate-900">{comment.user.name}</p>
                          <p className="text-sm text-slate-700 mt-1">{comment.text}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <button className="hover:text-rose-500 font-medium transition-colors">
                            Like ({comment.likes})
                          </button>
                          <span>
                            {new Date(comment.createdAt).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Images */}
              {relatedImages.length > 0 && (
                <div className="p-6 border-t border-slate-200">
                  <h3 className="font-bold text-slate-900 text-lg mb-4">
                    More like this
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {relatedImages.slice(0, 6).map((img) => (
                      <button
                        key={img.id}
                        className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                      >
                        <Image
                          src={getImageUrl(img.imagePath)}
                          alt={img.prompt || "Related"}
                          width={150}
                          height={150}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}