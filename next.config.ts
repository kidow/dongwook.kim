import type { NextConfig } from 'next'
import { createMDX } from 'fumadocs-mdx/next'
import withPWAInit from 'next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: '/offline'
  }
})

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co'
      }
    ]
  }
}

const withMDX = createMDX()

export default withPWA(withMDX(nextConfig))
