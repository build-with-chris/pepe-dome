import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, './'),
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@dnd-kit/core', '@dnd-kit/sortable'],
  },
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Supabase Storage (Artikel-/Event-Bilder)
      {
        protocol: 'https',
        hostname: 'wwawsyhykrbvfgvhqbev.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // react-email nur serverseitig laden, damit die Html-Komponente beim
  // statischen Generieren nicht mit der von Next kollidiert. Bis Next 15 stand
  // hier zusätzlich ein webpack-Block mit denselben Externals und einem
  // Client-Alias. Next 16 baut mit Turbopack und bricht bei eigener
  // webpack-Konfiguration ab; der Client-Alias war überflüssig, weil keine
  // Client-Komponente react-email importiert.
  serverExternalPackages: [
    '@react-email/components',
    '@react-email/render',
  ],
}

export default nextConfig
