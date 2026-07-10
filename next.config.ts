import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      { source: '/projects', destination: '/work', permanent: true },
      { source: '/projects/web-engineering', destination: '/services/web-engineering', permanent: true },
      { source: '/projects/ux-ui-design', destination: '/services/ux-ui-design', permanent: true },
      { source: '/projects/app-architecture', destination: '/services/app-architecture', permanent: true },
      { source: '/projects/auto-ops-crm', destination: '/services/auto-ops-crm', permanent: true },
      { source: '/projects/consulting', destination: '/services/consulting', permanent: true },
      { source: '/projects/hexaia', destination: '/work', permanent: true },
      { source: '/projects/:slug', destination: '/work/:slug', permanent: false },
    ]
  },
};

export default nextConfig;
