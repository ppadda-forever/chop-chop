const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com'],
  },
  // 프로젝트 루트를 명시적으로 지정하여 경고 제거
  outputFileTracingRoot: path.join(__dirname),
}

module.exports = nextConfig
