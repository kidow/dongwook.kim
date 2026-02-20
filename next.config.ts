import type { NextConfig } from 'next'
import { createMDX } from 'fumadocs-mdx/next'

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

export default withMDX(nextConfig)
