/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "knowablemagazine.org",
      "wyofile.com",
      "d2r55xnwy6nx47.cloudfront.net", // Quanta Magazine
      "static.quantamagazine.org",
      "www.artic.edu",
      "apod.nasa.gov",
      "www.quantamagazine.org",
      "www.earth.com",
      "phys.org",
      "www.space.com",
      "cff2.earth.com",
      "scx2.b-cdn.net",
      "cdn.mos.cms.futurecdn.net",
    ],
    // Add support for remote patterns to be more flexible
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
