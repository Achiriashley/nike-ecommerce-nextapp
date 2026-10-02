"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Download } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

export default function SeedButton({ label = "Import starter catalog", variant = "default" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const run = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/seed", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) return toast.error(data.error || "Import failed");
    toast.success(data.inserted ? `Imported ${data.inserted} products` : "Everything is already imported");
    router.refresh();
  };
  return (
    <Button size="sm" variant={variant} onClick={run} disabled={loading}>
      {loading ? <Loader2 className="animate-spin" aria-hidden /> : <Download aria-hidden />} {label}
    </Button>
  );
}
