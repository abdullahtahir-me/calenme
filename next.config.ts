import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // 🚧 Temporarily skip ESLint errors in build
  },
};

export default nextConfig;