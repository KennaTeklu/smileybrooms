/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'missingSuspenseWithCSRBailout' as it's an unrecognized key for Next.js 15.2.4
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  
  output: 'standalone',
  
  // Removed the entire webpack block as it was likely causing the '_webpack.WebpackError is not a constructor'
  // This error often indicates deep incompatibility with custom webpack configurations.
  // We will re-introduce specific webpack rules only if necessary after this fix.
  
  // Keep transpilePackages for known problematic libraries like Supabase
  transpilePackages: [
    '@supabase/supabase-js',
    '@supabase/realtime-js', 
    '@supabase/ssr',
    // Removed @firebase/util and protobufjs for now, re-add if their specific warnings return
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
