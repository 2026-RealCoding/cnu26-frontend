import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.20.10.244'],
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    return [
      {
        // 클라이언트에서 /api/* 요청 → BE 서버로 중계 (CORS 우회)
        source: '/api/:path*',
        destination: 'http://localhost:8080/:path*',
      },
    ];
  },
  images: {
    // 네이버 쇼핑 이미지 도메인 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.naver.com',
      },
      {
        protocol: 'https',
        hostname: '**.pstatic.net',
      },
    ],
  },
};

export default nextConfig;
