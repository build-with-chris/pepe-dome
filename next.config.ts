import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, './'),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Externalize react-email packages to prevent Html component conflicts during static generation
  serverExternalPackages: [
    '@react-email/components',
    '@react-email/render',
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
