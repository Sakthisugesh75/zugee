// app/admin/layout.jsx
// Isolated layout for internal admin portal.
// Excluded from all search engines and crawlers.

export const metadata = {
  title: "Admin Portal | Zugee Systems Technologies",
  description: "Internal administrative portal for managing incoming lead queue.",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#070A0F] text-[#F4F1EA]">
      {children}
    </div>
  );
}
