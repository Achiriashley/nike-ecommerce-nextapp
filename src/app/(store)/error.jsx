"use client";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="container pt-16">
      <EmptyState icon={AlertTriangle} title="Something went wrong" description="Please try again. If the problem continues, contact us.">
        <Button onClick={reset}>Try again</Button>
      </EmptyState>
    </div>
  );
}
