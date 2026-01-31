"use client";

import { useState, useRef } from "react";
import { X, Upload as UploadIcon, Loader2, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { uploadImage } from "../../lib/upload";
import { createImage } from "../../lib/saveInDb";

const categories = [
  { value: "nature", label: "Nature" },
  { value: "interior", label: "Interior Design" },
  { value: "fashion", label: "Fashion" },
  { value: "food", label: "Food & Drink" },
  { value: "travel", label: "Travel" },
  { value: "art", label: "Art" },
  { value: "photography", label: "Photography" },
  { value: "architecture", label: "Architecture" },
  { value: "technology", label: "Technology" },
  { value: "fitness", label: "Fitness" },
  { value: "beauty", label: "Beauty" },
  { value: "diy", label: "DIY & Crafts" },
  { value: "quotes", label: "Quotes" },
];

export default function Upload() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      alert("Please upload an image");
      return;
    }
    if (!prompt.trim()) {
      alert("Please add a description");
      return;
    }
    if (!category) {
      alert("Please select a category");
      return;
    }

    setIsUploading(true);
    try {
      const imagePath = await uploadImage(imageFile, category);
      await createImage({
        category,
        prompt,
        imagePath,
      });

      setUploadSuccess(true);
      
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to create pin. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Create New Pin</h1>
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Left: Image Upload */}
            <div className="space-y-4">
              <div 
                className="aspect-[3/4] bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      disabled={isUploading}
                      className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white shadow-lg transition-all hover:scale-110 disabled:opacity-50"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-6 sm:p-8">
                    <UploadIcon className="mx-auto mb-4 text-slate-400" size={48} />
                    <p className="text-slate-600 font-medium mb-2">
                      Upload an image
                    </p>
                    <p className="text-sm text-slate-400 mb-4">
                      Drag & drop or click to browse
                    </p>
                    <p className="text-xs text-slate-400 mb-4">
                      JPG, PNG or WEBP (Max 10MB)
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-colors"
                    >
                      Choose File
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {imageFile && (
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{imageFile.name}</p>
                      <p className="text-xs text-green-600">
                        {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              
              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your pin..."
                  rows={5}
                  disabled={isUploading}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-rose-500 focus:bg-white outline-none transition-all resize-none text-sm disabled:opacity-50"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {prompt.length} characters
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isUploading}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-rose-500 focus:bg-white outline-none transition-all text-sm disabled:opacity-50"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tips */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-sm text-blue-900 mb-2">
                  💡 Tips for better pins
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Use clear, high-quality images</li>
                  <li>• Write descriptive, engaging descriptions</li>
                  <li>• Choose the most relevant category</li>
                  <li>• Be creative and unique!</li>
                </ul>
              </div>

              {uploadSuccess && (
                <div className="p-4 bg-green-50 rounded-xl border border-green-200 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check size={20} />
                    <p className="font-semibold text-sm">Pin created successfully!</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isUploading || !imageFile || !prompt.trim() || !category || uploadSuccess}
                className="w-full px-6 py-4 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg shadow-rose-500/30"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Creating Pin...
                  </>
                ) : uploadSuccess ? (
                  <>
                    <Check size={24} />
                    Created!
                  </>
                ) : (
                  "Create Pin"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}