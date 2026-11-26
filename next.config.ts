import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, './'),
  // Was das Vertrags-PDF zur Laufzeit von der Platte liest. Auf Vercel liegt
  // neben einer Funktion nur, was der Build ihr zuordnet. Alles hier erkennt
  // er nicht von selbst:
  //
  //   public/vertraege, fonts/   Logo und Schrift, gelesen in src/lib/vertraege/pdf.tsx
  //   pdfkit/js/standard-fonts   pdfkit lädt die Maße seiner Standardschrift
  //                              Helvetica erst beim Zeichnen nach, über einen
  //                              eigenen require. Jedes Dokument braucht sie,
  //                              auch wenn der Text in Inter gesetzt ist.
  //
  // Fehlt der dritte Eintrag, läuft lokal alles und auf Vercel antwortet jede
  // PDF-Route mit 500 („Cannot load the standard font Helvetica“). Genau das
  // ist am 26.11.2026 passiert. tests/lib/vertraege-vercel-dateien.test.ts
  // hält die Liste fest.
  outputFileTracingIncludes: {
    '/api/admin/contracts/**': [
      './public/vertraege/**',
      './src/lib/vertraege/fonts/*.ttf',
      './node_modules/pdfkit/js/standard-fonts/**',
    ],
  },
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
  // Externalize react-email packages to prevent Html component conflicts during static generation
  serverExternalPackages: [
    '@react-email/components',
    '@react-email/render',
    // Bringt einen eigenen React-Reconciler mit. Gebündelt läuft er gegen die
    // React-Fassung, die Next für Route-Handler einbaut, und bricht beim Rendern ab.
    '@react-pdf/renderer',
  ],
  // Configure webpack to handle react-email packages properly
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent @react-email packages from being bundled on client
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-email/components': false,
        '@react-email/render': false,
      }
    }

    // Mark react-email packages as external for server builds too
    if (isServer) {
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push({
          '@react-email/components': 'commonjs @react-email/components',
          '@react-email/render': 'commonjs @react-email/render',
        })
      }
    }

    return config
  },
}

export default nextConfig
