// app/(marketing)/layout.jsx
// Public site chrome. The /admin routes live outside this group, so they never render the navbar or footer.

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MarketingLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#06090F] text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
