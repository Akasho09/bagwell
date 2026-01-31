"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  X, 
  Heart, 
  Download, 
  Share2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Send,
  User,
  Copy,
  ExternalLink
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
    followers?: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (direction: "prev" | "next") => void;
}

interface Comment {
  id: string;
  user: { name: string; avatar?: string };
  text: string;
  createdAt: Date;
  likes: number;
}

const mockComments: Comment[] = [
  {
    id: "1",
    user: { name: "Emma Wilson" },
    text: "This is absolutely beautiful! Love the composition 😍",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
  },
  {
    id: "2",
    user: { name: "Alex Kim" },
    text: "Where can I get this? Amazing work!",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 5,
  },
];

export function ImageDetailModal({
  id,
  imagePath,
  prompt,
  category,
  like,
  createdAt,
  user,
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
  const [comments, setComments] = useState<Comment[]>(mockComments);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (onNavigate) {
        if (e.key === "ArrowLeft") onNavigate("prev");
        if (e.key === "ArrowRight") onNavigate("next");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen) return null;

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imagePath);
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

  const handleShare = (platform: "twitter" | "facebook" | "copy") => {
    const url = `${window.location.origin}/pin/${id}`;
    const text = prompt || "Check out this pin!";

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      copy: url,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setShowShareMenu(false);
    } else {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
      setShowShareMenu(false);
    }
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    
    setComments([
      {
        id: Date.now().toString(),
        user: { name: "You" },
        text: commentText,
        createdAt: new Date(),
        likes: 0,
      },
      ...comments,
    ]);
    setCommentText("");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 group"
      >
        <X size={24} className="text-white group-hover:rotate-90 transition-transform" />
      </button>

      {/* Navigation */}
      {onNavigate && (
        <>
          <button
            onClick={() => onNavigate("prev")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button
            onClick={() => onNavigate("next")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </>
      )}

      {/* Main Container */}
      <div className="flex w-full h-full max-w-7xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Image Section */}
        <div className="flex-1 flex items-center justify-center bg-slate-900 relative">
          <Image
            src={getImageUrl(imagePath)}
            alt={prompt || "Pin image"}
            width={1200}
            height={1600}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            priority
          />

          {/* Image Actions */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <button
              onClick={handleDownload}
              className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all hover:scale-110"
              title="Download"
            >
              <Download size={20} className="text-white" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all hover:scale-110"
                title="Share"
              >
                <Share2 size={20} className="text-white" />
              </button>
              
              {showShareMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl p-2 min-w-[160px]">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                  >
                    <ExternalLink size={14} />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare("facebook")}
                    className="w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                  >
                    <ExternalLink size={14} />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                  >
                    <Copy size={14} />
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-[480px] flex flex-col bg-white">
          
          {/* Header Actions */}
          <div className="p-6 border-b border-slate-200 flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all ${
                liked ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Heart size={18} className={liked ? "fill-white" : ""} />
              {likeCount}
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                saved ? "bg-slate-900 text-white" : "bg-rose-500 text-white hover:bg-rose-600"
              }`}
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            
            {/* User Info */}
            {user && (
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
                    {user.avatar ? (
                      <Image src={user.avatar} alt={user.name} width={48} height={48} className="rounded-full" />
                    ) : (
                      user.name[0]?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{user.name}</h3>
                    {user.followers !== undefined && (
                      <p className="text-xs text-slate-400 mt-1">
                        {user.followers.toLocaleString()} followers
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setFollowing(!following)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    following ? "bg-slate-100 text-slate-700" : "bg-rose-500 text-white hover:bg-rose-600"
                  }`}
                >
                  {following ? "Following" : "Follow"}
                </button>
              </div>
            )}

            {/* Pin Details */}
            <div className="p-6 border-b border-slate-200">
              {prompt && (
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{prompt}</h2>
              )}
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="px-3 py-1 bg-slate-100 rounded-full font-semibold text-slate-700">
                  {category}
                </span>
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>

            {/* Comments */}
            <div className="p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MessageCircle size={20} />
                Comments ({comments.length})
              </h3>

              {/* Comment Input */}
              <div className="mb-6 flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                  <User size={18} />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-rose-500 focus:bg-white outline-none transition-all text-sm"
                  />
                  <button
                    onClick={handlePostComment}
                    disabled={!commentText.trim()}
                    className="mt-2 px-4 py-2 bg-rose-500 text-white rounded-full font-semibold text-sm hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
                  >
                    <Send size={14} />
                    Post
                  </button>
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
                        <span>{formatTime(comment.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}