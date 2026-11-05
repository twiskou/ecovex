import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Allow base64 data URLs (used for uploaded images stored in Turso on Vercel serverless)
    dangerouslyAllowSVG: false,
    // Domains for future CDN/cloud storage
    remotePatterns: [],
  },
  // Handle unhandled promise rejections gracefully in production
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
