"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function TopBar() {

  const [theme, setTheme] = useState("theme-him");

  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------------- INIT THEME ---------------- */

  useEffect(() => {
    const stored = localStorage.getItem("theme") || "theme-him";

    document.body.classList.remove("theme-him", "theme-her");
    document.body.classList.add(stored);

    setTheme(stored);
  }, []);

  /* ---------------- APPLY THEME ---------------- */

  const applyTheme = (newTheme: string) => {

    /* Update body class */
    document.body.classList.remove("theme-him", "theme-her");
    document.body.classList.add(newTheme);

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    /* Map theme → gender */
    const gender =
      newTheme === "theme-him" ? "male" : "female";

    /* Preserve existing params */
    const params = new URLSearchParams(searchParams.toString());
    params.set("gender", gender);
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="fixed top-0 w-full z-40">
      <div className="backdrop-blur-lg border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <h1 className="!text-black font-semibold text-md sm:text-xl tracking-tight">
            <Link href="/">freeimageprompts</Link>
          </h1>

          {/* Theme Switch */}
          <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-full bg-gray-100 dark:bg-neutral-800">

            <button
              onClick={() => applyTheme("theme-him")}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300
              ${
                theme === "theme-him"
                  ? "bg-green-500 !text-black shadow"
                  : "text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-neutral-700"
              }`}
            >
              <Sun size={16} />
              Him
            </button>

            <button
              onClick={() => applyTheme("theme-her")}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300
              ${
                theme === "theme-her"
                  ? "bg-pink-500 text-white shadow"
                  : "text-gray-600 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-neutral-700"
              }`}
            >
              <Moon size={16} />
              Her
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
