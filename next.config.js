/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the experimental and api sections as they're deprecated in Next.js 14
  experimental: {
    serverComponentsExternalPackages: ['oracledb'] // Keep only this if needed
  },
  // Remove the entire api section
}

module.exports = nextConfig