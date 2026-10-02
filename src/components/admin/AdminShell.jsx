"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Receipt, Mail, Store, LogOut } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/dashboard/products", label: "Products", icon: Package },
  { href: "/admin/dashboard/orders", label: "Orders", icon: Receipt },
  { href: "/admin/dashboard/subscribers", label: "Subscribers", icon: Mail },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const isActive = (href) => (href === "/admin/dashboard" ? pathname === href : pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r bg-white p-4 lg:flex">
        <div className="px-2 py-2"><Logo /></div>
        <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Manage</p>
        <nav className="mt-2 space-y-1" aria-label="Admin">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition",
                isActive(href) ? "bg-ink text-white" : "text-neutral-700 hover:bg-surface hover:text-ink"
              )}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden /> {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-1 border-t pt-4">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-neutral-700 hover:bg-surface hover:text-ink">
            <Store className="h-[18px] w-[18px]" aria-hidden /> View store
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-neutral-700 hover:bg-surface hover:text-ink">
            <LogOut className="h-[18px] w-[18px]" aria-hidden /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b bg-white lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Logo />
            <button onClick={logout} className="rounded-full p-2 text-ink hover:bg-surface" aria-label="Sign out"><LogOut className="h-5 w-5" /></button>
          </div>
          <nav className="scrollbar-none flex gap-1 overflow-x-auto px-3 pb-2" aria-label="Admin">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} className={cn("shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium", isActive(href) ? "bg-ink text-white" : "text-neutral-700 hover:bg-surface")}>
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <main id="main" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
