// app/not-found.jsx
// The 404 page. Replaces Next.js's default, which adds a second <title> next to the root layout's.
// Next.js marks 404 responses noindex on its own.

import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  description: "The page you were looking for does not exist on the ZUGEE website."
};

export default function NotFound() {
  return (
    <main id="main-content" className="site-theme min-h-screen flex items-center justify-center px-4 text-center bg-canvas">
      <div className="max-w-md">
        <p className="text-sm font-mono text-cyan-400 mb-3">404</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight mb-4">Page not found</h1>
        <p className="text-base text-slate-300 mb-8">
          The page you were looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/" className="btn-primary">
          Back to the homepage
        </Link>
      </div>
    </main>
  );
}
