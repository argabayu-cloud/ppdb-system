import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://backend-ppdb-five.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;

