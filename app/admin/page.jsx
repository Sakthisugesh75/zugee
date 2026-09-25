// app/admin/page.jsx
// Admin login. Already-authenticated admins are sent straight to the dashboard.

import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) {
    redirect("/admin/dashboard");
  }
  return <AdminLoginForm />;
}
