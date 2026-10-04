// app/admin/page.jsx
// Admin login. Already-authenticated admins are sent straight to the dashboard.

import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Admin Sign In",
  description: "Sign in to the ZUGEE admin portal.",
  // Also set by app/admin/layout.jsx; repeated so no admin page depends on the layout for it.
  robots: { index: false, follow: false }
};

export default async function AdminLoginPage() {
  if (await hasAdminSession()) {
    redirect("/admin/dashboard");
  }
  return <AdminLoginForm />;
}
