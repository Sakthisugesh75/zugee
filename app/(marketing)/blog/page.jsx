// app/(marketing)/blog/page.jsx
// The blog list: every published post (lib/blog.js), newest first.

import Link from "next/link";
import PostCard from "@/components/blog/PostCard";
import { publishedPosts } from "@/lib/blog";

const TITLE = "Blog | Guides for Indian Small Businesses by ZUGEE";
const DESCRIPTION =
  "Practical guides for Indian small businesses from ZUGEE: formats, templates and checklists for transport, schools, PGs, hospitals and more.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  // openGraph and twitter replace the root layout's objects, so every field is repeated.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/blog",
    siteName: "ZUGEE",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: TITLE }],
    locale: "en_IN",
    type: "website"
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.jpg"] }
};

export default function BlogPage() {
  const posts = publishedPosts();

  return (
    <>
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-16 overflow-hidden bg-canvas light-mesh border-b border-ink/[0.06]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-cyan-500/[0.07] rounded-full ambient-glow lg:blur-[180px]" />
        </div>
        <div className="container relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400 list-none p-0 m-0">
              <li>
                <Link href="/" className="hover:text-brand transition-colors">Home</Link>
              </li>
              <li aria-hidden="true" className="text-slate-600">/</li>
              <li aria-current="page" className="text-slate-200 font-medium">Blog</li>
            </ol>
          </nav>

          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">ZUGEE blog</p>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight text-fg leading-[1.08] mb-6">
            Guides for Indian small businesses
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Plain-language formats, templates and checklists for running a business in India, from trip sheets for
            transport owners onwards. Free to copy, print and use, whether or not you use ZUGEE.
          </p>
        </div>
      </section>

      <section aria-label="Posts" className="py-16 sm:py-20 bg-canvas-alt border-b border-ink/[0.06]">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 list-none p-0 m-0">
            {posts.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} headingLevel="h2" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
