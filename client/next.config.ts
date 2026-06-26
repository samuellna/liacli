import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",
  // Evita loop com nginx (301 /liacli → /liacli/) vs Next (308 /liacli/ → /liacli)
  trailingSlash: true,
};

export default nextConfig;
