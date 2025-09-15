"use client";

import { assets } from "@/lib/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-20 w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/gradientBackground.png')" }}
    >
      {/* Heading & Paragraph */}
      <div className="text-center mb-10 max-w-3xl">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-800">
          Create amazing content
          <br />
          with <span className="text-primary">AI tools</span>
        </h1>
        <p className="mt-6 text-gray-600 text-sm sm:text-base md:text-lg">
          Transform your content creation with our suite of premium AI tools. 
          Write articles, generate images, and enhance your workflow.
        </p>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
          onClick={() => router.push("/ai")}
          className="bg-[#5044e5] text-white py-3 px-10 rounded-lg hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer font-medium shadow-md"
        >
          Get Started
        </button>
        <button
          onClick={() => router.push("/demo")}
          className="bg-white text-gray-800 py-3 px-10 border border-gray-300 rounded-lg hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer font-medium shadow-sm"
        >
          Watch Demo
        </button>
      </div>

      {/* Trusted by Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-12 text-gray-600 text-sm sm:text-base">
        <Image
          src={assets.user_group}
          alt="User group"
          width={120}
          height={32}
          className="h-8 w-auto"
          priority
        />
        <span className="mt-2 sm:mt-0">
          Trusted by over <b>10k+</b> people
        </span>
      </div>
    </section>
  );
}
