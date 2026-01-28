import { ImageCard } from "./imageCard";

export function ImageCardShowcase() {
  const sampleImage = {
    id: "pin-123",
    imagePath: "https://picsum.photos/600/800?random=1",
    prompt: "Cozy minimalist interior design with natural light and plants",
    category: "Interior",
    like: 342,
    createdAt: new Date(),
    user: {
      name: "Sarah Chen",
      id: "user-1",
    },
  };

  const handleImageClick = (id: string) => {
    console.log("Image clicked:", id);
    // Navigate to detail page or open modal
  };

  const handleSave = (id: string) => {
    console.log("Saved:", id);
    // API call to save pin
  };

  const handleLike = (id: string, liked: boolean) => {
    console.log("Liked:", id, liked);
    // API call to like/unlike
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30 p-8">
      <div className="max-w-sm mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Image Card Component</h1>
        <ImageCard
          {...sampleImage}
          onImageClick={handleImageClick}
          onSave={handleSave}
          onLike={handleLike}
        />
      </div>
    </div>
  );
}