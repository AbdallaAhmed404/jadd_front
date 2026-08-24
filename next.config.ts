import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/:path*",
        destination: "/admin/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;