import type { NextConfig } from "next";

const extraDevOrigins = (process.env.DEV_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  // Allow phone/tablet on LAN to load dev JS bundles (required for client hydration).
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.2.19",
    "192.168.2.60",
    ...extraDevOrigins,
  ],
};

export default nextConfig;
