import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.37"],
  experimental: {
    turbo: {
      root: __dirname,
    },
  },
};

export default nextConfig;
