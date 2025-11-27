/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Rewrites forward incoming requests on the dev server
  // to your backend running on port 3001.
  async rewrites() {
    return [
      // Generic API passthrough
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
      // Health passthrough (nice for quick browser checks)
      {
        source: '/health',
        destination: 'http://localhost:3001/health',
      },
    ];
  },
};

module.exports = nextConfig;