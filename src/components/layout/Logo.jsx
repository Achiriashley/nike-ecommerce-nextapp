import Image from "next/image";
import Link from "next/link";
import { STORE_NAME } from "@/config/store";
import { cn } from "@/lib/utils";

export default function Logo({ inverse = false, className }) {
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center gap-2 rounded-md", className)} aria-label={`${STORE_NAME} home`}>
      <Image src={inverse ? "/logo-light.png" : "/logo-dark.png"} alt="" width={45} height={16} className="h-4 w-[45px]" priority />
      <span className={cn("text-[17px] font-bold tracking-tight", inverse ? "text-white" : "text-ink")}>{STORE_NAME}</span>
    </Link>
  );
}
