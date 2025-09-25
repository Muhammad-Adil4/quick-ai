"use client";

import React, { useState, ChangeEvent } from "react";
import {
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Scissors,
  Wand2,
  CheckCircle2,
  Download,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

const RemoveBackground: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removedBackground, setRemovedBackground] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { getToken } = useAuth();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleRemoveBg = async () => {
    if (!imageFile) {
      setError("⚠ Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setRemovedBackground(null);

    try {
      const token = await getToken();
      const formdata = new FormData();
      formdata.append("image", imageFile);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/remove-background`,
        formdata,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setRemovedBackground(data.removeBackgroundImagedata.content);
      } else {
        toast.error(data.message);
        setError(data.message);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImageFile(null);
    setRemovedBackground(null);
    setError("");
  };

  const handleDownload = async () => {
    if (!removedBackground) return;
    const response = await fetch(removedBackground);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "background-removed.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700">
      {/* Left Panel - Upload */}
      <div className="flex flex-col bg-white rounded-2xl border border-gray-200 p-6 shadow-lg h-full">
        <div className="flex items-center gap-3 mb-4">
          <Wand2 className="w-7 h-7 text-purple-500" />
          <h1 className="text-xl font-bold">Background Remover</h1>
        </div>

        {!image && (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition mb-4">
            <div className="flex flex-col items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Click to upload or drag & drop
              </p>
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

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleRemoveBg}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 text-sm rounded-lg shadow-md disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Scissors className="w-5 h-5" />
            )}
            {loading ? "Processing..." : "Remove Background"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Right Panel - Result */}
      <div className="flex flex-col bg-white rounded-2xl border border-gray-200 p-6 shadow-lg h-full">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          <h2 className="text-lg font-semibold">Processed Result</h2>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : removedBackground ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-full h-[400px] mb-4">
              <Image
                src={removedBackground}
                alt="Result"
                fill
                className="object-contain rounded-lg shadow-md"
              />
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              <Download className="w-4 h-4" /> Download Image
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="w-12 h-12 mb-3 opacity-60" />
            <p className="text-sm text-center">
              Upload an image and click <b>Remove Background</b> to see the
              result here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
