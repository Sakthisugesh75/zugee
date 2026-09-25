import os from "node:os";

// This machine's LAN IPv4 addresses (e.g. 192.168.1.5), so phones and tablets on the same
// Wi-Fi can load dev-only assets. Next.js blocks cross-origin dev requests by default.
// Development only: allowedDevOrigins has no effect on production builds.
const lanAddresses = Object.values(os.networkInterfaces())
  .flat()
  .filter((iface) => iface && iface.family === "IPv4" && !iface.internal)
  .map((iface) => iface.address);

const isProduction = process.env.NODE_ENV === "production";

// Report-only for now: Next.js inlines scripts, so an enforcing CSP needs nonces (Phase 8).
// Browsers log violations to the console without blocking anything, which shows what a strict
// policy would break before we enforce it.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'"
].join("; ");

const securityHeaders = [
  // No other site may frame any page (clickjacking on the admin login in particular).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
  // HSTS only in production: sending it from localhost would pin browsers to HTTPS for dev hosts.
  ...(isProduction ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }] : [])
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // LAN IPs for same-Wi-Fi phone testing, plus quick-tunnel hosts for testing from anywhere.
  allowedDevOrigins: [...lanAddresses, "*.trycloudflare.com", "*.loca.lt"],
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  }
};

export default nextConfig;
