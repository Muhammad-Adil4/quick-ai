"use client";

import React, { useState, FormEvent } from "react";
import { Edit, Sparkles, Loader2, FileText } from "lucide-react";
import Markdown from "react-markdown";

// Article length options type
interface ArticleLengthOption {
  value: number;
  label: string;
}

const articleLengthOptions: ArticleLengthOption[] = [
  { value: 500, label: "Short (up to 500 words)" },
  { value: 1200, label: "Medium (500 - 1500 words)" },
  { value: 1600, label: "Long (1500+ words)" },
];

export default function WriteArticle() {
  const [selectedLength, setSelectedLength] = useState<number | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [article, setArticle] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!topic.trim()) {
      setError("⚠ Please enter a topic.");
      return;
    }
    if (!selectedLength) {
      setError("⚠ Please select article length.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setArticle(
        `# ${topic}\n\nThis is a **dummy generated article** about "${topic}".  
        It is approximately ${selectedLength} words long.\n\nYou can replace this with real API data.`
      );
      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setTopic("");
    setSelectedLength(null);
    setError("");
    setArticle("");
  };

  return (
    <div className="h-[800px] p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 h-full">
        {/* Left Panel - Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-white rounded-2xl border min-h-[400px] max-h-[400px] border-gray-200 p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-7 h-7 text-blue-500" />
            <h1 className="text-xl font-bold">AI Article Writer</h1>
          </div>

          <label className="mt-2 font-semibold text-sm" htmlFor="topic">
            Article Topic
          </label>
          <input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            type="text"
            placeholder="e.g. The Future of Artificial Intelligence"
            className="w-full mt-2 p-3 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <p className="mt-6 font-semibold text-sm">Select Article Length</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {articleLengthOptions.map((item) => {
              const isSelected = selectedLength === item.value;
              return (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setSelectedLength(item.value)}
                  className={`text-sm px-4 py-2 rounded-full border transition shadow-sm ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500"
                      : "text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {error && (
            <p className="mt-4 text-red-500 text-xs font-medium">{error}</p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 text-sm rounded-lg shadow-md disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Edit className="w-5 h-5" />
              )}
              {loading ? "Generating..." : "Generate Article"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Right Panel - Output */}
        <div
          className={`flex flex-col bg-white rounded-2xl border border-gray-200 p-6 shadow-lg min-h-[400px] ${
            article ? "max-h-[600px]" : "max-h-[400px]"
          } transition-max-height duration-500`}
        >
          <div className="flex items-center gap-3 mb-4 flex-shrink-0">
            <FileText className="w-6 h-6 text-indigo-500" />
            <h2 className="text-lg font-semibold">Generated Article</h2>
          </div>

          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
            ) : article ? (
              <div className="prose max-w-none text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg shadow-inner">
                <Markdown>{article}</Markdown>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                <div className="flex flex-col items-center gap-4 text-center">
                  <FileText className="w-10 h-10 text-gray-300" />
                  <p>
                    Enter a topic and choose <b>article length</b>, then click{" "}
                    <span className="font-medium">"Generate Article"</span> to get
                    started.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}