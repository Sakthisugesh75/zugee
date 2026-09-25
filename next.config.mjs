import os from "node:os";

// This machine's LAN IPv4 addresses (e.g. 192.168.1.5), so phones and tablets on the same
// Wi-Fi can load dev-only assets. Next.js blocks cross-origin dev requests by default.
// Development only: allowedDevOrigins has no effect on production builds.
const lanAddresses = Object.values(os.networkInterfaces())
  .flat()
  .filter((iface) => iface && iface.family === "IPv4" && !iface.internal)
  .map((iface) => iface.address);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // LAN IPs for same-Wi-Fi phone testing, plus quick-tunnel hosts for testing from anywhere.
  allowedDevOrigins: [...lanAddresses, "*.trycloudflare.com", "*.loca.lt"]
};

export default nextConfig;
