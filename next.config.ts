import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // agar use kar rahe ho
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // Clerk profile images ke liye
      },
    ],
  },
};

export default nextConfig;
