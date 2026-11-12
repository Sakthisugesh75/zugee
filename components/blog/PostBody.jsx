// components/blog/PostBody.jsx
// Renders a post's structured blocks (lib/blog.js) as article HTML. A server component.

import { Download } from "lucide-react";

const H2 = "scroll-mt-28 text-2xl sm:text-3xl font-extrabold text-fg tracking-tight leading-tight mt-12 mb-4";
const H3 = "text-lg sm:text-xl font-bold text-fg mt-8 mb-3";
const P = "text-base sm:text-lg text-slate-300 leading-relaxed mb-5";

function TemplateTable({ block }) {
  return (
    <div className="my-6 overflow-x-auto rounded-2xl bg-card border border-line shadow-card">
      <table className="w-full min-w-[320px] border-collapse text-left text-sm sm:text-base">
        <caption className="sr-only">{block.caption}</caption>
        <thead>
          <tr className="bg-ink/[0.04]">
            {block.columns.map((column, i) => (
              <th
                key={column}
                scope="col"
                className={`px-4 py-3 font-bold text-fg border-b border-line ${i === 0 ? "w-1/2 sm:w-2/5" : ""}`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row.label} className="border-b border-line last:border-b-0">
              <th scope="row" className={`px-4 py-2.5 align-top text-slate-200 ${row.bold ? "font-bold text-fg" : "font-medium"}`}>
                {row.label}
              </th>
              {/* Empty cell to fill in, with a faint rule so the printed sheet has a line to write on. */}
              <td className="px-4 py-2.5 border-l border-line">
                <span className="sr-only">(blank)</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * A filled-in table: the first cell of each row is its label, the rest are values. Values are right
 * aligned (amounts) unless the block says `align: "left"` (a comparison in words). A comparison
 * stacks on phones: each row becomes a card, every value labelled with its column, because four
 * columns of words don't fit 375px and a sideways-scrolling table hides the last column.
 */
function DataTable({ block }) {
  const comparison = block.align === "left";
  const valueAlign = comparison ? "text-left" : "text-right tabular-nums";
  // Phone-only stacking classes (max-sm: = below 640px).
  const stack = comparison
    ? {
        table: "max-sm:min-w-0",
        thead: "max-sm:hidden",
        tr: "max-sm:block max-sm:py-2",
        th: "max-sm:block max-sm:pb-1",
        td: "max-sm:flex max-sm:gap-3 max-sm:py-1 max-sm:before:content-[attr(data-label)] max-sm:before:w-28 max-sm:before:shrink-0 max-sm:before:text-slate-400 max-sm:before:text-xs max-sm:before:pt-0.5"
      }
    : { table: "", thead: "", tr: "", th: "", td: "" };
  return (
    <div className="my-6 overflow-x-auto rounded-2xl bg-card border border-line shadow-card">
      <table className={`w-full min-w-[320px] border-collapse text-left text-sm sm:text-base ${stack.table}`}>
        <caption className="sr-only">{block.caption}</caption>
        <thead className={stack.thead}>
          <tr className="bg-ink/[0.04]">
            {block.columns.map((column, i) => (
              <th key={column} scope="col" className={`px-4 py-3 font-bold text-fg border-b border-line ${i > 0 && !comparison ? "text-right" : ""}`}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row.cells[0]} className={`border-b border-line last:border-b-0 ${row.bold ? "bg-ink/[0.03]" : ""} ${stack.tr}`}>
              <th scope="row" className={`px-4 py-2.5 align-top ${row.bold ? "font-bold text-fg" : "font-medium text-slate-200"} ${stack.th}`}>
                {row.cells[0]}
              </th>
              {row.cells.slice(1).map((cell, i) => (
                <td
                  key={i}
                  data-label={block.columns[i + 1]}
                  className={`px-4 py-2.5 align-top ${valueAlign} ${row.bold ? "font-bold text-fg" : "text-slate-300"} ${stack.td}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {block.note && <p className="px-4 py-3 text-sm text-slate-400 border-t border-line m-0">{block.note}</p>}
    </div>
  );
}

function Block({ block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={block.id} className={H2}>
          {block.text}
        </h2>
      );
    case "h3":
      return <h3 className={H3}>{block.text}</h3>;
    case "p":
      return <p className={P}>{block.text}</p>;
    case "ul":
      return (
        <ul className="list-disc pl-6 mb-6 space-y-1.5 text-base sm:text-lg text-slate-300 leading-relaxed marker:text-cyan-400">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "template":
      return <TemplateTable block={block} />;
    case "table":
      return <DataTable block={block} />;
    case "download":
      return (
        <p className="mb-8">
          <a href={block.href} download className="btn-primary text-base !py-3 !px-7">
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>{block.label}</span>
          </a>
        </p>
      );
    case "mistakes":
      return (
        <ol className="list-none p-0 m-0 mb-6 space-y-4">
          {block.items.map((item, i) => (
            <li key={item.title} className="flex gap-4 p-5 rounded-2xl bg-card border border-line shadow-card">
              <span
                className="shrink-0 w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 font-bold text-sm inline-flex items-center justify-center"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed m-0">
                <strong className="text-fg font-bold">
                  <span className="sr-only">{i + 1}. </span>
                  {item.title}
                </strong>{" "}
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}

/** @param {{ blocks: object[] }} props */
export default function PostBody({ blocks }) {
  return (
    <div>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
