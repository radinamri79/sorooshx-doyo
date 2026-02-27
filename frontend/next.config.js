/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output for Docker; Vercel ignores this automatically
  output: process.env.DOCKER_BUILD === "true" ? "standalone" : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
