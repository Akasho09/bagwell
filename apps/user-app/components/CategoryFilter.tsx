"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { label: "All", value: undefined },
  { label: "Nature", value: "nature" },
  { label: "Tech", value: "tech" },
  { label: "People", value: "people" }
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category");

  function setCategory(category?: string) {
    router.push(
      category ? `/photos?category=${encodeURIComponent(category)}` : "/photos"
    );
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {CATEGORIES.map(({ label, value }) => {
        const isActive =
          (value === undefined && !active) || active === value;

        return (
          <button
            key={label}
            type="button" // ✅ THIS IS THE FIX
            onClick={() => setCategory(value)}
            className={`rounded-full px-4 py-1 text-sm font-medium transition
              ${
                isActive
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
