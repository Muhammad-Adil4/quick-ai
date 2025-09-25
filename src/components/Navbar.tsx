"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { assets } from "@/lib/assets/assets";
import { useClerk, UserButton, useUser, useAuth } from "@clerk/nextjs";

// Client-side component to log Clerk token
export function ClerkTokenLogger() {
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then((token) => console.log("Clerk token:", token));
  }, []);

  return null; // Only logs token
}

const Navbar: React.FC = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="fixed z-50 w-full backdrop-blur-2xl flex items-center justify-between py-3 px-4 sm:px-8 md:px-12 lg:px-20">
      <Link href="/">
        <Image
          src={assets.logo}
          alt="Quick AI Logo"
          height={160}
          width={160}
          className="w-28 sm:w-36 md:w-40 lg:w-44 object-contain"
          priority
        />
      </Link>

      {/* Log token in console (client-side) */}
      <ClerkTokenLogger />

      {user ? (
        <UserButton />
      ) : (
        <button
          onClick={() => openSignIn()}
          className="bg-[#5044e5] text-white rounded-full flex items-center gap-2 hover:bg-[#4036c5] transition text-xs sm:text-sm px-6 sm:px-8 md:px-10 py-3 sm:py-3 cursor-pointer whitespace-nowrap"
        >
          Get Started
          <ArrowRight size={16} className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
