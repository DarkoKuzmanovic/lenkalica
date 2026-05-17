/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "**.quantamagazine.org",
      },
      {
        protocol: "https",
        hostname: "**.earth.com",
      },
      {
        protocol: "https",
        hostname: "knowablemagazine.org",
      },
      {
        protocol: "https",
        hostname: "wyofile.com",
      },
      {
        protocol: "https",
        hostname: "**.science.org",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com", // GitHub raw content
      },
    ],
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value: "style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
        },
      ],
    },
  ],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
