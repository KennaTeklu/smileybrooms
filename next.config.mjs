/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'v0.blob.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'smileybrooms.vercel.app'],
    },
  },
};

export default nextConfig;
