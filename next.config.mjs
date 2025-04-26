// import "./env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["*"],
  },
  experimental: {
    appDir: true,
    // serverComponentsExternalPackages: ["@prisma/client"],
  },
}

export default nextConfig
