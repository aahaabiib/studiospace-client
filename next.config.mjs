const API_URL = process.env.API_URL || "http://127.0.0.1:5000";

const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  async rewrites() {
    return ["studios", "bookings", "wishlist"].map((name) => ({
      source: `/api/${name}/:path*`,
      destination: `${API_URL}/api/${name}/:path*`,
    }));
  },
};

export default nextConfig;