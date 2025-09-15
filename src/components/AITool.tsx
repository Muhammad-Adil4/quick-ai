"use client";

import Link from "next/link";
import { AiToolsData } from "@/lib/assets/assets";

export default function AiTool() {
  return (
    <div className="px-4 sm:px-20 xl:px-32 my-24">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-slate-700 text-[42px] font-semibold">
          Powerful AI Tools
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto mt-2">
          Everything you need to create, enhance, and optimize your content with
          cutting-edge AI technology.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {AiToolsData.map((tool, index) => (
          <Link
            key={index}
            href={`${tool.path}`}
            prefetch={false} // optional: background prefetching disable
            className="p-8 rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer block"
          >
            {/* Tool Icon */}
            <div
              className="w-12 h-12 p-3 rounded-xl text-white flex items-center justify-center mb-6"
              style={{
                background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
              }}
            >
              <tool.Icon className="w-full h-full" />
            </div>

            {/* Title */}
            <h1 className="text-lg font-semibold mb-2">{tool.title}</h1>

            {/* Description */}
            <p className="text-gray-400 text-sm">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
