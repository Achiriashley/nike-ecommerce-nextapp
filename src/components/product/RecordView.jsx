"use client";
import { useEffect } from "react";
import { useStoreRecent } from "@/store/recent.store";
import { useHydrated } from "@/store/hydration.store";

// Adds the product to "recently viewed" once stored history has loaded.
export default function RecordView({ product }) {
  const hydrated = useHydrated();
  const record = useStoreRecent((s) => s.record);
  useEffect(() => {
    if (hydrated) record(product);
  }, [hydrated, product, record]);
  return null;
}
