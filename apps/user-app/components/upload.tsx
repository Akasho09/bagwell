"use client";

import { useState } from "react";
import { uploadImage } from "../lib/upload";
import { createImage } from "../lib/saveInDb";

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("nature");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return alert("Select an image");

    try {
      setLoading(true);

      const imagePath = await uploadImage(file, category);

      await createImage({
        category,
        description,
        imagePath,
      });

      alert("Image uploaded successfully!");
      setFile(null);
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 rounded-xl bg-white p-6 shadow-lg border">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Upload Image
      </h2>

      {/* Category */}
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Category
      </label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-4 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="nature">Nature</option>
        <option value="tech">Tech</option>
        <option value="people">People</option>
      </select>

      {/* Description */}
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Description
      </label>
      <textarea
        placeholder="Image description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="w-full mb-4 rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* File Input */}
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Image File
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full mb-4 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-green-100 file:px-4 file:py-2 file:text-green-700 hover:file:bg-green-200"
      />

      {/* Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full rounded-md bg-green-600 py-2 text-white font-medium hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
