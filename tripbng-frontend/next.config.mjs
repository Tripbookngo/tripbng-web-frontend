/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["i.travelapi.com", "cdn.worldota.net"], // ✅ Add both domains
  },
};

export default nextConfig;
