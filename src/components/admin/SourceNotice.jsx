import { Database, AlertTriangle } from "lucide-react";
import SeedButton from "./SeedButton";

// Explains where the storefront's products are coming from right now.
export default function SourceNotice({ source }) {
  if (source === "database") return null;
  if (source === "offline") {
    return (
      <div className="flex gap-3 rounded-2xl border border-[#f5c2b3] bg-[#fdf1ed] p-4 text-sm text-ink">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-sale" aria-hidden />
        <div>
          <p className="font-semibold">The database isn’t connected</p>
          <p className="mt-0.5 text-neutral-700">
            The store is showing the built-in starter catalog. Set <code className="rounded bg-white px-1">MONGO_DB</code> to manage products, orders and subscribers.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-brand-soft p-4 text-sm text-ink">
      <Database className="h-5 w-5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">Your database has no products yet</p>
        <p className="mt-0.5 text-neutral-700">The store is showing the starter catalog. Import it to edit, price and restock those products here.</p>
      </div>
      <SeedButton />
    </div>
  );
}
