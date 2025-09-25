"use client";

import React, { useState, ChangeEvent } from "react";
import { FileText, Loader2, RefreshCw, Wand2 } from "lucide-react";
import Markdown from "react-markdown";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

const ReviewResume: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeReview, setResumeReview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { getToken } = useAuth();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const uploaded = e.target.files?.[0] ?? null;
    if (uploaded) {
      setFile(uploaded);
      setResumeReview(null);
    }
  };

  const handleReview = async () => {
    if (!file) {
      setError("⚠ Please upload your resume first.");
      return;
    }

    setLoading(true);
    setError("");
    setResumeReview(null);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", file);

      const { data } = await axios.post(
        "http://localhost:3000/api/ai/resume-review",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setResumeReview(data.resumedata.content);
      } else {
        toast.error(data.message);
        setError(data.message);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
        toast.error(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("❌ Failed to review resume. Try again.");
        toast.error("❌ Failed to review resume. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResumeReview(null);
    setError("");
  };

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 h-full">
        {/* Left Panel */}
        <div className="flex flex-col bg-white rounded-2xl border border-gray-200 p-3 sm:p-6 min-h-[280px] sm:min-h-[360px] max-h-[360px] sm:max-h-[480px] shadow-md">
          {/* Title */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
            <Wand2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            <h1 className="text-base sm:text-2xl font-bold text-gray-800">
              AI Resume Reviewer
            </h1>
          </div>

          {/* File Input */}
          {!file && (
            <label className="flex flex-col items-center justify-center w-full h-28 sm:h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition mb-3 sm:mb-4">
              <div className="flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Click to upload or drag & drop your resume
                </p>
                <p className="text-xs text-gray-400">PDF, DOC, DOCX</p>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {/* File Preview */}
          {file && (
            <div className="flex items-center gap-2 p-2 sm:p-3 mb-3 sm:mb-4 bg-purple-50 rounded-lg border border-purple-200">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <p className="text-xs sm:text-sm text-gray-700 truncate">{file.name}</p>
            </div>
          )}

          {error && <p className="text-xs text-red-500 mb-2 sm:mb-3">{error}</p>}

          {/* Buttons */}
          <div className="mt-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleReview}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-all duration-300 disabled:opacity-70 shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              {loading ? "Analyzing..." : "Review Resume"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-sm"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" /> Reset
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className={`flex flex-col bg-white rounded-2xl border border-gray-200 p-3 sm:p-6 min-h-[280px] sm:min-h-[360px] ${resumeReview ? "max-h-[400px] sm:max-h-[560px]" : "max-h-[360px] sm:max-h-[480px]"} transition-max-height duration-500 shadow-md`}>
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-gray-200">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            <h2 className="text-base sm:text-xl font-semibold text-gray-800">Review Report</h2>
          </div>

          <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" />
              </div>
            ) : resumeReview ? (
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <div className="p-3 sm:p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-1 sm:mb-2">AI Feedback</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    <Markdown>{resumeReview}</Markdown>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-xs sm:text-sm text-gray-400">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2 sm:mb-3" />
                <p>
                  Upload a resume and click <b>Review Resume</b>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;
