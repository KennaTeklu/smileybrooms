/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure experimental features are enabled for Tailwind 4 compatibility
  experimental: {
    // Enable if you're using app directory
    appDir: true,
    // Other experimental features as needed
  },
  // Transpile specific modules if needed
  transpilePackages: [],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
