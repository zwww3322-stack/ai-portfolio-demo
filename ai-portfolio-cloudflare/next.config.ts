import type { NextConfig } from "next";

const isAliyunBuild = process.env.DEPLOY_TARGET === "aliyun";

const nextConfig: NextConfig = {
  // Keep the existing Vinext/Cloudflare build unchanged. For Alibaba Cloud,
  // export plain HTML/CSS/JS that Nginx can serve without a Node.js process.
  output: isAliyunBuild ? "export" : undefined,
  trailingSlash: isAliyunBuild,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
