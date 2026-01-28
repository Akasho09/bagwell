"use client";
import { Search, Bell, MessageCircle, User, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";

export function TopBar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-16 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
      <div className="h-full max-w-[1920px] mx-auto px-4 flex items-center justify-between gap-4">
        
        {/* LEFT: Logo & Navigation */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:shadow-rose-500/40 transition-all duration-300 group-hover:scale-110">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent hidden lg:block">
              Pinspire
            </span>
          </a>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <a 
              href="/" 
              className="px-4 py-2 rounded-full font-semibold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors duration-200"
            >
              Home
            </a>
            <a 
              href="/explore" 
              className="px-4 py-2 rounded-full font-semibold text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-200"
            >
              Explore
            </a>
            <a 
              href="/create" 
              className="px-4 py-2 rounded-full font-semibold text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-200"
            >
              Create
            </a>
          </nav>
        </div>

        {/* CENTER: Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div 
            className={`relative transition-all duration-300 ${
              searchFocused ? "scale-[1.02]" : ""
            }`}
          >
            <Search 
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                searchFocused ? "text-rose-500" : "text-slate-400"
              }`} 
              size={20} 
            />
            <input
              type="text"
              placeholder="Search for inspiration, ideas, and more..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`w-full h-12 pl-12 pr-4 rounded-full font-medium text-sm transition-all duration-300 outline-none ${
                searchFocused 
                  ? "bg-white shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/30 border-rose-500/30" 
                  : "bg-slate-100/80 hover:bg-slate-100 border-slate-200/40 shadow-sm"
              } border`}
            />
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-3 backdrop-blur-xl">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">
                  Trending Searches
                </div>
                <div className="space-y-1">
                  {["Interior design ideas", "Minimalist photography", "Vintage posters", "Modern art"].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700 font-medium transition-colors duration-150"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Actions & Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2.5 rounded-full hover:bg-slate-100 transition-colors duration-200 group">
            <Bell size={22} className="text-slate-600 group-hover:text-slate-900" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Messages */}
          <button className="relative p-2.5 rounded-full hover:bg-slate-100 transition-colors duration-200 group">
            <MessageCircle size={22} className="text-slate-600 group-hover:text-slate-900" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Create Button */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full font-semibold text-sm shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 hover:scale-105">
            <Plus size={18} />
            <span>Create</span>
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 p-1 pl-3 pr-2 rounded-full hover:bg-slate-100 transition-colors duration-200 group">
            <span className="text-sm font-semibold text-slate-700 hidden lg:block">Sarah</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow-md">
              S
            </div>
            <ChevronDown size={16} className="text-slate-500 group-hover:text-slate-700" />
          </button>
        </div>
      </div>
    </header>
  );
}