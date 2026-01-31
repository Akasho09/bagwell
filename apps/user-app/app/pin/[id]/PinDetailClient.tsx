"use client";

import { useState, useCallback } from "react";
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

export function PinDetailClient({ image, relatedImages }: PinDetailClientProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopyPrompt = useCallback(() => {
    if (!image.prompt) return;
    navigator.clipboard.writeText(image.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [image.prompt]);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-neutral-100/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-neutral-200 transition"
          >
            <X size={20} />
          </button>
          <span className="text-sm text-neutral-500">
            {new Date(image.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Image */}
            <div>
              <Image
                src={getImageUrl(image.imagePath)}
                alt={image.prompt || "Pin image"}
                width={900}
                height={1200}
                className="rounded-2xl w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-6">
              {/* Category */}
              <span className="w-fit px-4 py-2 bg-neutral-100 rounded-full text-sm capitalize">
                {image.category}
              </span>

              {/* Prompt */}
              {image.prompt && (
                <div className="space-y-3">
                  <p
                    className={`text-neutral-800 leading-relaxed ${
                      !expanded && "line-clamp-4"
                    }`}
                  >
                    {image.prompt}
                  </p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="text-sm text-neutral-500 hover:text-neutral-800"
                    >
                      {expanded ? "Show less" : "Show more"}
                    </button>

                    <button
                      onClick={handleCopyPrompt}
                      className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
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

        {/* Related Images */}
        {relatedImages.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-6 text-neutral-800">
              More like this
            </h3>

            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {relatedImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => router.push(`/pin/${img.id}`)}
                  className="block w-full break-inside-avoid rounded-xl overflow-hidden hover:opacity-90 transition"
                >
                  <Image
                    src={getImageUrl(img.imagePath)}
                    alt={img.prompt || "Related pin"}
                    width={400}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
