"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewsletterForm({ inverse = false, className }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState({ status: "idle", message: "" });

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: "loading", message: "" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setState({ status: "done", message: "You’re on the list. Watch your inbox for drops and offers." });
      setEmail("");
    } catch (error) {
      setState({ status: "error", message: error.message });
    }
  };

  if (state.status === "done") {
    return (
      <p className={cn("flex items-center gap-2 text-sm", inverse ? "text-white" : "text-ink", className)} role="status">
        <CheckCircle2 className="h-5 w-5 text-success" aria-hidden /> {state.message}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className={className} noValidate>
      <div className={cn("flex h-12 items-center rounded-full border pl-4 pr-1", inverse ? "border-white/25 bg-white/10" : "border-input bg-white")}>
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-invalid={state.status === "error"}
          aria-describedby="newsletter-msg"
          className={cn("h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none focus-visible:ring-0 focus-visible:ring-offset-0", inverse ? "text-white placeholder:text-white/60" : "text-ink placeholder:text-neutral-500")}
        />
        <button
          type="submit"
          disabled={state.status === "loading"}
          className="flex h-10 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold text-ink transition hover:bg-[#ff6f3b] disabled:opacity-60"
        >
          {state.status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ArrowRight className="h-4 w-4" aria-hidden />}
          Subscribe
        </button>
      </div>
      <p id="newsletter-msg" role="alert" className={cn("mt-2 min-h-5 text-sm", inverse ? "text-[#ffb59a]" : "text-sale")}>
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}
