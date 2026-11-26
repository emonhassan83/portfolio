/**
 * Backend origin, e.g. http://localhost:5000. Browser calls go to /api/* on this
 * site and are proxied there, so session cookies stay first-party.
 * Falls back to the legacy NEXT_PUBLIC_BASE_URL (".../api") if API_ORIGIN is unset.
 */
const apiOrigin = (
  process.env.API_ORIGIN ||
  (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")
).replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    API_ORIGIN: apiOrigin,
  },
  // Filesystem routes (app/api/revalidate) win over this rewrite.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiOrigin}/api/:path*` }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
