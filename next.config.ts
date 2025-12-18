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
    '@react-email/html',
    '@react-email/head',
    '@react-email/preview',
    '@react-email/body',
    '@react-email/container',
    '@react-email/section',
    '@react-email/text',
    '@react-email/img',
    '@react-email/hr',
    '@react-email/link',
    '@react-email/button',
    '@react-email/heading',
    '@react-email/row',
    '@react-email/column',
    '@react-email/font',
    '@react-email/tailwind',
    '@react-email/code-block',
    '@react-email/code-inline',
    '@react-email/markdown',
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
    return config
  },
}

export default nextConfig
