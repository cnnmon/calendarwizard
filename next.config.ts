import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        module: false,
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["faiss-node"],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://wizardingassistant.vercel.app/api/:path*',
      },
    ]
  },
};

export default nextConfig;
