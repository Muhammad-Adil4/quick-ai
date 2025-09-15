"use client";

import React, { useEffect, useState } from "react";
import { Gem, Sparkles } from "lucide-react";
import { Protect } from "@clerk/clerk-react";
import CreationItems from "@/components/CreationItems"; // ✅ Absolute import (Next.js convention)

// Dummy data ko yaha define kar rahe hain (API ke jagah abhi hardcoded)
const dummyCreationData = [
  {
    id: 1,
    prompt: "Generate a blog title about AI in healthcare",
    type: "text",
    content: "AI Revolution in Healthcare: How Technology is Saving Lives",
    created_at: new Date(),
  },
  {
    id: 2,
    prompt: "Generate an image of a futuristic city",
    type: "image",
    content: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    created_at: new Date(),
  },
];

interface CreationItem {
  id: string | number;
  prompt: string;
  type: "text" | "image" | "file" | "video" | "audio";
  content: string;
  created_at: string | Date;
}

const Dashboard: React.FC = () => {
  const [creations, setCreations] = useState<CreationItem[]>([]);

  useEffect(() => {
    // Future: yaha API call kar sakte ho
    setCreations(dummyCreationData);
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total Creations Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-[#3C81F6] to-[#9234EA] rounded-full flex items-center justify-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>

        {/* Plan Status Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xs font-semibold">
              <Protect plan="premium" fallback="free">
                Premium
              </Protect>
            </h2>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-[#FF61C5] to-[#9E53EE] rounded-xl flex items-center justify-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Recent Creations List */}
      <div className="space-y-3">
        <p className="mt-6 mb-4 font-medium text-slate-700">Recent Creations</p>
        {creations.map((item) => (
          <CreationItems key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
