import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/server/admin";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import Logo from "@/components/layout/Logo";

export const metadata = { title: "Admin sign in" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin/dashboard");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-[400px] rounded-3xl bg-white p-8 shadow-card">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-ink">Admin sign in</h1>
        <p className="mt-1 text-sm text-neutral-600">Manage products, orders and subscribers.</p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
