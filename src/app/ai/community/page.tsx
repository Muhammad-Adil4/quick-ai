"use client";

import React from "react";
import { Users, MessageSquare, Heart, PlusCircle } from "lucide-react";

const Community: React.FC = () => {
  return (
    <div className="p-6 text-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Community Hub</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm rounded-lg shadow-md hover:opacity-90 transition">
          <PlusCircle className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CommunityCard
          icon={<Users className="w-6 h-6 text-blue-500" />}
          title="Members"
          description={
            <>
              Join over <b>2,500+</b> learners.
            </>
          }
        />
        <CommunityCard
          icon={<MessageSquare className="w-6 h-6 text-green-500" />}
          title="Discussions"
          description="Collaborate & share knowledge."
        />
        <CommunityCard
          icon={<Heart className="w-6 h-6 text-red-500" />}
          title="Support"
          description="Get help & motivate others."
        />
      </div>

      {/* Empty State */}
      <div className="mt-10 flex flex-col items-center justify-center text-center text-gray-400">
        <MessageSquare className="w-12 h-12 mb-3 text-gray-300" />
        <p className="text-sm">No posts yet. Be the first to start a discussion!</p>
      </div>
    </div>
  );
};

// Reusable Card Component
interface CommunityCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ icon, title, description }) => {
  return (
    <div className="p-5 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
      <div className="flex items-center gap-3 mb-3">{icon}</div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default Community;
