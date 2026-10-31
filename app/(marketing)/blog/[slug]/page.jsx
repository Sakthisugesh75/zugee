// app/(marketing)/blog/[slug]/page.jsx
// One blog post. Fully static: a page per published post in lib/blog.js, any other slug is a 404.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import PostBody from "@/components/blog/PostBody";
import PostCard from "@/components/blog/PostCard";
import { formatPostDate, getPost, postHeadings, postPageSchema, postPath, publishedPosts } from "@/lib/blog";
import { PRODUCTS, productPagePath } from "@/lib/products";
import { serializeJsonLd } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedPosts().map((post) => ({ slug: post.slug }));
}

/** A published post by slug, or null. */
function findPost(slug) {
  const post = getPost(slug);
  return post && post.published !== false ? post : null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};
  const path = postPath(post);

  // openGraph and twitter replace the root layout's objects rather than merging, so every field is repeated.
  return {
    title: { absolute: post.title },
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      title: post.title,
      description: post.description,
      url: path,
      siteName: "ZUGEE",
      images: [{ url: post.ogImage, width: 1200, height: 630, alt: post.title }],
      locale: "en_IN",
      type: "article",
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified || post.datePublished,
      section: post.category
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.ogImage]
    }
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const headings = postHeadings(post);
  const product = PRODUCTS.find((p) => p.pageSlug === post.relatedProductSlug);
  const productPath = productPagePath(product);
  const related = publishedPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(postPageSchema(post)) }} />

      <article>
        <header className="relative pt-28 pb-12 md:pt-36 md:pb-14 overflow-hidden bg-canvas light-mesh border-b border-ink/[0.06]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-cyan-500/[0.07] rounded-full ambient-glow lg:blur-[180px]" />
          </div>
          <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400 list-none p-0 m-0">
                <li>
                  <Link href="/" className="hover:text-brand transition-colors">Home</Link>
                </li>
                <li aria-hidden="true" className="text-slate-600">/</li>
                <li>
                  <Link href="/blog" className="hover:text-brand transition-colors">Blog</Link>
                </li>
                <li aria-hidden="true" className="text-slate-600">/</li>
                <li aria-current="page" className="text-slate-200 font-medium">{post.h1}</li>
              </ol>
            </nav>

            <p className="mb-5">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-ink/[0.03] border border-cyan-400/30 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
                {post.category}
              </span>
            </p>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-fg leading-[1.1] mb-6">{post.h1}</h1>

            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
              <span>
                By <span className="text-slate-200 font-medium">{post.author}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Published <time dateTime={post.datePublished}>{formatPostDate(post.datePublished)}</time>
              </span>
              {post.dateModified && post.dateModified !== post.datePublished && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Updated <time dateTime={post.dateModified}>{formatPostDate(post.dateModified)}</time>
                  </span>
                </>
              )}
            </p>
          </div>
        </header>

        <div className="py-12 sm:py-16 bg-canvas">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
            {headings.length > 1 && (
              <nav aria-labelledby="toc-heading" className="mb-10 p-5 sm:p-6 rounded-2xl bg-card border border-line shadow-card">
                <p id="toc-heading" className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300 mb-3">
                  In this guide
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-sm sm:text-base marker:text-slate-400">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a href={`#${heading.id}`} className="text-cyan-400 hover:text-cyan-300 hover:underline">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <PostBody blocks={post.blocks} />

            {product && productPath && post.cta && (
              <aside
                aria-labelledby="post-cta-heading"
                className="mt-12 p-6 sm:p-8 rounded-3xl bg-card border border-cyan-400/30 shadow-card relative overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cyan-500/10 ambient-glow lg:blur-3xl pointer-events-none" aria-hidden="true" />
                <h2 id="post-cta-heading" className="relative text-2xl sm:text-3xl font-extrabold text-fg tracking-tight leading-tight mb-3">
                  {post.cta.heading}
                </h2>
                <p className="relative text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
                  {product.name} {post.cta.textAfterProductName}
                </p>
                <Link href={productPath} className="relative btn-primary text-base !py-3.5 !px-8">
                  <span>{post.cta.button}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </aside>
            )}
          </div>
        </div>
      </article>

      <section aria-labelledby="more-posts-heading" className="py-16 sm:py-20 bg-canvas-alt border-b border-ink/[0.06]">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <h2 id="more-posts-heading" className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight leading-tight mb-8">
            More from the blog
          </h2>
          {related.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 list-none p-0 m-0">
              {related.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} headingLevel="h3" />
                </li>
              ))}
            </ul>
          ) : (
            <Link href="/blog" className="inline-flex items-center gap-2 text-base font-semibold text-cyan-400 hover:text-cyan-300">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              All guides on the ZUGEE blog
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
