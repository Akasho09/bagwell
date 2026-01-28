// app/pin/[id]/PinDetailClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { ImageDetailModal } from "../../../components/imageDetails";

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
  allImages: Array<{ id: string }>;
}

export function PinDetailClient({ 
  image, 
  relatedImages,
  allImages 
}: PinDetailClientProps) {
  const router = useRouter();

  const currentIndex = allImages.findIndex(img => img.id === image.id);

  const handleNavigate = (direction: "prev" | "next") => {
    if (direction === "prev" && currentIndex > 0) {
      router.push(`/pin/${allImages[currentIndex - 1]?.id}`);
    } else if (direction === "next" && currentIndex < allImages.length - 1) {
      router.push(`/pin/${allImages[currentIndex + 1]?.id}`);
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <ImageDetailModal
      {...image}
      user={{
        name: "Anonymous",
        id: "user-1",
        bio: "Pin creator",
        followers: 0,
      }}
      relatedImages={relatedImages}
      isOpen={true}
      onClose={handleClose}
      onNavigate={handleNavigate}
    />
  );
}