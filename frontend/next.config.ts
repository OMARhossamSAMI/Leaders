import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // 🚀 Disable Next.js image optimization
  },
  // Photos and the home page video: browsers keep them for a week instead of
  // asking the server again on every visit (the default is max-age=0).
  async headers() {
    return [
      {
        source: "/assets/img/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
