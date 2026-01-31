import { PinDetailClient } from "./PinDetailClient";
import { notFound } from "next/navigation";
import { getImageById, getRelatedImages } from "../../../lib/getImages";

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

  const relatedImages = await getRelatedImages(image.category, image.id, 10);

  return (
    <PinDetailClient
      image={image}
      relatedImages={relatedImages}
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
    description: `${image.category} • View and explore similar pins`,
    openGraph: {
      title: image.prompt || "Pin Detail",
      description: `${image.category} • View and explore similar pins`,
      images: [
        {
          url: image.imagePath,
          width: 1200,
          height: 630,
          alt: image.prompt || "Pin image",
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: image.prompt || "Pin Detail",
      description: `${image.category} • View and explore similar pins`,
      images: [image.imagePath],
    },
  };
}