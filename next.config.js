/** @type {import('next').NextConfig} */
const path = require('path');

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
  },
  webpack: (config) => {
    config.resolve.alias['framer-motion'] = path.resolve(__dirname, './components/mock-framer-motion.tsx');
    return config;
  },
}

module.exports = nextConfig