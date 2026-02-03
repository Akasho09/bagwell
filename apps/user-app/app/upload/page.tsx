"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, Upload as UploadIcon, Loader2, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { uploadImage } from "../../lib/upload";
import { createImage } from "../../lib/saveInDb";

/* ---------------- ENUM SAFE OPTIONS ---------------- */

const categories = [
  { value: "NATURE", label: "Nature" },
  { value: "TECH", label: "Technology" },
  { value: "AESTHETIC", label: "Aesthetic" },
  { value: "SPORTS", label: "Sports" },
];

const genders = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Unisex", label: "Unisex" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function Upload() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Unisex">("Male");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [status, setStatus] = useState<
    "idle" | "uploading" | "success"
  >("idle");

  /* ---------------- CLEAN PREVIEW ---------------- */

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /* ---------------- FILE VALIDATION ---------------- */

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File must be under 10MB");
      return false;
    }

    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleSubmit = async () => {
    if (!imageFile || !prompt.trim() || !category || !gender) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setStatus("uploading");

      const imagePath = await uploadImage(imageFile, category);

      await createImage({
        category,
        prompt,
        imagePath,
        gender, // ⭐ Added gender
      });

      setStatus("success");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1200);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
      setStatus("idle");
    }
  };

  /* ---------------- RESET ---------------- */

  const resetImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen py-10 px-4 ">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Create Pin</h1>
          <Link href="/" className="p-2 hover:bg-white rounded-full">
            <X />
          </Link>
        </div>

        <div className=" rounded-2xl shadow-xl p-8 grid md:grid-cols-2 gap-8">

          {/* LEFT IMAGE */}
          <div
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="relative aspect-[3/4] border-2 border-dashed rounded-xl flex items-center justify-center"
          >
            {previewUrl ? (
              <>
                <Image
                  src={previewUrl}
                  alt="preview"
                  fill
                  className="object-cover"
                />

                <button
                  onClick={resetImage}
                  disabled={status === "uploading"}
                  className="absolute top-3 right-3 p-2 rounded-full shadow"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <div className="text-center">
                <UploadIcon className="mx-auto mb-3 text-gray-400" size={48} />
                <p className="font-medium">Upload Image</p>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-6 py-2 bg-black text-white rounded-full"
                >
                  Choose File
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                  hidden
                />
              </div>
            )}
          </div>

          {/* RIGHT FORM */}
          <div className="space-y-6">

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm font-semibold">Description *</label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full mt-2 p-3 bg-slate-50 rounded-xl"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-sm font-semibold">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-2 p-3 bg-slate-50 rounded-xl"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ⭐ NEW GENDER FIELD */}
            <div>
              <label className="text-sm font-semibold">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as "Male" | "Female" | "Unisex")}
                className="w-full mt-2 p-3 bg-slate-50 rounded-xl"
              >
                <option value="">Select Gender</option>
                {genders.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* SUCCESS */}
            {status === "success" && (
              <div className="bg-green-50 border p-3 rounded-xl flex gap-2 items-center">
                <Check />
                Pin Created!
              </div>
            )}

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              disabled={
                status === "uploading" ||
                !imageFile ||
                !prompt ||
                !category ||
                !gender
              }
              className="w-full py-4 bg-rose-500 text-white rounded-xl font-semibold flex justify-center gap-2 disabled:opacity-50"
            >
              {status === "uploading" ? (
                <>
                  <Loader2 className="animate-spin" />
                  Uploading...
                </>
              ) : status === "success" ? (
                <>
                  <Check />
                  Created
                </>
              ) : (
                "Create Pin"
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
