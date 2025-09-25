"use client";

import React, { useState, FormEvent } from "react";
import { Image as ImageIcon, Sparkles, Loader2, RefreshCw } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

const Styles: { name: string; color: string }[] = [
  { name: "Realistic", color: "bg-green-100 text-green-700 border-green-300" },
  { name: "Cartoon", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { name: "Fantasy", color: "bg-purple-100 text-purple-700 border-purple-300" },
  { name: "3D Render", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { name: "Anime", color: "bg-red-100 text-red-700 border-red-300" },
  { name: "Minimalist", color: "bg-stone-100 text-stone-700 border-stone-300" },
  { name: "Abstract", color: "bg-amber-100 text-amber-700 border-amber-300" },
  {
    name: "Portrait",
    color: "bg-violet-100 text-violet-700 border-violet-300",
  },
  {
    name: "Cyberpunk",
    color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300",
  },
  {
    name: "Landscape",
    color: "bg-indigo-100 text-indigo-700 border-indigo-300",
  },
];

const GenerateImage: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<string>("Realistic");
  const [input, setInput] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { getToken } = useAuth();

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!input.trim()) {
      setError("⚠ Please enter a description.");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const obj = {
        topic: input,
        style: selectedStyle,
      };
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/image-generation`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setImage(data.generatedImageData.content);
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
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput("");
    setSelectedStyle("Realistic");
    setImage("");
    setError("");
  };

  const handleDownload = async () => {
    if (!image) return;
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-image.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
        ? err.message
        : "Something went wrong!";

      toast.error(message);
      setError(message);
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 h-full">
        <form
          onSubmit={handleForm}
          className="flex flex-col bg-white rounded-2xl border border-gray-200 p-3 sm:p-6 min-h-[280px] sm:min-h-[360px] max-h-[360px] sm:max-h-[480px]"
          style={{
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            <h1 className="text-base sm:text-lg font-semibold">
              ✨ AI Image Generator
            </h1>
          </div>

          <label
            className="mt-4 sm:mt-6 font-semibold text-xs sm:text-sm"
            htmlFor="desc"
          >
            Image Description
          </label>
          <input
            id="desc"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="e.g. A futuristic city skyline at sunset"
            className="w-full mt-2 p-2 sm:p-3 text-xs sm:text-sm border border-gray-300 rounded-md outline-none focus:border-indigo-500"
          />

          <p className="mt-4 sm:mt-6 font-semibold text-xs sm:text-sm">
            Select Style
          </p>
          <div className="mt-2 sm:mt-3 flex flex-wrap gap-2 sm:gap-3">
            {Styles.map((style) => {
              const isSelected = selectedStyle === style.name;
              return (
                <span
                  key={style.name}
                  onClick={() => setSelectedStyle(style.name)}
                  className={`text-xs px-3 sm:px-4 py-1 rounded-full border cursor-pointer transition ${
                    isSelected
                      ? style.color
                      : "text-gray-500 border-gray-300 hover:bg-gray-100"
                  }`}
                  style={{
                    boxShadow: isSelected
                      ? "0 2px 4px -1px rgba(0,0,0,0.1)"
                      : "none",
                  }}
                >
                  {style.name}
                </span>
              );
            })}
          </div>

          {error && (
            <p className="mt-3 sm:mt-4 text-red-500 text-xs font-medium">
              {error}
            </p>
          )}

          <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
                text-white px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg 
                transition-all duration-300 disabled:opacity-70"
              style={{
                boxShadow:
                  "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)",
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              {loading ? "Generating..." : "Generate Image"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-200 text-gray-700 transition-all duration-200"
              style={{ boxShadow: "0 2px 4px -1px rgba(0,0,0,0.1)" }}
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" /> Reset
            </button>
          </div>
        </form>

        <div
          className={`flex flex-col bg-white rounded-2xl border border-gray-200 p-3 sm:p-6 min-h-[280px] sm:min-h-[360px] ${
            image
              ? "max-h-[400px] sm:max-h-[560px]"
              : "max-h-[360px] sm:max-h-[480px]"
          } transition-max-height duration-500`}
          style={{
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
            <h2 className="text-base sm:text-xl font-semibold">
              Generated Image
            </h2>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" />
            </div>
          ) : image ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[320px] sm:max-w-[600px] h-[180px] sm:h-[360px] mb-3 sm:mb-4">
                <Image
                  src={image}
                  alt="Generated"
                  fill
                  className="object-contain rounded-lg"
                  style={{
                    boxShadow:
                      "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)",
                  }}
                />
              </div>
              <button
                onClick={handleDownload}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                style={{ boxShadow: "0 2px 4px -1px rgba(0,0,0,0.1)" }}
              >
                Download Image
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs sm:text-sm text-gray-400">
              <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
                <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 opacity-60" />
                <p>
                  Enter a description and select a style, then click{" "}
                  <span className="font-medium">
                    &quot;Generate Image&quot;
                  </span>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImage;
