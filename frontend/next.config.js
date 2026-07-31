/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        // Proxy API calls to the Node.js backend during local dev
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
