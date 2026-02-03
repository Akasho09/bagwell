"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MasonryGrid } from "./Maso";

/* ---------------- TYPES ---------------- */

interface InfiniteFeedProps {
  initialImages: any[];
  initialCursor?: string;
  filters: {
    gender?: string;
    category?: string;
    search?: string;
  };
}

/* ---------------- REMOVE DUPLICATES ---------------- */

function mergeUnique(prev: any[], next: any[]) {
  const ids = new Set(prev.map((img) => img.id));
  return [...prev, ...next.filter((img) => !ids.has(img.id))];
}

/* ---------------- CREATE SKELETONS ---------------- */

function createSkeletons(count = 6) {
  return Array.from({ length: count }).map(() => ({
    id: `skeleton-${crypto.randomUUID()}`,
    skeleton: true,
  }));
}

export function InfiniteFeed({
  initialImages,
  initialCursor,
  filters,
}: InfiniteFeedProps) {

  const [images, setImages] = useState(initialImages);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- RESET WHEN FILTERS CHANGE ---------------- */

  useEffect(() => {
    setImages(initialImages);
    setCursor(initialCursor);
  }, [initialImages, initialCursor]);

  /* ---------------- DERIVE GENDER FROM THEME ---------------- */

  const deriveGender = () => {
    if (filters.gender) return filters.gender;

    if (typeof window !== "undefined") {
      const theme = localStorage.getItem("theme");

      if (theme === "theme-him") return "Male";
      if (theme === "theme-her") return "Female";
    }

    return undefined;
  };

  /* ---------------- FETCH NEXT PAGE ---------------- */

  const loadMore = useCallback(async () => {

    if (!cursor || loading) return;

    setLoading(true);

    const derivedGender = deriveGender();

    const params = new URLSearchParams({
      ...filters,
      ...(derivedGender && { gender: derivedGender }),
      cursor,
    });

    /* ⭐ Optimistic skeleton */
    setImages((prev) => [...prev, ...createSkeletons()]);

    try {

      const res = await fetch(`/api/feed?${params.toString()}`);
      const data = await res.json();

      setImages((prev) =>
        mergeUnique(prev.filter((img) => !img.skeleton), data.images)
      );

      setCursor(data.nextCursor ?? undefined);

    } catch (error) {
      console.error("Feed fetch error:", error);
    }

    setLoading(false);

  }, [cursor, loading, filters]);

  /* ---------------- INTERSECTION OBSERVER ---------------- */

  useEffect(() => {

    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();

  }, [loadMore]);

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <MasonryGrid images={images} />

      {/* Optional fallback button */}
      {cursor && (
        <div className="flex justify-center py-10">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 rounded-full hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Scroll trigger */}
      {cursor && <div ref={observerRef} className="h-10" />}
    </>
  );
}
