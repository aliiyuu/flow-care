import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remove standalone output for Vercel deployment
  images: {
    domains: ['example.com'], // Add your image domains here
  },
  webpack: (config, { isServer }) => {
    // Fixes for webpack build issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      dns: false,
      child_process: false,
      tls: false,
    };
    
    // Optimize for Vercel deployment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;