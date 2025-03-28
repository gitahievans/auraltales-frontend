import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "80b4ea6aaa8ed2b91c16beb44843b4ed.r2.cloudflarestorage.com",
      "pub-1bc4ec60c9894c6899d3421ac4d29fe9.r2.dev",
    ],
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
