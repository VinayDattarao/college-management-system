/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '/college-management-system',
  assetPrefix: '/college-management-system/'
}

module.exports = nextConfig 