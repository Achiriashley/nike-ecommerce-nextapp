import Link from "next/link";
import { STORE_NAME } from "@/config/store";
import { cn } from "@/lib/utils";

// Text wordmark: the first word of the store name in ink, the rest in the brand
// colour (e.g. "Ash" + "Kicks").
const splitName = (name) => {
  const match = name.match(/^([A-Z][a-z]+)([A-Z].*)$/);
  return match ? [match[1], match[2]] : [name, ""];
};

export default function Logo({ inverse = false, className }) {
  const [first, rest] = splitName(STORE_NAME);
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center rounded-md", className)} aria-label={`${STORE_NAME} home`}>
      <span className={cn("text-[21px] font-black italic leading-none tracking-tighter", inverse ? "text-white" : "text-ink")}>
        {first}
        {rest && <span className={inverse ? "text-brand" : "text-brand-dark"}>{rest}</span>}
      </span>
    </Link>
  );
}
