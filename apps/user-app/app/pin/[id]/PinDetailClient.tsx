"use client";

import { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Copy, Check } from "lucide-react";
import { getImageUrl } from "../../../lib/urls";

interface PinDetailClientProps {
  image: {
    id: string;
    imagePath: string;
    prompt: string | null;
    category: string;
    like: number;
    createdAt: Date;
  };
  relatedImages: Array<{
    id: string;
    imagePath: string;
    prompt: string | null;
  }>;
}

export const PinDetailClient = memo(function PinDetailClient({
  image,
  relatedImages,
}: PinDetailClientProps) {
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  /* ---------------- COPY PROMPT ---------------- */

  const handleCopyPrompt = useCallback(async () => {
    if (!image.prompt) return;

    try {
      await navigator.clipboard.writeText(image.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      alert("Copy failed");
    }
  }, [image.prompt]);

  return (
    <div className="min-h-screen ">

      {/* HEADER */}
      <div className="sticky top-0 z-10  backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="p-2 rounded-full hover:bg-neutral-200"
          >
            <X size={20} />
          </button>

          <span className="text-sm text-neutral-500">
            {new Date(image.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* MAIN CARD */}
        <div className=" rounded-3xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">

            {/* IMAGE */}
            <div>
              <Image
                src={getImageUrl(image.imagePath)}
                alt={image.prompt || "Pin image"}
                width={900}
                height={1200}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-2xl w-full h-auto object-cover"
              />
            </div>

            {/* DETAILS */}
            <div className="flex flex-col gap-6">

              <span className="w-fit px-4 py-2 rounded-full text-sm capitalize">
                {image.category}
              </span>

              {image.prompt && (
                <div className="space-y-3">

                  <p
                    className={`leading-relaxed text-neutral-800 ${
                      !expanded && "line-clamp-4"
                    }`}
                  >
                    {image.prompt}
                  </p>

                  <div className="flex gap-4">

                    <button
                      onClick={() => setExpanded((p) => !p)}
                      className="text-sm text-neutral-500 hover:text-neutral-800"
                    >
                      {expanded ? "Show less" : "Show more"}
                    </button>

                    <button
                      onClick={handleCopyPrompt}
                      className="flex items-center gap-2 text-sm"
                    >
                      {copied ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <Copy size={16} />
                      )}
                      {copied ? "Copied" : "Copy prompt"}
                    </button>

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* RELATED IMAGES */}
        {relatedImages.length > 0 && (
          <RelatedGrid images={relatedImages} />
        )}
      </div>
    </div>
  );
});

/* ---------------- RELATED GRID (MEMOIZED) ---------------- */

const RelatedGrid = memo(function RelatedGrid({
  images,
}: {
  images: PinDetailClientProps["relatedImages"];
}) {
  const router = useRouter();

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold mb-6">More like this</h3>

      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => router.push(`/pin/${img.id}`)}
            className="block break-inside-avoid rounded-xl overflow-hidden hover:opacity-90"
          >
            <Image
              src={getImageUrl(img.imagePath)}
              alt={img.prompt || "Related pin"}
              width={400}
              height={600}
              loading="lazy"
              sizes="(max-width:768px) 50vw, 25vw"
              className="w-full h-auto object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
});
