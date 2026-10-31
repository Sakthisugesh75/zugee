// lib/blog.js
// Blog posts and their JSON-LD. Post bodies are structured blocks (no HTML strings), rendered by
// components/blog/PostBody.jsx. No JSX and relative imports only, so `node --test` can load this file.
//
// Block types:
//   { type: "p", text }                       paragraph
//   { type: "h2", id, text }                  section heading; listed in the table of contents
//   { type: "h3", text }                      sub-heading
//   { type: "ul", items: [text] }             bullet list
//   { type: "template", columns, rows }       the fillable two-column template table; rows: [{ label, bold? }]
//   { type: "download", href, label }         a file download button
//   { type: "mistakes", items: [{ title, text }] }  numbered list with a bold lead-in per item
//
// Structured data, like lib/structured-data.js, never carries ratings, reviews or prices.

import { getSiteUrl } from "./site.js";

const CONTEXT = "https://schema.org";

/** Fields of the trip sheet template, in order. Shared by the post's table and the Excel generator. */
export const TRIP_SHEET_FIELDS = [
  { label: "Trip sheet no." },
  { label: "Date" },
  { label: "Customer" },
  { label: "Vehicle no." },
  { label: "Driver name & mobile" },
  { label: "From → To" },
  { label: "Departure (date/time)" },
  { label: "Arrival (date/time)" },
  { label: "Opening km" },
  { label: "Closing km" },
  { label: "Total km" },
  { label: "Goods / passengers" },
  { label: "Weight / quantity" },
  { label: "LR no." },
  { label: "E-way bill no." },
  { label: "Diesel (litres / ₹)" },
  { label: "Toll (₹)" },
  { label: "Loading / unloading (₹)" },
  { label: "Driver bata (₹)" },
  { label: "Other expenses (₹)" },
  { label: "Total expenses (₹)", bold: true },
  { label: "Advance given (₹)" },
  { label: "Balance (₹)" },
  { label: "Freight amount (₹)" },
  { label: "POD received? (Yes / No)" },
  { label: "Driver signature" },
  { label: "Office signature" }
];

export const TRIP_SHEET_DOWNLOAD = "/downloads/trip-sheet-template.xlsx";

export const BLOG_POSTS = [
  {
    slug: "trip-sheet-format",
    published: true,
    title: "Trip Sheet Format for Transport Businesses (Free Template)",
    h1: "Trip Sheet Format for Transport Businesses (Free Template)",
    description:
      "A simple trip sheet format for truck, tanker, cab and bus operators in India — what fields to include, a ready template, and common mistakes to avoid.",
    category: "Fleet & Transport",
    // TODO(owner): founder name, ZUGEE. Until then the post is credited to the team (never render "TODO").
    author: "ZUGEE team",
    datePublished: "2026-10-31",
    dateModified: "2026-10-31",
    ogImage: "/og/blog-trip-sheet-format.jpg",
    relatedProductSlug: "fleet-management-software",
    cta: {
      heading: "Stop chasing paper trip sheets",
      // Rendered after the related product's name, read from lib/products.js at render time.
      textAfterProductName:
        "keeps every trip, vehicle, driver and bill in one place. Our team sets it up for your fleet in 14 days and moves your records across from Excel.",
      button: "Book a free demo"
    },
    blocks: [
      {
        type: "p",
        text: "If you run trucks, tankers, cabs or buses, the trip sheet is the most important paper in your business. It decides what you bill, what you pay the driver, and whether a trip made money or lost it."
      },
      {
        type: "p",
        text: "Yet in many transport offices, trip sheets are half-filled, collected days late, or lost in the driver's cabin. This guide gives you a clear trip sheet format you can start using today, and explains what each field is for."
      },
      { type: "h2", id: "what-is-a-trip-sheet", text: "What is a trip sheet?" },
      {
        type: "p",
        text: "A trip sheet is a record of one trip by one vehicle. It notes where the vehicle went, who drove it, how far it travelled, what was carried, and what was spent on the way. The office uses it to:"
      },
      {
        type: "ul",
        items: [
          "Bill the customer correctly",
          "Settle the driver's advance and expenses",
          "Track fuel use and vehicle running",
          "Work out the profit on each trip"
        ]
      },
      { type: "h2", id: "fields-to-include", text: "Trip sheet format: fields to include" },
      { type: "h3", text: "1. Trip details" },
      {
        type: "ul",
        items: ["Trip sheet number (running, never repeated)", "Date", "Booking or order reference", "Customer name"]
      },
      { type: "h3", text: "2. Vehicle and driver" },
      {
        type: "ul",
        items: ["Registration number", "Vehicle type", "Driver name and mobile", "Helper or cleaner name, if any"]
      },
      { type: "h3", text: "3. Route" },
      {
        type: "ul",
        items: ["From", "To", "Stops in between", "Departure date and time", "Arrival date and time"]
      },
      { type: "h3", text: "4. Distance" },
      { type: "ul", items: ["Opening odometer", "Closing odometer", "Total km"] },
      { type: "h3", text: "5. Load details" },
      {
        type: "ul",
        items: [
          "Goods carried (or passengers)",
          "Weight or quantity",
          "LR / consignment note number",
          "E-way bill number, if one was generated"
        ]
      },
      { type: "h3", text: "6. Expenses during the trip" },
      {
        type: "ul",
        items: ["Diesel (litres and ₹)", "Toll / FASTag", "Loading and unloading", "Driver bata", "Other expenses", "Total"]
      },
      { type: "h3", text: "7. Money" },
      {
        type: "ul",
        items: [
          "Advance given",
          "Expenses paid by the driver",
          "Balance to return or pay",
          "Freight amount agreed with the customer"
        ]
      },
      { type: "h3", text: "8. Sign-off" },
      { type: "ul", items: ["Driver signature", "Office signature", "Proof of delivery received (yes/no)"] },
      { type: "h2", id: "trip-sheet-template", text: "Ready-to-use trip sheet template" },
      { type: "p", text: "Copy this into Excel or Google Sheets, or print it:" },
      { type: "template", caption: "Trip sheet", columns: ["Field", "Entry"], rows: TRIP_SHEET_FIELDS },
      { type: "download", href: TRIP_SHEET_DOWNLOAD, label: "Download Excel template" },
      { type: "h2", id: "common-mistakes", text: "5 common trip sheet mistakes" },
      {
        type: "mistakes",
        items: [
          {
            title: "Not recording the odometer reading at the start.",
            text: "Without the opening reading, you can't check the kilometres or the diesel claimed. Make the driver note it before leaving the yard."
          },
          {
            title: "Collecting trip sheets at the end of the week.",
            text: "By then, receipts are lost and details are forgotten. Collect them as soon as the trip ends."
          },
          {
            title: "No running number.",
            text: "If trip sheets aren't numbered, a missing sheet means a trip that never gets billed. Number every sheet, and check for gaps."
          },
          {
            title: "Expenses without bills.",
            text: "Ask for a photo of every fuel slip and toll receipt. It protects both the owner and an honest driver."
          },
          {
            title: "Billing from memory.",
            text: "Raise the customer's bill from the trip sheet, not from a diary or a phone call. The trip sheet is your proof."
          }
        ]
      },
      { type: "h2", id: "when-paper-stops-working", text: "When paper trip sheets stop working" },
      {
        type: "p",
        text: "Paper works fine with one or two vehicles. As the fleet grows, problems pile up: sheets get lost, totals are added up wrongly, and no one can say how many trips a vehicle ran this month without counting pages."
      },
      {
        type: "p",
        text: "That's when transport owners move to digital trip sheets. Each trip is saved against its vehicle, driver and booking. Expenses are added as they happen, and the bill is raised straight from the trip record, so no trip is missed."
      }
    ]
  }
];

/** A post by slug, or null. Unpublished posts are returned too (the page route only builds published ones). */
export function getPost(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug) || null;
}

/** Published posts, newest first. The blog list, the post routes and the sitemap all read this. */
export function publishedPosts() {
  return BLOG_POSTS.filter((post) => post.published !== false).sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished)
  );
}

/** The post's URL path ("/blog/trip-sheet-format"). */
export function postPath(post) {
  return `/blog/${post.slug}`;
}

/** Table of contents: the post's H2s, in order. */
export function postHeadings(post) {
  return post.blocks.filter((block) => block.type === "h2").map(({ id, text }) => ({ id, text }));
}

/** The first paragraph, for list-page excerpts. */
export function postExcerpt(post) {
  return post.blocks.find((block) => block.type === "p")?.text || post.description;
}

/** Article JSON-LD. Credited to the Organization until a named author is published. */
export function articleSchema(post, siteUrl = getSiteUrl()) {
  const url = `${siteUrl}${postPath(post)}`;
  const organization = { "@id": `${siteUrl}/#organization` };
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.h1,
    description: post.description,
    image: `${siteUrl}${post.ogImage}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: { "@type": "Organization", name: "ZUGEE", ...organization },
    publisher: organization,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.category,
    inLanguage: "en-IN"
  };
}

/** BreadcrumbList matching the post's visible breadcrumb: Home / Blog / post title. */
export function blogBreadcrumbSchema(post, siteUrl = getSiteUrl()) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", item: `${siteUrl}/` },
      { name: "Blog", item: `${siteUrl}/blog` },
      { name: post.h1, item: `${siteUrl}${postPath(post)}` }
    ].map((crumb, i) => ({ "@type": "ListItem", position: i + 1, ...crumb }))
  };
}

/** Both schemas in one graph, for the post page's <script type="application/ld+json">. */
export function postPageSchema(post, siteUrl = getSiteUrl()) {
  return { "@context": CONTEXT, "@graph": [articleSchema(post, siteUrl), blogBreadcrumbSchema(post, siteUrl)] };
}

/** "31 October 2026" (en-IN). Parsed as UTC so the date never shifts with the server's time zone. */
export function formatPostDate(isoDate) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${isoDate}T00:00:00Z`)
  );
}
