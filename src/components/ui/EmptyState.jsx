import { cn } from "@/lib/utils";

export default function EmptyState({ icon: Icon, title, description, children, className }) {
  return (
    <div className={cn("flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center", className)}>
      {Icon && (
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-surface">
          <Icon className="h-6 w-6 text-ink" aria-hidden />
        </span>
      )}
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {description && <p className="mt-2 max-w-sm text-sm text-neutral-600">{description}</p>}
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
