import type { NextConfig } from "next";

const allowedOrigin = process.env.REPLIT_DEV_DOMAIN;

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "localhost:80",
    "127.0.0.1",
    "127.0.0.1:80",
    "0.0.0.0",
    "*.replit.dev",
    ...(allowedOrigin ? [allowedOrigin] : []),
  ],
  poweredByHeader: false,
};

export default nextConfig;
