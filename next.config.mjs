/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.com', 'v0.blob.com'],
    unoptimized: true,
  },
  // Use valid experimental options
  experimental: {
    // Disable static generation for not-found pages
    disableOptimizedLoading: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
