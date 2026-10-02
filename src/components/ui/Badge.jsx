import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-white text-ink",
  dark: "bg-ink text-white",
  brand: "bg-brand-soft text-brand-dark",
  sale: "bg-sale text-white",
  success: "bg-success-soft text-success",
  muted: "bg-surface text-neutral-700",
};

export default function Badge({ tone = "neutral", className, children }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-none", tones[tone], className)}>
      {children}
    </span>
  );
}
