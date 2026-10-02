import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SectionHeading({ eyebrow, title, description, href, linkLabel = "View all", className, children }) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && <p className="mb-1.5 text-xs font-semibold uppercase tracking-[.14em] text-brand-dark">{eyebrow}</p>}
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-[28px]">{title}</h2>
        {description && <p className="mt-1.5 max-w-xl text-[15px] text-neutral-600">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        {children}
        {href && (
          <Link href={href} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-brand-dark">
            {linkLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
