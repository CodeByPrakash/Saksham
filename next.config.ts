import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Next.js floating dev indicator badge in bottom corner
  devIndicators: false,

  // High-performance image optimization (WebP/AVIF, cache, responsive sizes)
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 64, 96, 128, 256, 384, 512],
    qualities: [80, 85, 90, 95, 100],
  },

  // Cache headers for static assets over Wi-Fi hosting
  async headers() {
    return [
      {
        source: "/landingPage/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Allow access from local network IPs for mobile testing
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.201.89:3000",
    "192.168.201.89",
    "192.168.1.*",
    "192.168.202.*",
    "*.local",
  ],
};

export default nextConfig;

