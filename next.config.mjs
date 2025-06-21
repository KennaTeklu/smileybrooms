/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  
  output: 'standalone',
  
  transpilePackages: [
    '@supabase/supabase-js',
    '@supabase/realtime-js', 
    '@supabase/ssr',
  ],
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

export default nextConfig
