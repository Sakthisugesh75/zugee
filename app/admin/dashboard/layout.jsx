// app/admin/dashboard/layout.jsx
// Server-side gate: the dashboard is never rendered without a valid admin session cookie.

import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/auth";

// page.jsx is a client component and cannot export metadata, so it lives here.
export const metadata = {
  title: "Admin Lead Queue",
  description: "Review, filter and follow up on website demo and pricing requests.",
  // Also set by app/admin/layout.jsx; repeated so no admin page depends on the layout for it.
  robots: { index: false, follow: false }
};

export default async function AdminDashboardLayout({ children }) {
  if (!(await hasAdminSession())) {
    redirect("/admin");
  }
  return children;
}
