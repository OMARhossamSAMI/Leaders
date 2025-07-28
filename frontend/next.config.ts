import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "leaderscollege.up.railway.app"], // Add any external hosts you're using
  },
};

export default nextConfig;
