// app/layout.jsx
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/ui/MotionProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"]
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://zugee.com"),
  title: {
    default: "GST Billing & Inventory Software for Small Business | Zugee",
    template: "%s | Zugee Systems Technologies"
  },
  description:
    "Business management software for small businesses in India: GST billing, stock tracking and WhatsApp payment reminders in one login. From ₹1,999/month.",
  keywords: [
    "Zugee",
    "business management software for small business India",
    "GST billing and inventory software",
    "GST billing software",
    "inventory management software India",
    "WhatsApp payment reminders",
    "Tally alternative"
  ],
  authors: [{ name: "Zugee Systems Technologies Pvt. Ltd." }],
  openGraph: {
    title: "Zugee — GST billing and inventory software for small businesses in India",
    description: "GST billing, stock tracking and WhatsApp payment reminders in one login. From ₹1,999/month.",
    url: "/",
    siteName: "Zugee Systems Technologies",
    images: [
      {
        url: "/zugee-brand-banner.png",
        width: 1024,
        height: 512,
        alt: "Zugee Systems Technologies — Engineered for operational precision."
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Zugee — GST billing and inventory software for small businesses in India",
    description: "GST billing, stock tracking and WhatsApp payment reminders in one login. From ₹1,999/month.",
    images: ["/zugee-brand-banner.png"]
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
      lang="en"
      className={`dark ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased bg-[#06090F] text-white selection:bg-[#00F0FF]/30 selection:text-white">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
