// app/(marketing)/about/page.jsx
// About ZUGEE: what we build, why, how we differ, the team and how to reach us.
// Owner details (founder story, team, address, CIN/GSTIN) come from lib/about.js and each section
// renders only once its data is filled in. Nothing unfilled is ever shown as placeholder text.

import { Layers, Wrench, FileSpreadsheet, Download, BadgeCheck, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import PageIntro from "@/components/about/PageIntro";
import DemoCTA from "@/components/about/DemoCTA";
import FounderCard from "@/components/about/FounderCard";
import { ADDRESS, CIN, FOUNDERS, FOUNDER_STORY, GSTIN, isFilled } from "@/lib/about";
import { COMPANY } from "@/lib/legal";
import { LOCATION_DISPLAY, PHONE_DISPLAY, PHONE_E164, SUPPORT_EMAIL, WHATSAPP_CHAT_URL, getSiteUrl } from "@/lib/site";
import { serializeJsonLd } from "@/lib/structured-data";

const TITLE = "About ZUGEE | Business Software Company in Salem, Tamil Nadu";
const DESCRIPTION =
  "ZUGEE builds industry-specific CRM, ERP and GST billing software for Indian SMEs. Meet the team in Salem, Tamil Nadu, and see how we work.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  // openGraph and twitter replace the root layout's objects, so every field is repeated.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/about",
    siteName: "ZUGEE",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: TITLE }],
    locale: "en_IN",
    type: "website"
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.jpg"] }
};

const DIFFERENCES = [
  {
    icon: Layers,
    title: "One product per industry.",
    body: "A transport owner and a school principal don't need the same screens. Each ZUGEE product has the words, fields and workflows that business already uses."
  },
  {
    icon: Wrench,
    title: "We set it up for you.",
    body: "Our team maps your workflow, moves your data across from Excel or Tally, and trains your staff. Typical setup takes 14 days."
  },
  {
    icon: FileSpreadsheet,
    title: "Your accountant keeps Tally.",
    body: "ZUGEE runs your daily operations and billing. Your CA can keep using Tally for filings, and we export the data they need."
  },
  {
    icon: Download,
    title: "You own your data.",
    body: "Export it anytime. No lock-in."
  },
  {
    icon: BadgeCheck,
    title: "We tell you what's ready and what isn't.",
    body: "If a feature is still being built, like WhatsApp sending, we say so."
  }
];

function breadcrumbSchema(siteUrl = getSiteUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}/about` }
    ]
  };
}

const H2 = "text-3xl sm:text-4xl font-extrabold text-fg tracking-tight leading-tight";

export default function AboutPage() {
  const showStory = isFilled(FOUNDER_STORY);
  const showTeam = isFilled(FOUNDERS);
  const storyParagraphs = Array.isArray(FOUNDER_STORY) ? FOUNDER_STORY : [FOUNDER_STORY];
  const addressLines = isFilled(ADDRESS) ? (Array.isArray(ADDRESS) ? ADDRESS : [ADDRESS]) : [LOCATION_DISPLAY];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema()) }} />

      <PageIntro crumbs={[{ label: "Home", href: "/" }, { label: "About" }]} eyebrow="Our company" title="About ZUGEE" />

      {/* What we do */}
      <section aria-labelledby="about-what" className="py-16 sm:py-20 bg-canvas-alt border-b border-ink/[0.06]">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
          <h2 id="about-what" className={`${H2} mb-6`}>
            Software built for the way Indian businesses actually run
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            <p>
              Most small and medium businesses in India run on three tools: WhatsApp for updates, Excel for records and
              Tally for accounts. It works, until the business grows. Then the same customer details get typed three
              times, staff spend their day chasing updates on the phone, and the owner can&apos;t see what&apos;s
              happening without calling someone.
            </p>
            <p>
              ZUGEE was started in Salem to fix that. Instead of one general software that every business has to bend
              itself to fit, we build a separate product for each industry — fleet operators, travel agencies, water
              suppliers, builders, garment units, schools, colleges, PGs, resorts and hospitals.
            </p>
          </div>
        </div>
      </section>

      {/* TODO(owner): Founder story, 3–5 sentences. Fill FOUNDER_STORY in lib/about.js; hidden until then. */}
      {showStory && (
        <section aria-labelledby="about-why" className="py-16 sm:py-20 bg-canvas border-b border-ink/[0.06]">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
            <h2 id="about-why" className={`${H2} mb-6`}>
              Why we started
            </h2>
            <div className="space-y-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              {storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How we differ */}
      <section
        aria-labelledby="about-different"
        className={`py-16 sm:py-20 border-b border-ink/[0.06] ${showStory ? "bg-canvas-alt" : "bg-canvas"}`}
      >
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <h2 id="about-different" className={`${H2} mb-10 max-w-3xl`}>
            What makes us different
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 list-none p-0 m-0">
            {DIFFERENCES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="h-full p-6 rounded-2xl bg-card border border-line shadow-card">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-fg leading-snug mb-2">{title}</h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TODO(owner): Founder cards (photo, name, role, 2–3 line bio). Fill FOUNDERS in lib/about.js; hidden until then. */}
      {showTeam && (
        <section
          aria-labelledby="about-team"
          className={`py-16 sm:py-20 border-b border-ink/[0.06] ${showStory ? "bg-canvas" : "bg-canvas-alt"}`}
        >
          <div className="container max-w-6xl mx-auto px-4 sm:px-6">
            <h2 id="about-team" className={`${H2} mb-10`}>
              The team
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 list-none p-0 m-0">
              {FOUNDERS.map((founder) => (
                <li key={founder.name}>
                  <FounderCard founder={founder} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Contact details */}
      <section
        aria-labelledby="about-where"
        className={`py-16 sm:py-20 border-b border-ink/[0.06] ${showStory === showTeam ? "bg-canvas-alt" : "bg-canvas"}`}
      >
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
          <h2 id="about-where" className={`${H2} mb-8`}>
            Where we are
          </h2>
          <div className="p-6 sm:p-8 rounded-2xl bg-card border border-line shadow-card">
            <p className="text-lg font-bold text-fg mb-5">{COMPANY.name}</p>
            <dl className="space-y-4 text-base text-slate-300">
              <div className="flex gap-3">
                <dt className="shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                  <span className="sr-only">Address</span>
                </dt>
                {/* TODO(owner): full address. Fill ADDRESS in lib/about.js; until then LOCATION_DISPLAY is shown. */}
                <dd className="m-0">
                  <address className="not-italic">
                    {addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                  <span className="sr-only">Phone and WhatsApp</span>
                </dt>
                <dd className="m-0">
                  Phone / WhatsApp:{" "}
                  <a href={`tel:${PHONE_E164}`} className="font-semibold text-fg hover:text-cyan-400 transition-colors">
                    {PHONE_DISPLAY}
                  </a>
                  <a
                    href={WHATSAPP_CHAT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 inline-flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    Chat on WhatsApp
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="shrink-0 mt-0.5">
                  <Mail className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                  <span className="sr-only">Email</span>
                </dt>
                <dd className="m-0">
                  Email:{" "}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-fg hover:text-cyan-400 transition-colors break-all">
                    {SUPPORT_EMAIL}
                  </a>
                </dd>
              </div>
            </dl>
            {/* TODO(owner, optional): CIN and GSTIN. Fill CIN / GSTIN in lib/about.js; each line hidden until filled. */}
            {(isFilled(CIN) || isFilled(GSTIN)) && (
              <dl className="mt-6 pt-5 border-t border-ink/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-400">
                {isFilled(CIN) && (
                  <div>
                    <dt className="inline font-semibold text-slate-300">CIN: </dt>
                    <dd className="inline m-0 font-mono break-all">{CIN}</dd>
                  </div>
                )}
                {isFilled(GSTIN) && (
                  <div>
                    <dt className="inline font-semibold text-slate-300">GSTIN: </dt>
                    <dd className="inline m-0 font-mono break-all">{GSTIN}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>
      </section>

      <DemoCTA title="Talk to us" alt={showStory !== showTeam}>
        Not sure which ZUGEE product fits your business? Book a free demo and we&apos;ll show you the software working
        with your own examples.
      </DemoCTA>
    </>
  );
}
