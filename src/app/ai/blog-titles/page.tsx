"use client";

import React, { useState, FormEvent } from "react";
import { Edit, Sparkles, Loader2, RefreshCw } from "lucide-react";
import Markdown from "react-markdown";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

const BlogCategories: string[] = [
  "General",
  "Technology",
  "Health",
  "Lifestyle",
  "Finance",
  "Travel",
  "Food",
  "Science",
  "Business",
];

export default function BlogTitles() {
  const [selectedCategory, setSelectedCategory] = useState<string>("General");
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [blogTitle, setBlogTitle] = useState<string>("");
  const { getToken } = useAuth();

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!input.trim()) {
      setError("⚠ Please enter a topic.");
      return;
    }
    if (!selectedCategory) {
      setError("⚠ Please select a blog category.");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const obj = {
        topic: input,
        category: selectedCategory,
      };
      const { data } = await await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/generate-blogTitle`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setBlogTitle(data.blogTitle.content);
      } else {
        toast.error(data.message);
      }
    } catch (err: unknown) {
      // ✅ Type-safe error handling
      if (err instanceof AxiosError) {
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
    setSelectedCategory("General");
    setBlogTitle("");
    setError("");
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
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            <h1 className="text-base sm:text-lg font-semibold">
              ✨ AI Blog Generator
            </h1>
          </div>

          <label
            className="mt-4 sm:mt-6 font-semibold text-xs sm:text-sm"
            htmlFor="topic"
          >
            Blog Topic
          </label>
          <input
            id="topic"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="e.g. The Future of Artificial Intelligence"
            className="w-full mt-2 p-2 sm:p-3 text-xs sm:text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <p className="mt-4 sm:mt-6 font-semibold text-xs sm:text-sm">
            Select Category
          </p>
          <div className="mt-2 sm:mt-3 flex flex-wrap gap-2 sm:gap-3">
            {BlogCategories.map((item) => {
              const isSelected = selectedCategory === item;
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => setSelectedCategory(item)}
                  className={`text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full border transition ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 text-white border-transparent"
                      : "text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                  style={{
                    boxShadow: isSelected
                      ? "0 2px 4px -1px rgba(0,0,0,0.1)"
                      : "none",
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {error && (
            <p className="mt-3 sm:mt-4 text-red-500 text-xs font-medium">
              {error}
            </p>
          )}

          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 
              bg-gradient-to-r from-[#226BFF] to-[#65ADFF] 
              hover:from-[#1B5FE3] hover:to-[#4F97FF]
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
                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              {loading ? "Generating..." : "Generate Blog"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm 
              border border-gray-300 rounded-lg 
              bg-gray-50 hover:bg-gray-200 
              text-gray-700 transition-all duration-200"
              style={{ boxShadow: "0 2px 4px -1px rgba(0,0,0,0.1)" }}
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" /> Reset
            </button>
          </div>
        </form>

        <div
          className={`flex flex-col bg-white rounded-2xl border border-gray-200 p-3 sm:p-6 min-h-[280px] sm:min-h-[360px] ${
            blogTitle
              ? "max-h-[400px] sm:max-h-[560px]"
              : "max-h-[360px] sm:max-h-[480px]"
          } transition-max-height duration-500`}
          style={{
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
            <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-[#226BFF]" />
            <h2 className="text-base sm:text-xl font-semibold">
              Generated Blog
            </h2>
          </div>

          <div className="p-3 sm:p-6 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center text-gray-400 h-full">
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" />
              </div>
            ) : blogTitle ? (
              <div className="prose max-w-none text-xs sm:text-sm text-gray-700 whitespace-pre-line">
                <Markdown>{blogTitle}</Markdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-xs sm:text-sm text-gray-400 h-full text-center gap-3 sm:gap-4">
                <Edit className="w-8 h-8 sm:w-9 sm:h-9 opacity-70" />
                <p>
                  Enter a topic and select a category, then click{" "}
                  <span className="font-medium">&quot;Generate Blog&quot;</span>{" "}
                  to create new ideas.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
