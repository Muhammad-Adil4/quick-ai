"use client";

import { assets } from "@/lib/assets/assets";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useUser, SignIn } from "@clerk/nextjs";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className="flex flex-col items-center justify-start h-screen">
      {/* Navbar */}
      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200">
        <Image
          src={assets.logo}
          alt="Logo"
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
        {sidebarOpen ? (
          <X
            onClick={() => setSidebarOpen(false)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        ) : (
          <Menu
            onClick={() => setSidebarOpen(true)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        )}
      </nav>

      {/* Sidebar + Content */}
      <div className="flex flex-1 w-full h-[calc(100vh-56px)]">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default Layout;
