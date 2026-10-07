// app/admin/layout.jsx
// Isolated layout for internal admin portal.
// Excluded from all search engines and crawlers.

export const metadata = {
  description: "Internal administrative portal for ZUGEE staff.",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({ children }) {
  return (
    // The admin portal isn't themed: data-theme="dark" keeps it dark even when the public site is light.
    <div data-theme="dark" className="min-h-screen bg-[#070A0F] text-[#F4F1EA]">
      {children}
    </div>
  );
}
