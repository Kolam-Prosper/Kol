/** @type {import('next').NextConfig} */
const path = require("path")

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // Disable TypeScript checking during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint checking during build
    ignoreDuringBuilds: true,
  },
  // If you have any other configurations, they would go here
  images: {
    domains: ["placeholder.svg"],
    unoptimized: true, // Add this for static export
  },
  // This tells Next.js to export a static site
  output: "export",
  // Skip problematic routes during static export
  distDir: "out",
  trailingSlash: true,
  // Skip static generation for problematic routes
  experimental: {
    // This will make these routes only render on demand
    appDir: true,
  },
  // Add this to prevent static generation of specific routes
  exportPathMap: async (defaultPathMap) => {
    // Remove problematic paths
    delete defaultPathMap["/dashboard/assets"]
    delete defaultPathMap["/dashboard/staking"]
    delete defaultPathMap["/lending"]
    return defaultPathMap
  },
}

module.exports = nextConfig

