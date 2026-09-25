// app/admin/dashboard/layout.jsx
// Server-side gate: the dashboard is never rendered without a valid admin session cookie.

import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/auth";

export default async function AdminDashboardLayout({ children }) {
  if (!(await hasAdminSession())) {
    redirect("/admin");
  }
  return children;
}
