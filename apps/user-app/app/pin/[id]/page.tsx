// app/pin/[id]/page.tsx
import { PinDetailClient } from "./PinDetailClient";
import { notFound } from "next/navigation";
import { getImageById , getRelatedImages , getImages } from "../../../lib/getImages";
import { getImageUrl } from "../../../lib/urls";

export default async function PinDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const image = await getImageById(id);
  
  if (!image) {
    notFound();
  }

  const relatedImages = await getRelatedImages(image.category, image.id, 6);
  const allImages = await getImages();

  return (
    <PinDetailClient
      image={{
        ...image,
        imagePath: image.imagePath,
      }}
      relatedImages={relatedImages.map(img => ({
        id: img.id,
        imagePath: img.imagePath,
        prompt: img.prompt,
      }))}
      allImages={allImages.map(img => ({ id: img.id }))}
    />
  );
}

// SEO metadata
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const image = await getImageById(id);
  
  if (!image) {
    return {
      title: "Pin not found",
    };
  }

  return {
    title: image.prompt || "Pin Detail",
    description: `View this ${image.category} pin`,
    openGraph: {
      title: image.prompt || "Pin Detail",
      description: `View this ${image.category} pin`,
      images: [image.imagePath],
    },
    twitter: {
      card: "summary_large_image",
      title: image.prompt || "Pin Detail",
      description: `View this ${image.category} pin`,
      images: [image.imagePath],
    },
  };
}