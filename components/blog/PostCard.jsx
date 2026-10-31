// components/blog/PostCard.jsx
// A blog post card: category, title, excerpt, date. Used by /blog and the "More from the blog" row.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPostDate, postExcerpt, postPath } from "@/lib/blog";

/** @param {{ post: import("@/lib/blog").BLOG_POSTS[number], headingLevel?: "h2" | "h3" }} props */
export default function PostCard({ post, headingLevel = "h2" }) {
  const Heading = headingLevel;
  return (
    <Link
      href={postPath(post)}
      className="group h-full p-6 flex flex-col rounded-2xl bg-card border border-line shadow-card hover:border-cyan-500/40 transition-colors"
    >
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.18em] mb-3 text-slate-300">
        <span className="text-cyan-400">{post.category}</span>
        <time dateTime={post.datePublished} className="font-medium normal-case tracking-normal text-slate-400">
          {formatPostDate(post.datePublished)}
        </time>
      </span>
      <Heading className="text-lg sm:text-xl font-bold text-fg mb-2 leading-snug">{post.h1}</Heading>
      <p className="text-sm text-slate-300 leading-relaxed mb-4 flex-1">{postExcerpt(post)}</p>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300">
        Read the guide
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}
