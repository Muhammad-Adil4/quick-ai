import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Unsplash images
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // Clerk profile images
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary images
        pathname: "/**", // all paths under Cloudinary
      },
    ],
  },
};

export default nextConfig;
