import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "Content-Security-Policy",
      value: "frame-ancestors 'self' https://berinda-project-management.web.app https://berinda-project-management.firebaseapp.com https://localhost" }] }];
  },
};

export default nextConfig;
