"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { NAV_LINKS } from "./nav";
import { cn } from "@/lib/utils";

export default function CategoryBar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const isActive = (link) =>
    pathname === "/shop" && Object.entries(link.match).every(([k, v]) => params.get(k) === v);

  return (
    <nav aria-label="Categories" className="border-t">
      <ul className="container scrollbar-none flex gap-1 overflow-x-auto">
        {NAV_LINKS.map((link) => {
          const active = isActive(link);
          return (
            <li key={link.label} className="shrink-0">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-11 items-center px-3 text-[14px] font-medium text-neutral-700 transition-colors hover:text-ink",
                  "after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-ink after:transition-transform hover:after:scale-x-100",
                  active && "text-ink after:scale-x-100",
                  link.highlight && "text-sale hover:text-sale after:bg-sale"
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
