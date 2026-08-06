import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/devcanon-website" : "",
  assetPrefix: isGitHubPages ? "/devcanon-website/" : "",
  images: { unoptimized: true },
};

export default nextConfig;
