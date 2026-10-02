import Link from "next/link";
import { Compass } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container pt-16">
      <EmptyState icon={Compass} title="We couldn’t find that page" description="The link may be broken, or the product may no longer be available.">
        <Button asChild><Link href="/shop">Shop all shoes</Link></Button>
        <Button asChild variant="outline"><Link href="/">Go home</Link></Button>
      </EmptyState>
    </div>
  );
}
