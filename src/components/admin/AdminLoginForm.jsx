"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [state, setState] = useState({ loading: false, error: "" });

  const submit = async (e) => {
    e.preventDefault();
    setState({ loading: true, error: "" });
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.replace("/admin/dashboard");
      router.refresh();
      return;
    }
    const data = await res.json().catch(() => ({}));
    setState({ loading: false, error: data.error || "Could not sign in" });
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="admin-email" className="text-sm font-semibold text-ink">Email</label>
        <Input id="admin-email" type="email" autoComplete="username" required className="mt-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <label htmlFor="admin-password" className="text-sm font-semibold text-ink">Password</label>
        <div className="relative mt-2">
          <Input id="admin-password" type={show ? "text" : "password"} autoComplete="current-password" required className="pr-11" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 text-neutral-500 hover:text-ink" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {state.error && <p className="text-sm font-medium text-sale" role="alert">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={state.loading}>
        {state.loading && <Loader2 className="animate-spin" aria-hidden />} Sign in
      </Button>
    </form>
  );
}
