// app/layout.jsx
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"]
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

const SHARE_TITLE = "ZUGEE — Business software built for the way your business operates";
const SHARE_DESCRIPTION = "Industry-focused CRM, ERP, billing and operations software for Indian businesses.";

export const metadata = {
  // Relative URLs below (canonical, og:url, og:image, twitter:image) resolve against this.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ZUGEE — Business Software for Indian Businesses",
    template: "%s | ZUGEE"
  },
  description: SHARE_DESCRIPTION,
  authors: [{ name: "Zugee Systems Technologies Pvt. Ltd." }],
  openGraph: {
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    url: "/",
    siteName: "ZUGEE",
    // 1200×630 JPEG under 60 KB: WhatsApp and LinkedIn drop previews for large images.
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SHARE_TITLE }],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: ["/og.jpg"]
  },
  // Mascot head crop. app/favicon.ico (16 + 32px) is picked up automatically by Next.js.
  icons: {
    icon: [{ url: "/icon-192.png", type: "image/png", sizes: "192x192" }],
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-IN"
      className={`dark ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased bg-[#06090F] text-white selection:bg-[#00F0FF]/30 selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#00F0FF] focus:text-black focus:rounded-lg focus:font-bold focus:text-sm"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
