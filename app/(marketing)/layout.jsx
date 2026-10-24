// app/(marketing)/layout.jsx
// Public site chrome. The /admin routes live outside this group, so they never render the navbar or footer.
// .site-theme scopes the light theme's palette remapping (app/globals.css) to the public site.

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export default function MarketingLayout({ children }) {
  return (
    <div className="site-theme flex flex-col min-h-screen bg-canvas text-fg">
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      {/* "Ask ZUGEE" assistant on every public page. In the layout, so a chat survives page changes. */}
      <ChatWidget />
    </div>
  );
}
