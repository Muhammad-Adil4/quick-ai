"use client";

import React, { useState, ChangeEvent } from "react";
import {
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Scissors,
  Eraser,
} from "lucide-react";
import Image from "next/image";

const RemoveObject: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removedObject, setRemovedObject] = useState<string | null>(null);
  const [objectDescription, setObjectDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
      setRemovedObject(null);
    }
  };

  const handleRemoveObject = async () => {
    if (!imageFile) {
      setError("⚠ Please upload an image first.");
      return;
    }
    if (!objectDescription.trim()) {
      setError("⚠ Please describe the object to remove.");
      return;
    }

    setLoading(true);
    setError("");
    setRemovedObject(null);

    try {
      // Mock object removal: Replace with real API if needed
      await new Promise((res) => setTimeout(res, 1500));
      setRemovedObject(image); // For demo, just return original image
    } catch {
      setError("❌ Failed to remove object. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImageFile(null);
    setRemovedObject(null);
    setObjectDescription("");
    setError("");
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700">
      {/* Left Panel */}
      <div className="flex flex-col bg-white rounded-2xl border border-gray-200 p-6 shadow-lg h-full">
        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <Eraser className="w-7 h-7 text-red-500" />
          <h1 className="text-xl font-bold">Remove Object</h1>
        </div>

        {/* File Upload */}
        {!image && (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition mb-4">
            <div className="flex flex-col items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400">PNG, JPG, JPEG</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}

        {/* Image Preview */}
        {image && (
          <div className="mb-4 relative w-full h-60">
            <Image
              src={image}
              alt="Uploaded"
              fill
              className="object-contain rounded-lg border shadow-sm"
            />
          </div>
        )}

        {/* Object Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Describe object to remove
          </label>
          <textarea
            rows={2}
            value={objectDescription}
            onChange={(e) => setObjectDescription(e.target.value)}
            placeholder="e.g., Remove the person in the background"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400"
          ></textarea>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        {/* Buttons */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleRemoveObject}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 text-sm rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
            {loading ? "Processing..." : "Remove Object"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col bg-white rounded-2xl border border-gray-200 p-6 shadow-lg h-full">
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="w-6 h-6 text-green-500" />
          <h2 className="text-lg font-semibold">Processed Result</h2>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : removedObject ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-full h-[400px] mb-4">
              <Image
                src={removedObject}
                alt="Result"
                fill
                className="object-contain rounded-lg shadow-md"
              />
            </div>
            <a
              href={removedObject}
              download="object-removed.png"
              className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              Download Image
            </a>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Eraser className="w-12 h-12 mb-3 opacity-60" />
            <p className="text-sm text-center">
              Upload an image, describe the object, then click <b>Remove Object</b> to see the result here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
