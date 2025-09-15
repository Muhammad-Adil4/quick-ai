"use client";

import React, { useState } from "react";
import Markdown from "react-markdown";
import Image from "next/image";

interface CreationItem {
  id: string | number;
  prompt: string;
  type: "text" | "image" | "file" | "video" | "audio";
  content: string;
  created_at: string | Date;
}

interface CreationItemsProps {
  item: CreationItem;
}

const CreationItems: React.FC<CreationItemsProps> = ({ item }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="w-full max-w-5xl p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
            {item.prompt}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {item.type} • {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-3 py-1 text-xs font-medium rounded-full">
          {item.type}
        </span>
      </div>

      {/* Expandable Content */}
      {expanded && (
        <div className="mt-4">
          {item.type === "image" ? (
            <div className="relative w-full max-w-md h-64">
              <Image
                src={item.content}
                alt="Generated content"
                fill
                className="rounded-lg border border-gray-200 object-cover"
              />
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto text-sm text-slate-700 leading-relaxed prose prose-sm">
              <Markdown>{item.content}</Markdown>
            </div>
          )}
        </div>
      )}

      {/* Expand/Collapse indicator */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        {expanded ? "Click to collapse ↑" : "Click to expand ↓"}
      </div>
    </div>
  );
};

export default CreationItems;
