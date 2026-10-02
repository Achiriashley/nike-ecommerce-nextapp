import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/server/admin";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";
export const metadata = { title: { default: "Dashboard", template: "%s · Admin" } };

export default async function DashboardLayout({ children }) {
  if (!(await isAdmin())) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
