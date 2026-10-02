/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Admins can add products with images hosted elsewhere.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
