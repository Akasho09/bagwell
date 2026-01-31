"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, User, Home, Bell, Plus } from "lucide-react";

export function TopBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-all group-hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 010 2H6v2a1 1 0 01-2 0V5zM20 5a1 1 0 00-1-1h-4a1 1 0 100 2h2v2a1 1 0 102 0V5zM4 19a1 1 0 001 1h4a1 1 0 100-2H6v-2a1 1 0 10-2 0v3zM20 19a1 1 0 01-1 1h-4a1 1 0 110-2h2v-2a1 1 0 112 0v3z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              freeimageprompts
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-2xl mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for ideas..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-full text-sm focus:border-rose-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors font-medium text-slate-700"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            {/* <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-all hover:scale-105 font-semibold shadow-lg shadow-rose-500/30"
            >
              <Plus size={20} />
              <span>Create</span>
            </Link> */}
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors relative">
              <Bell size={22} className="text-slate-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <button className="ml-2 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold hover:scale-110 transition-transform shadow-md">
              <User size={20} />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Search */}
        <form 
          onSubmit={handleSearch}
          className="md:hidden pb-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for ideas..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-2 border-transparent rounded-full text-sm focus:border-rose-500 focus:bg-white outline-none transition-all"
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="px-4 py-4 space-y-2">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link
              href="/upload"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors font-semibold"
            >
              <Plus size={20} />
              <span>Create Pin</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700">
              <Bell size={20} />
              <span>Notifications</span>
              <span className="ml-auto w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700">
              <User size={20} />
              <span>Profile</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}