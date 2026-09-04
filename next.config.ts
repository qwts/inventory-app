import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export", // Enables static export mode
  // GitHub Pages serves project sites under /<repo>/, so production builds
  // must emit URLs under that prefix; local dev keeps the root path.
  basePath: process.env.NODE_ENV === "production" ? "/inventory-app" : "",
  trailingSlash: true, // Ensures URLs have trailing slashes (optional)
  images: {
    unoptimized: true, // Required when using `next export` to avoid next/image optimization issues
  },
  distDir: "out", // Defines the output directory for static files (default: `out`)
};

export default nextConfig;
