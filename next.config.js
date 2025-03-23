/** @type {import('next').NextConfig} */
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
}

module.exports = nextConfig

