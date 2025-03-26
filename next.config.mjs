import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["80b4ea6aaa8ed2b91c16beb44843b4ed.r2.cloudflarestorage.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "80b4ea6aaa8ed2b91c16beb44843b4ed.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
